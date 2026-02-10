const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notice',
        required: true
    },
    type: {
        type: String,
        enum: ['interested', 'remind_me'],
        required: true
    }
}, {
    timestamps: true
});

// Compound index to ensure a user can only have one type of interaction per notice
interestSchema.index({ user: 1, notice: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Interest', interestSchema);
