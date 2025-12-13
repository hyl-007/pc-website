const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- IN-MEMORY DATABASE (Replace with MongoDB/SQL in production) ---
// Structure: { "user@email.com": { code: "123456", name: "John", password: "...", expires: 123456789 } }
const pendingVerifications = {}; 

// --- EMAIL CONFIGURATION ---
// You must use a real email service here. 
// For Gmail, use an "App Password" (https://myaccount.google.com/apppasswords)
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'your-email@gmail.com', // REPLACE THIS
    pass: 'your-app-password'      // REPLACE THIS
  }
});

// --- ROUTES ---

// 1. Initiate Registration (Send Email)
app.post('/api/register-init', async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Store in memory (expires in 10 minutes)
  pendingVerifications[email] = {
    name,
    password, // In a real app, HASH this password using bcrypt before storing!
    code,
    expires: Date.now() + 10 * 60 * 1000 
  };

  // Email Content
  const mailOptions = {
    from: '"Nebula Forge Security" <no-reply@nebulaforge.sg>',
    to: email,
    subject: 'Your Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 500px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #020617; text-align: center;">Welcome to Nebula Forge</h2>
          <p style="color: #666; text-align: center;">Please verify your email address to complete your registration.</p>
          <div style="background-color: #e0f2fe; border: 1px solid #0ea5e9; color: #0284c7; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p style="font-size: 12px; color: #999; text-align: center;">This code will expire in 10 minutes.</p>
        </div>
      </div>
    `
  };

  try {
    // Attempt to send email
    await transporter.sendMail(mailOptions);
    console.log(`[SERVER] Email sent to ${email} with code ${code}`);
    res.status(200).json({ message: 'Verification code sent' });
  } catch (error) {
    console.error('[SERVER] Email error:', error);
    // FALLBACK FOR DEMO ONLY: If email fails (e.g., wrong credentials), send code in response so app doesn't break
    res.status(500).json({ message: 'Failed to send email', demoCode: code });
  }
});

// 2. Verify Code & Finalize
app.post('/api/verify', (req, res) => {
  const { email, code } = req.body;
  
  const record = pendingVerifications[email];

  if (!record) {
    return res.status(400).json({ message: 'No pending registration found for this email.' });
  }

  if (Date.now() > record.expires) {
    delete pendingVerifications[email];
    return res.status(400).json({ message: 'Verification code expired. Please register again.' });
  }

  if (record.code !== code) {
    return res.status(400).json({ message: 'Invalid verification code.' });
  }

  // SUCCESS!
  // In a real app, this is where you would save the user to MongoDB
  
  // Clean up
  delete pendingVerifications[email];

  // Return user data to frontend
  res.status(200).json({
    success: true,
    user: {
      id: 'u_' + Date.now(),
      name: record.name,
      email: email,
      role: 'user',
      isFirstTime: true
    }
  });
});

app.listen(PORT, () => {
  console.log(`Nebula Forge Backend running on http://localhost:${PORT}`);
});