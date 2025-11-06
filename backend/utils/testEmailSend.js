import dotenv from 'dotenv';
import sendEmail from './sendEmail.js';

dotenv.config();

const run = async () => {
  const to = process.env.EMAIL_USER || process.env.FROM_EMAIL;
  if (!to) {
    console.error('No recipient configured. Set EMAIL_USER or FROM_EMAIL in backend/.env');
    process.exit(1);
  }

  try {
    console.log(`Sending test email to ${to} ...`);
    const info = await sendEmail({ to, subject: 'GearUp test email', text: 'This is a test email from GearUp backend.' });
    console.log('Test email sent. Response:', info);
    process.exit(0);
  } catch (err) {
    console.error('Test email failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
};

run();
