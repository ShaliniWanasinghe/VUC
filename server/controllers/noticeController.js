const Notice = require('../models/Notice');
const User = require('../models/User');
const Interest = require('../models/Interest');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/emailService');

const getNotices = async (req, res) => {
    try {
        const filter = {};

        // Filter by category if provided
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Filter by status if provided (and allowed)
        if (req.query.status) {
            // Only admins and moderators can specifically request 'pending' or 'rejected'
            // Students are restricted below regardless of what they request
            if (['admin', 'moderator'].includes(req.user.role)) {
                filter.status = req.query.status;
            }
        }

        // Role-based visibility
        if (req.user.role === 'student') {
            filter.status = 'published';
        } else if (req.user.role === 'moderator') {
            // If moderator explicitly requested a status, respect it (checked above)
            // Otherwise, show published + their own
            if (!req.query.status) {
                filter.$or = [
                    { status: 'published' },
                    { author: req.user._id }
                ];
            }
        }
        // Admin sees everything (or filtered by status if requested)

        const notices = await Notice.find(filter).sort({ createdAt: -1 });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/notices/:id — Get single notice
const getNoticeById = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);

        if (!notice) {
            return res.status(404).json({ message: 'Notice not found.' });
        }

        // Students can only see published notices
        if (req.user.role === 'student' && notice.status !== 'published') {
            return res.status(403).json({ message: 'Access denied.' });
        }

        res.json(notice);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Notice not found.' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST /api/notices — Create a new notice
const createNotice = async (req, res) => {
    const { title, content, category, date } = req.body;

    if (!title || !content || !category || !date) {
        return res.status(400).json({ message: 'Title, content, category, and date are required.' });
    }

    try {
        const status = req.user.role === 'admin' ? 'published' : 'pending';

        const notice = await Notice.create({
            title,
            content,
            category,
            date,
            status,
            author: req.user._id
        });

        // Populate author before sending response
        await notice.populate('author', 'userId name role');

        // Send Email Notification if published
        if (status === 'published') {
            try {
                // Fetch all students (and maybe other roles depending on requirements)
                // Using .select('email') to only get emails
                const users = await User.find({ role: 'student' }).select('email');
                const emails = users.map(user => user.email).filter(email => email); // Ensure valid emails

                if (emails.length > 0) {
                    const emailSubject = `New Notice: ${title}`;
                    const emailBody = `
                        <h2>New Notice Posted</h2>
                        <p><strong>Category:</strong> ${category}</p>
                        <p>${content}</p>
                        <p>Login to VUC to view more details.</p>
                    `;
                    await sendEmail(emails.join(','), emailSubject, emailBody);
                }

                // CREATE IN-APP NOTIFICATIONS for all students
                const notifications = users.map(user => ({
                    recipient: user._id,
                    message: `New Notice: ${title}`,
                    link: `/`,
                    type: 'important',
                    notice: notice._id
                }));
                await Notification.insertMany(notifications);
            } catch (emailError) {
                console.error('Error sending in-app/email notifications:', emailError);
            }
        }

        res.status(201).json(notice);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// PUT /api/notices/:id — Update a notice (title, content, category, date)
const updateNotice = async (req, res) => {
    const { title, content, category, date } = req.body;

    try {
        const notice = await Notice.findById(req.params.id);

        if (!notice) {
            return res.status(404).json({ message: 'Notice not found.' });
        }

        // Only admin or the original author can edit
        const isAuthor = notice.author._id.toString() === req.user._id.toString();
        if (req.user.role !== 'admin' && !isAuthor) {
            return res.status(403).json({ message: 'You can only edit your own notices.' });
        }

        // Moderators cannot edit published notices
        if (req.user.role !== 'admin' && notice.status === 'published') {
            return res.status(403).json({ message: 'Cannot edit published notices.' });
        }

        // Update fields
        if (title) notice.title = title;
        if (content) notice.content = content;
        if (category) notice.category = category;
        if (date) notice.date = date;

        // If non-admin edits, reset to pending
        if (req.user.role !== 'admin') {
            notice.status = 'pending';
        }

        await notice.save();
        await notice.populate('author', 'userId name role');

        // NOTIFY INTERESTED USERS
        try {
            const interactions = await Interest.find({ notice: notice._id }).populate('user', 'email');
            if (interactions.length > 0) {
                const notifications = interactions.map(inter => ({
                    recipient: inter.user._id,
                    message: `Update: The notice "${notice.title}" has been updated.`,
                    link: `/`,
                    type: inter.type === 'remind_me' ? 'reminder' : 'interest',
                    notice: notice._id
                }));
                await Notification.insertMany(notifications);

                // Email those who set reminders
                const reminderEmails = interactions
                    .filter(inter => inter.type === 'remind_me')
                    .map(inter => inter.user.email)
                    .filter(e => e);

                if (reminderEmails.length > 0) {
                    await sendEmail(
                        reminderEmails.join(','),
                        `Notice Updated: ${notice.title}`,
                        `<p>The notice you are following has been updated.</p><h3>${notice.title}</h3><p>${notice.content}</p>`
                    );
                }
            }
        } catch (notifError) {
            console.error('Error sending update notifications:', notifError);
        }

        res.json(notice);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Notice not found.' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// PATCH /api/notices/:id/status — Update notice status (Admin only)
const updateNoticeStatus = async (req, res) => {
    const { status } = req.body;

    if (!status || !['published', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Status must be "published" or "rejected".' });
    }

    try {
        const notice = await Notice.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!notice) {
            return res.status(404).json({ message: 'Notice not found.' });
        }

        // If newly published, notify all students
        if (status === 'published') {
            const users = await User.find({ role: 'student' }).select('_id email');
            const notifications = users.map(u => ({
                recipient: u._id,
                message: `New Notice: ${notice.title}`,
                link: `/`,
                type: 'important',
                notice: notice._id
            }));
            await Notification.insertMany(notifications).catch(e => console.error(e));

            // Email notifications
            const emails = users.map(u => u.email).filter(e => e);
            if (emails.length > 0) {
                await sendEmail(emails.join(','), `Notice Published: ${notice.title}`, `<p>${notice.content}</p>`).catch(e => console.error(e));
            }
        }

        res.json(notice);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Notice not found.' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// DELETE /api/notices/:id — Delete a notice
const deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);

        if (!notice) {
            return res.status(404).json({ message: 'Notice not found.' });
        }

        // Check permissions
        const isAuthor = notice.author._id.toString() === req.user._id.toString();
        if (req.user.role !== 'admin' && !isAuthor) {
            return res.status(403).json({ message: 'You can only delete your own notices.' });
        }

        // Moderators cannot delete published notices
        if (req.user.role !== 'admin' && notice.status === 'published') {
            return res.status(403).json({ message: 'Cannot delete published notices.' });
        }

        await Notice.findByIdAndDelete(req.params.id);
        res.json({ message: 'Notice deleted successfully.' });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Notice not found.' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST /api/notices/:id/interest — Toggle interest
const toggleInterest = async (req, res) => {
    try {
        const noticeId = req.params.id;
        const userId = req.user._id;

        const notice = await Notice.findById(noticeId);
        if (!notice) return res.status(404).json({ message: 'Notice not found' });

        const existing = await Interest.findOne({ user: userId, notice: noticeId, type: 'interested' });

        if (existing) {
            await Interest.findByIdAndDelete(existing._id);
            return res.json({ message: 'Removed from interests', status: 'removed' });
        } else {
            await Interest.create({ user: userId, notice: noticeId, type: 'interested' });

            // Create in-app notification
            await Notification.create({
                recipient: userId,
                message: `You marked "${notice.title}" as interested.`,
                link: `/`,
                type: 'interest',
                notice: noticeId
            });

            return res.json({ message: 'Added to interests', status: 'added' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST /api/notices/:id/remind — Toggle reminder
const toggleReminder = async (req, res) => {
    try {
        const noticeId = req.params.id;
        const userId = req.user._id;

        const notice = await Notice.findById(noticeId);
        if (!notice) return res.status(404).json({ message: 'Notice not found' });

        const existing = await Interest.findOne({ user: userId, notice: noticeId, type: 'remind_me' });

        if (existing) {
            await Interest.findByIdAndDelete(existing._id);
            return res.json({ message: 'Reminder removed', status: 'removed' });
        } else {
            await Interest.create({ user: userId, notice: noticeId, type: 'remind_me' });

            // Create in-app notification
            await Notification.create({
                recipient: userId,
                message: `Reminder set for "${notice.title}". We'll alert you of updates.`,
                link: `/`,
                type: 'reminder',
                notice: noticeId
            });

            // Send immediate confirmation email
            const emailSubject = `Reminder Set: ${notice.title}`;
            const emailBody = `
                <h2>Reminder Set Successfully</h2>
                <p>You have set a reminder for the following notice:</p>
                <p><strong>Title:</strong> ${notice.title}</p>
                <p><strong>Category:</strong> ${notice.category}</p>
                <hr />
                <p>${notice.content}</p>
                <p>We will notify you of any updates to this notice.</p>
            `;
            await sendEmail(req.user.email, emailSubject, emailBody);

            return res.json({ message: 'Reminder set successfully', status: 'added' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getNotices,
    getNoticeById,
    createNotice,
    updateNotice,
    updateNoticeStatus,
    deleteNotice,
    toggleInterest,
    toggleReminder
};
