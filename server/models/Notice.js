const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Academic', 'Sports', 'Clubs & Societies', 'Welfare & Student Services', 'Marketplace', 'Lost & Found', 'Donations', 'Hostel & Accommodation']
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    status: {
        type: String,
        enum: ['published', 'pending', 'rejected'],
        default: 'pending'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Populate author info when querying
noticeSchema.pre(/^find/, function (next) {
    this.populate('author', 'userId name role');
    next();
});

module.exports = mongoose.model('Notice', noticeSchema);
