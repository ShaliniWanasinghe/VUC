const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Notice = require('./models/Notice');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB for seeding');

        // Clear existing data
        await User.deleteMany({});
        await Notice.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Seed users
        const users = await User.create([
            { userId: '2020/ADM/001', name: 'Admin User', email: 'admin@vuc.edu', password: 'admin', role: 'admin' },
            { userId: '2020/MOD/001', name: 'Moderator User', email: 'mod@vuc.edu', password: 'mod', role: 'moderator' },
            { userId: '2021/ICT/075', name: 'Student User', email: 'student@vuc.edu', password: 'student', role: 'student' }
        ]);
        console.log(`👥 Created ${users.length} users`);

        const adminUser = users.find(u => u.role === 'admin');
        const modUser = users.find(u => u.role === 'moderator');

        // Seed notices
        const notices = await Notice.create([
            {
                title: 'Welcome to the New Semester',
                content: 'Classes will begin on Monday regarding the new academic year. All students are required to check their timetables on the university portal.',
                category: 'Academic',
                date: new Date('2025-01-15'),
                status: 'published',
                author: adminUser._id
            },
            {
                title: 'Football Team Selection',
                content: 'Trials for the university football team will be held at the main ground on Saturday at 9 AM. All interested students should register at the sports office.',
                category: 'Sports',
                date: new Date('2025-01-20'),
                status: 'pending',
                author: modUser._id
            },
            {
                title: 'Coding Club Workshop',
                content: 'Join our hands-on workshop on React and Node.js development. Open to all students. Refreshments will be provided.',
                category: 'Clubs & Societies',
                date: new Date('2025-02-01'),
                status: 'published',
                author: adminUser._id
            },
            {
                title: 'Counseling Services Available',
                content: 'Free counseling sessions are now available for all students at the Student Wellness Center. Book your appointment online.',
                category: 'Welfare & Student Services',
                date: new Date('2025-02-05'),
                status: 'published',
                author: adminUser._id
            }
        ]);
        console.log(`📋 Created ${notices.length} notices`);

        console.log('\n🎉 Seed completed successfully!');
        console.log('\n📌 Demo Credentials:');
        console.log('   Admin:     admin / admin');
        console.log('   Moderator: mod / mod');
        console.log('   Student:   student / student\n');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedData();
