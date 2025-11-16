# ToRemindYou

A full-stack reminder application designed just for Brinda to keep track of recurring tasks and send motivational wishes. The app sends email reminders for tasks on their recurrence schedule and allows Brinda to send wishes that are emailed instantly.

## Features

- User interface personalized for Brinda.
- Add and view tasks with customizable recurrence intervals.
- Daily automatic email reminders for tasks based on recurrence.
- Random supportive emails sent twice daily.
- Submit wishes through the app that are emailed immediately.
- Mobile-friendly, minimalist aesthetic UI.
- Backend built with Node.js, Express, MongoDB, and Nodemailer.
- Frontend built with React and Axios.
- Cron jobs handle scheduled email notifications.
- Complete test coverage for backend routes and frontend components.
- Docker multi-stage build for easy deployment.

---

## Prerequisites

- **Node.js** (v18.x recommended)
- **npm** (comes with Node.js)
- **MongoDB** (Atlas or local instance)
- **Gmail Account** with App Password (if 2FA enabled, generate app password)
- (Optional) Docker for containerized deployment

---

## Environment Variables

Create a `.env` file in the backend folder, or set environment variables as needed.

Use `.env.example` as a template:

