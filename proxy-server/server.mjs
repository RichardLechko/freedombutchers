import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handle contact form submissions
app.post("/submit", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "richardlechko04@gmail.com", // Update with your email
        pass: process.env.GMAIL_PASS, // Update with your email password or use environment variables
      },
    });

    const mailOptions = {
      from: "richardlechko04@gmail.com", // Update with your email address
      to: email, // Use the email provided by the user
      subject: subject,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    // Send success response
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);

    // Check for specific errors
    if (error.code === "EAUTH") {
      res.status(500).json({
        success: false,
        error: "Invalid email credentials. Please check your email settings.",
      });
    } else {
      res.status(500).json({ success: false, error: "Failed to send email" });
    }
  }
});

const startProxyServer = () => {
  app.listen(PORT, () => {
    console.log(`Proxy server is listening on port ${PORT}`);
  });
};

startProxyServer();
