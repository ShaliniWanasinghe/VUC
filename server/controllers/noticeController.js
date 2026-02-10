const Notice = require('../models/Notice');
const User = require('../models/User');
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

                    // Send to all emails
                    // In production, use a queue or bcc to avoid exposing all emails
                    // For simplicity, we loop or use bcc
                    // Using loop for individual simulation logs

                    // const sendEmail = require('../utils/emailService'); // Import here or top

                    // Sending to first user just for demo to avoid spamming loop in dev
                    // for (const email of emails) {
                    // await sendEmail(email, emailSubject, emailBody);
                    // }
                    // Sending to all as BCC
                    await sendEmail(emails.join(','), emailSubject, emailBody);

                }
            } catch (emailError) {
                console.error('Error sending email notifications:', emailError);
                // Do not fail the request if email fails
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

module.exports = { getNotices, getNoticeById, createNotice, updateNotice, updateNoticeStatus, deleteNotice };
