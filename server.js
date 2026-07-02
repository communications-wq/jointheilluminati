const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const DEST_EMAIL = process.env.DEST_EMAIL || '';

async function createTransport() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback to Ethereal test account
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

app.post('/signup', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ ok: false, error: 'Name and email required' });
  }

  try {
    const transporter = await createTransport();

    const to = DEST_EMAIL || process.env.FALLBACK_EMAIL || 'no-reply@example.com';
    const mail = {
      from: email,
      to,
      subject: `Illuminati Membership Signup: ${name}`,
      text: `New signup:\nName: ${name}\nEmail: ${email}\nMessage: ${message || ''}`,
    };

    const info = await transporter.sendMail(mail);

    let previewUrl = null;
    if (nodemailer.getTestMessageUrl) {
      previewUrl = nodemailer.getTestMessageUrl(info);
    }

    res.json({ ok: true, previewUrl });
  } catch (err) {
    console.error('Send error', err);
    res.status(500).json({ ok: false, error: 'Failed to send' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
