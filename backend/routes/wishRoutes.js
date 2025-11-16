// routes/wishRoutes.js

import express from 'express';
import Wish from '../models/Wish.js'; // Import the Mongoose model
import { sendWishEmail } from '../utils/emailService.js'; // Import the email function

const router = express.Router();

/**
 * @route POST /api/wishes
 * @desc Allows Brinda to submit a wish and instantly notifies the Admin via email.
 */
router.post('/', async (req, res) => {
    // Expecting: { "message": "I wish we could go hiking this weekend." }
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Wish message is required.' });
    }

    try {
        // 1. Create and save the wish in the database
        const newWish = new Wish({ message });
        await newWish.save();

        // 2. CRITICAL: Trigger the instant email notification to the Admin
        await sendWishEmail(newWish); 

        // 3. Respond to the frontend
        res.status(201).json({ 
            message: 'Wish submitted successfully! Notification sent to Admin.',
            wish: newWish 
        });

    } catch (error) {
        console.error('Error submitting wish and sending email:', error);
        res.status(500).json({ 
            error: 'Failed to process wish submission.',
            details: error.message 
        });
    }
});

export default router;