import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(bodyParser.json());
app.use(cors());

const allowedOrigins = [
  "https://www.freedombutchers.richardlechko.com",
  "http://www.freedombutchers.richardlechko.com",
  "http://freedombutchers.richardlechko.com",
  "https://freedombutchers.richardlechko.com",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  res.removeHeader("Permissions-Policy");

  // Set Permissions-Policy without unsupported directives
  res.setHeader("Permissions-Policy", "interest-cohort=()");
  res.cookie("yourCookieName", "yourCookieValue", {
    sameSite: "None",
    secure: true,
  });
  next();
});

app.use(express.static(path.join(__dirname, "freedombutchers-main")));
app.use(express.static(path.join(__dirname, "")));

const htmlPages = [
  "index.html",
  "About/index.html",
  "Catering/index.html",
  "Contact/index.html",
  "Location/index.html",
  "Menu/index.html",
  "Store-Hours/index.html",
  "Weekly-Sales/index.html",
];

const directories = [
  "About",
  "Catering",
  "Contact",
  "Coupons",
  "CSS-Utilities",
  "Latest-News",
  "Location",
  "Menu",
  "proxy-server",
  "Store-Hours",
  "Weekly-Sales",
  "", // For serving static files from the root directory
];

directories.forEach((directory) => {
  const route = directory === "" ? "/" : `/${directory}`;
  app.use(route, express.static(path.join(__dirname, directory)));
});

htmlPages.forEach((page) => {
  const route = `/${page}`;
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, "freedombutchers-main", page));
  });
});

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

    // Define links to include in the response
    const links = [
      { url: "https://www.facebook.com/freedombutchers/", text: "FaceBook" },
      { url: "https://www.instagram.com/Freedombutchers", text: "Instagram" },
      {
        url: "https://www.yelp.com/biz/freedom-butchers-orland-park",
        text: "Yelp",
      },
    ];

    // Send success response with links
    res.status(200).json({ success: true, links });
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const startMainServer = () => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Main server listening on port ${port}`);
  });
};

const startProxyServer = () => {
  const proxyApp = express();
  const proxyPort = process.env.PROXY_PORT || 4000;

  // Proxy server setup code...

  proxyApp.listen(proxyPort, () => {
    console.log(`Proxy server listening on port ${proxyPort}`);
  });
};

// Start both servers
startMainServer();
startProxyServer();
