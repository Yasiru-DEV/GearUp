import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();


const buildTransporter = () => {
  // During tests we don't want to rely on real SMTP credentials or network I/O.
  if (process.env.NODE_ENV === 'test') {
    // minimal stub transporter with same interface
    return {
      sendMail: async () => ({ accepted: [], response: 'test' }),
      verify: async () => true
    };
  }

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error('EMAIL_USER and EMAIL_PASS must be set to send emails');
  }

  if (process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: { user, pass }
    });
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });
};

const transporter = buildTransporter();

// Only verify transporter when not in test environment to avoid open handles and network I/O during tests
if (process.env.NODE_ENV !== 'test') {
  transporter.verify().then(() => {
    console.log('SMTP transporter verified');
  }).catch((err) => {
    console.error('SMTP verification failed:', err && err.message ? err.message : err);
  });
}

const sendEmail = async ({ to, subject, html, text }) => {
  const from = process.env.FROM_EMAIL || process.env.EMAIL_USER;
  const mailOptions = {
    from,
    to,
    subject,
    text: text || undefined,
    html: html || undefined
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {

    console.error('sendEmail error:', err && err.message ? err.message : err);
    throw err;
  }
};

export default sendEmail;
