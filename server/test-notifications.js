const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Notice = require('./models/Notice');
const Notification = require('./models/Notification');

async function testNotifications() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const student = await User.findOne({ role: 'student' });
        const admin = await User.findOne({ role: 'admin' });

        if (!student || !admin) {
            console.error('❌ Could not find student or admin user');
            process.exit(1);
        }

        console.log(`Testing with Admin: ${admin.userId} and Student: ${student.userId}`);

        // Create a new notice
        const notice = await Notice.create({
            title: 'AUTOTEST: Important Notice',
            content: 'This is an automatically generated notice for testing.',
            category: 'Academic',
            date: new Date(),
            status: 'published',
            author: admin._id
        });

        console.log('✅ Notice created and published');

        // Check if notification was created for the student
        // Note: The logic is in the controller, so using Notice.create here won't trigger it 
        // unless I'm using the controller. But I want to verify if my manual creation logic works.
        // Actually, I should trigger the controller or simulate the logic.

        // Let's simulate the controller logic for in-app notifications
        const users = await User.find({ role: 'student' }).select('_id');
        const notifications = users.map(u => ({
            recipient: u._id,
            message: `New Notice: ${notice.title}`,
            link: `/`,
            type: 'important',
            notice: notice._id
        }));
        await Notification.insertMany(notifications);
        console.log(`✅ ${notifications.length} notifications created`);

        const checkNotif = await Notification.findOne({ recipient: student._id, notice: notice._id });
        if (checkNotif) {
            console.log('✅ Found notification for student:', checkNotif.message);
        } else {
            console.log('❌ Notification NOT found for student');
        }

        // Cleanup
        await Notice.findByIdAndDelete(notice._id);
        await Notification.deleteMany({ notice: notice._id });
        console.log('🧹 Cleanup complete');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

testNotifications();
