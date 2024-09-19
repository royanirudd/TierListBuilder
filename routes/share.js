const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

console.log('Share router initialized'); // Debugging line

// Create a transporter using Gmail's SMTP server
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test route to render a form
router.get('/test', (req, res) => {
  console.log('Test route accessed'); // Debugging line
  res.send(`
    <form action="/share/email" method="POST">
      <input type="email" name="email" placeholder="Enter email" required>
      <input type="hidden" name="imageData" value="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==">
      <button type="submit">Send Test Email</button>
    </form>
  `);
});

// Route to handle email sending
router.post('/email', async (req, res) => {
  const { email, imageData } = req.body;

  try {
    // Send email
    let info = await transporter.sendMail({
      from: '"Tier List Builder" <' + process.env.EMAIL_USER + '>',
      to: email,
      subject: "Shared Tier List",
      text: "Here's the tier list that was shared with you.",
      html: "<p>Here's the tier list that was shared with you.</p>",
      attachments: [
        {
          filename: 'tierlist.png',
          content: imageData.split("base64,")[1],
          encoding: 'base64'
        }
      ]
    });

    console.log("Message sent: %s", info.messageId);
    res.json({ message: 'Tier list sent successfully!' });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
});

module.exports = router;
