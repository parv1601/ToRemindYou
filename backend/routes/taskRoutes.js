import { Router } from 'express';
import Task from '../models/Task.js'; 

const router = Router();

// --- 1. GET all Tasks ---
// @route GET /api/tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: 1 });
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error fetching tasks');
    }
});

// --- 2. CREATE a new Task ---
// @route POST /api/tasks
router.post('/', async (req, res) => {
    const { name, recurrenceDays } = req.body;

    if (!name || !recurrenceDays) {
        return res.status(400).json({ msg: 'Please enter both task name and recurrence frequency (days).' });
    }

    try {
        const newTask = new Task({
            name,
            recurrenceDays,
            // lastSentDate defaults to Date.now() when created
        });

        const task = await newTask.save();
        res.status(201).json(task);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error creating task');
    }
});

// --- 3. UPDATE a Task (Resets timer, etc.) ---
// @route PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
    const { name, recurrenceDays, lastSentDate } = req.body;

    const taskFields = {};
    if (name) taskFields.name = name;
    if (recurrenceDays) taskFields.recurrenceDays = recurrenceDays;
    if (lastSentDate) taskFields.lastSentDate = lastSentDate; 

    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: taskFields },
            { new: true } 
        );

        res.json(task);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.status(500).send('Server Error updating task');
    }
});

// --- 4. DELETE a Task (This is the route that was likely missing or corrupted) ---
// @route DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
    try {
        // Find by ID and delete
        const result = await Task.findByIdAndDelete(req.params.id);
        
        if (!result) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        // Catch invalid object ID format
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.status(500).send('Server Error deleting task');
    }
});

export default router;