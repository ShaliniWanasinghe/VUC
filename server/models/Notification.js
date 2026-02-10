const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: '/'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['important', 'interest', 'reminder', 'system'],
        default: 'system'
    },
    notice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notice'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
