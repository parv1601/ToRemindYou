// models/Wish.js

import mongoose from 'mongoose';

const WishSchema = new mongoose.Schema({
    // The content of the wish/request
    message: {
        type: String,
        required: true,
    },
    // Timestamp for when the wish was submitted
    submittedAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model('Wish', WishSchema);