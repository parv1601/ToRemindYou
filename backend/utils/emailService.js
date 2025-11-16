import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import User from '../models/User.js'; // <-- Import User model

dotenv.config();

// --- Environment Variables (Now only need Admin & Sender) ---
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const EMAIL_USER = process.env.GMAIL_USER;
const EMAIL_PASS = process.env.GMAIL_PASS;
// USER_NAME is needed for personalization.
const USER_NAME = process.env.USER_NAME || 'Brinda'; 

if (!ADMIN_EMAIL || !EMAIL_USER || !EMAIL_PASS) {
  console.error(' Missing environment variables (ADMIN_EMAIL, EMAIL_USER, or EMAIL_PASS) for email service.');
}

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
    "That waist!!!!!.",
];

/**
 * Sends a reminder email dynamically fetched to Brinda's registered email.
 * @param {object} task - Task object with name and recurrenceDays.
 */
async function sendTaskReminderEmail(task) {
  if (!task || !task.name || !task.recurrenceDays) {
    throw new Error('Invalid task data for email');
  }

  // --- CRITICAL CHANGE: FETCH EMAIL FROM DB ---
  const brindaUser = await User.findOne({ name: 'Brinda' });
  const recipientEmail = brindaUser?.email;

  if (!recipientEmail) {
      console.warn('⚠️ Cannot send task reminder: Brinda’s email is not set in the database.');
      return;
  }
  // ---------------------------------------------

  const mailOptions = {
    from: `"ToRemindYou" <${EMAIL_USER}>`,
    to: recipientEmail, // DYNAMIC RECIPIENT
    subject: `💖 Task Reminder for ${USER_NAME}: ${task.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #6a0dad; border-radius: 8px; background-color: #f9f4ff;">
        <h2 style="color: #6a0dad;">Hey ${USER_NAME}, Time to Check This Off!</h2>
        <p style="font-size: 16px;">This is your friendly reminder for the task:</p>
        <p style="font-size: 20px; font-weight: bold; color: #333; margin-left: 10px; border-left: 4px solid #6a0dad; padding-left: 10px;">
          "${task.name}"
        </p>
        <p style="color: #555;">(It's scheduled to recur every **${task.recurrenceDays} day(s)**.)</p>
        <p style="margin-top: 30px; color: #888;">Complete it and feel awesome! 😊</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Task Reminder sent to ${USER_NAME} (${recipientEmail}): ${task.name}`);
  } catch (error) {
    console.error('Error sending task reminder email:', error);
  }
}

/**
 * NEW FUNCTION: Sends a random, supportive email dynamically fetched to Brinda's registered email.
 */
async function sendRandomSupportiveEmail() {
    // --- CRITICAL CHANGE: FETCH EMAIL FROM DB ---
    const brindaUser = await User.findOne({ name: 'Brinda' });
    const recipientEmail = brindaUser?.email;

    if (!recipientEmail) {
        console.warn('⚠️ Cannot send supportive email: Brinda’s email is not set in the database.');
        return;
    }
    // ---------------------------------------------
    
    const phrase =
        supportivePhrases[Math.floor(Math.random() * supportivePhrases.length)];

    const mailOptions = {
        from: `"ToRemindYou" <${EMAIL_USER}>`,
        to: recipientEmail, // DYNAMIC RECIPIENT
        subject: 'A Little Supportive Note for You 💌',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #4CAF50; border-radius: 8px; background-color: #e8f5e9;">
                <h2 style="color: #4CAF50;">Hello ${USER_NAME}!</h2>
                <p style="font-size: 18px; font-style: italic;">${phrase}</p>
                <p style="margin-top: 30px; color: #888;">Just a small thought to brighten your day!</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Random supportive email sent to ${USER_NAME} (${recipientEmail})`);
    } catch (error) {
        console.error('Error sending supportive email:', error);
    }
}


/**
 * sendWishEmail (Admin Notification) remains the same as it uses ADMIN_EMAIL from .env.
 */
async function sendWishEmail(wish) {
  if (!wish || !wish.message) {
    throw new Error('Invalid wish data for email');
  }

  // --- RECIPIENT: Send to Admin ---
  const mailOptions = {
    from: `"ToRemindYou" <${EMAIL_USER}>`,
    to: ADMIN_EMAIL, // REMAINS ADMIN_EMAIL
    subject: `✨ ACTION REQUIRED: New Wish Submitted by ${USER_NAME}!`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ff4500; border-radius: 8px; background-color: #fff0e6;">
        <h2 style="color: #ff4500;">Wants Portal Update!</h2>
        <p style="font-size: 16px;">**${USER_NAME}** has submitted a new wish:</p>
        <p style="font-size: 22px; font-weight: bold; color: #333; margin-left: 10px; border-left: 4px solid #ff4500; padding-left: 10px;">
          "${wish.message}"
        </p>
        <p style="margin-top: 30px; color: #888;">You received this instantly. Time to strategize! 😉</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Admin Notification sent for new wish to ${ADMIN_EMAIL}`);
  } catch (error) {
    console.error('Error sending wish email to Admin:', error);
  }
}


export { sendTaskReminderEmail, sendWishEmail, sendRandomSupportiveEmail }; // EXPORT RESTORED