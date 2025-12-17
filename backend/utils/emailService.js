// utils/emailService.js
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import User from '../models/User.js';

dotenv.config();

// -------- ENV VARS --------
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL; // verified sender in SendGrid
const USER_NAME = 'Brinda';

if (!SENDGRID_API_KEY || !FROM_EMAIL || !ADMIN_EMAIL) {
  console.error('Missing SendGrid environment variables');
}

// Init SendGrid
sgMail.setApiKey(SENDGRID_API_KEY);

// -------- SUPPORTIVE PHRASES --------
const supportivePhrases = [
  "Cute u r.",
  "Overactions u shouldn't do.",
  "Drink some water.",
  "Cwezy cwezy.",
  "U r hot if u didn't know.",
  "That waist!!!!!."
];

/* =========================================================
   TASK REMINDER → BRINDA
========================================================= */
export async function sendTaskReminderEmail(task) {
  try {
    const brinda = await User.findOne({ name: 'Brinda' });
    if (!brinda?.email) {
      console.warn('Brinda email not found');
      return;
    }

    await sgMail.send({
      to: brinda.email,
      from: FROM_EMAIL,
      subject: `Task Reminder: ${task.name}`,
      html: `
        <h2>Yoo hottie </h2>
        <p>Time to do:</p>
        <h3>${task.name}</h3>
        <p>Scheduled every ${task.recurrenceDays} day(s).</p>
      `
    });

    console.log(`Task reminder sent to ${brinda.email}`);
  } catch (error) {
    console.error('Task reminder email failed:', error.message);
  }
}

/* =========================================================
   SUPPORTIVE EMAIL → BRINDA
========================================================= */
export async function sendRandomSupportiveEmail() {
  try {
    const brinda = await User.findOne({ name: 'Brinda' });
    if (!brinda?.email) {
      console.warn('Brinda email not found');
      return;
    }

    const phrase =
      supportivePhrases[Math.floor(Math.random() * supportivePhrases.length)];

    await sgMail.send({
      to: brinda.email,
      from: FROM_EMAIL,
      subject: 'Smth smth',
      html: `
        <p style="font-size:18px;">${phrase}</p>
        <p style="color:#888;">Just a small reminder!!!!</p>
      `
    });

    console.log(`Supportive email sent to ${brinda.email}`);
  } catch (error) {
    console.error('Supportive email failed:', error.message);
  }
}

/* =========================================================
   WISH EMAIL → ADMIN (YOU)
========================================================= */
export async function sendWishEmail(wish) {
  try {
    await sgMail.send({
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
      subject: `New Wish from ${USER_NAME}`,
      html: `
        <h2>New Wish Submitted</h2>
        <p><strong>${USER_NAME}</strong> wrote:</p>
        <blockquote>${wish.message}</blockquote>
      `
    });

    console.log(`Wish email sent to admin: ${ADMIN_EMAIL}`);
  } catch (error) {
    console.error('Wish email failed:', error.message);
  }
}
