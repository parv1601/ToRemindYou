// models/Task.js (Update this file)

import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    recurrenceDays: {
        type: Number,
        required: true,
        min: 1,
    },
    // CRITICAL FIX: Changed from 'lastRemindedAt' to 'lastSentDate'
    lastSentDate: { 
        type: Date,
        required: true,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model('Task', TaskSchema); // <--- Use ES Module default export