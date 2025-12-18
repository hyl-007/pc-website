
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- IN-MEMORY DATABASE ---
const pendingVerifications = {}; 

// --- EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'your-email@gmail.com', // REPLACE THIS
    pass: 'your-app-password'      // REPLACE THIS
  }
});

// Admin Email for Builder Approvals
const ADMIN_EMAIL = 'hengyule22@gmail.com';

// --- ROUTES ---

// 1. Initiate Registration (Send Email)
app.post('/api/register-init', async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  pendingVerifications[email] = {
    name,
    password, 
    code,
    expires: Date.now() + 10 * 60 * 1000 
  };

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
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Verification code sent' });
  } catch (error) {
    console.error('[SERVER] Email error:', error);
    res.status(500).json({ message: 'Failed to send email', demoCode: code });
  }
});

// 2. Verify Code & Finalize
app.post('/api/verify', (req, res) => {
  const { email, code } = req.body;
  const record = pendingVerifications[email];
  if (!record) return res.status(400).json({ message: 'No pending registration found.' });
  if (Date.now() > record.expires) {
    delete pendingVerifications[email];
    return res.status(400).json({ message: 'Code expired.' });
  }
  if (record.code !== code) return res.status(400).json({ message: 'Invalid code.' });
  
  delete pendingVerifications[email];
  res.status(200).json({
    success: true,
    user: { id: 'u_' + Date.now(), name: record.name, email: email, role: 'user', isFirstTime: true }
  });
});

// 3. Builder Application (Send to Admin)
app.post('/api/builder-apply', async (req, res) => {
  const { businessName, email, location, experience, specialty, portfolioLinks, instagram } = req.body;

  if (!businessName || !email || !portfolioLinks) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const mailOptions = {
    from: '"Nebula Forge Marketplace" <partners@nebulaforge.sg>',
    to: ADMIN_EMAIL,
    subject: `New Builder Application: ${businessName}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #e2e8f0;">
        <h2 style="color: #22d3ee; border-bottom: 2px solid #22d3ee; padding-bottom: 10px;">New Builder Application Received</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #1e293b;">Business/Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b;">${businessName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #1e293b;">Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #1e293b;">Location:</td>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b;">${location}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #1e293b;">Experience:</td>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b;">${experience}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #1e293b;">Specialty:</td>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b;">${specialty}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #1e293b;">Portfolio:</td>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b;">${portfolioLinks}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #1e293b;">Social/Instagram:</td>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b;">${instagram || 'N/A'}</td>
          </tr>
        </table>
        <div style="margin-top: 30px; text-align: center;">
          <p style="font-size: 14px; color: #94a3b8;">Review this application and follow up with the candidate to verify their identity and workmanship.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[SERVER] Builder application for ${businessName} sent to admin.`);
    res.status(200).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('[SERVER] Builder App email error:', error);
    res.status(500).json({ message: 'Failed to send application email' });
  }
});

app.listen(PORT, () => {
  console.log(`Nebula Forge Backend running on http://localhost:${PORT}`);
});
