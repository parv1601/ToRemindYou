import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// --- GET /api/users - Fetch user 'Brinda'
router.get('/', async (req, res) => {
  try {
    let user = await User.findOne({ name: 'Brinda' });

    if (!user) {
      // Create user if not exists
      user = await User.create({ name: 'Brinda' });
    }

    res.json({ 
      name: user.name,
      email: user.email || null // Return the current email
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// --- PUT /api/users/email - Securely update Brinda's email
router.put('/email', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }
    
    // Simple validation (can be more robust)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    try {
        // Find the 'Brinda' user and update her email
        const user = await User.findOneAndUpdate(
            { name: 'Brinda' },
            { $set: { email: email } },
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).json({ error: 'Brinda user not found.' });
        }

        res.json({ 
            message: 'Email updated successfully!', 
            email: user.email 
        });

    } catch (err) {
        console.error('Error updating Brinda email:', err);
        res.status(500).json({ error: 'Failed to update email.' });
    }
});

export default router;