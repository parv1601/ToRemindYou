// utils/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const EMAIL_USER = process.env.GMAIL_USER;
const EMAIL_PASS = process.env.GMAIL_PASS;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const USER_NAME = 'Brinda';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

const supportivePhrases = [
  "Cute u r.",
  "Overactions u shouldn't do.",
  "Drink some water.",
  "Cwezy cwezy.",
  "U r hot if u didn't know.",
  "That waist!!!!!."
];

/* ---------------- TASK REMINDER → BRINDA ---------------- */
export async function sendTaskReminderEmail(task) {
  const brinda = await User.findOne({ name: 'Brinda' });
  if (!brinda?.email) return;

  await transporter.sendMail({
    from: `"ToRemindYou" <${EMAIL_USER}>`,
    to: brinda.email,
    subject: `Task Reminder: ${task.name}`,
    html: `
      <h2>Hey ${USER_NAME} 💕</h2>
      <p>Time to do:</p>
      <h3>${task.name}</h3>
      <p>Scheduled every ${task.recurrenceDays} day(s).</p>
    `
  });

  console.log(`Task email sent to ${brinda.email}`);
}

/* ---------------- SUPPORTIVE EMAIL → BRINDA ---------------- */
export async function sendRandomSupportiveEmail() {
  const brinda = await User.findOne({ name: 'Brinda' });
  if (!brinda?.email) return;

  const phrase =
    supportivePhrases[Math.floor(Math.random() * supportivePhrases.length)];

  await transporter.sendMail({
    from: `"ToRemindYou" <${EMAIL_USER}>`,
    to: brinda.email,
    subject: 'smth smth',
    html: `<p style="font-size:18px;">${phrase}</p>`
  });

  console.log(`💌 Supportive email sent to ${brinda.email}`);
}

/* ---------------- WISH EMAIL → YOU (ADMIN) ---------------- */
export async function sendWishEmail(wish) {
  await transporter.sendMail({
    from: `"ToRemindYou" <${EMAIL_USER}>`,
    to: ADMIN_EMAIL,
    subject: `New Wish from ${USER_NAME}`,
    html: `
      <h2>New Wish Submitted</h2>
      <p><strong>${USER_NAME}</strong> wrote:</p>
      <blockquote>${wish.message}</blockquote>
    `
  });

  console.log(`Wish email sent to admin: ${ADMIN_EMAIL}`);
}
