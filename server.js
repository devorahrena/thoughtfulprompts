const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sendthoughtfulprompts@gmail.com",
    pass: "Send!Thoughtful!Prompts!",
  },
});

// POST endpoint to send email
app.post("/send-email", async (req, res) => {
    const { letter, response, userEmail } = req.body;
  
    // Validate request body
    if (!letter || !response || !userEmail) {
      return res.status(400).send("Missing required fields: letter, response, or userEmail.");
    }
  
    const mailOptions = {
      from: "sendthoughtfulprompts@gmail.com",
      to: "sendthoughtfulprompts@gmail.com",
      subject: `Response to Letter: ${letter}`,
      text: `A response has been submitted by ${userEmail}.\n\n---\nResponse:\n${response}`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).send("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Failed to send email.");
    }
  });
  
  // Start server
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
  