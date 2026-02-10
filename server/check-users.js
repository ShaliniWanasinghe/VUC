const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const users = await User.find({});
        console.log('👥 Users in database:');
        users.forEach(u => {
            console.log(`- ID: ${u.userId}, Email: ${u.email}, Role: ${u.role}`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

checkUsers();
