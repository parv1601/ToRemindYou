import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import {
  sendTaskReminderEmail,
  sendWishEmail,
  sendRandomSupportiveEmail
} from './utils/emailService.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import wishRoutes from './routes/wishRoutes.js';
import Task from './models/Task.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/wishes', wishRoutes);

// Cron job: Runs daily at 9:00 AM server time
cron.schedule('0 9 * * *', async () => {
  try {
    const now = new Date();
    const tasks = await Task.find({});

    for (const task of tasks) {
      const lastSent = task.lastSentDate || new Date(0);
      const diffTime = now.getTime() - lastSent.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);

      if (diffDays >= task.recurrenceDays) {
        try {
          await sendTaskReminderEmail(task);
          task.lastSentDate = now;
          await task.save();
          console.log(`Sent reminder for task: ${task.name}`);
        } catch (emailErr) {
          console.error(`Failed to send reminder for task "${task.name}":`, emailErr);
        }
      }
    }
  } catch (err) {
    console.error('Error in daily task reminder cron job:', err);
  }
});

// Send random supportive email twice a day (9AM and 9PM)
cron.schedule('0 9,21 * * *', async () => {
  try {
    await sendRandomSupportiveEmail();
    console.log('Sent random supportive email');
  } catch (err) {
    console.error('Failed to send random supportive email:', err);
  }
});

// Global error handler for unexpected errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
