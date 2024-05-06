import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import fetchYelpReviews from "./review.mjs";
import phpExpress from "php-express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set up php-express
const phpExpressEngine = new phpExpress({
  binPath: "php-8.3.6/php-cgi", // Replace "path/to/php-cgi" with the actual path to your PHP CGI executable
  root: path.join(__dirname, "freedombutchers"), // Root directory for PHP scripts
});

app.set("view engine", "php");
app.set("views", path.join(__dirname, "freedombutchers"));

// Use php-express engine
app.engine("php", phpExpressEngine.engine);

// Serve static files (HTML, CSS, JavaScript)
app.use(express.static(path.join(__dirname, "freedombutchers")));

/**************************************************/

app.use("/About", express.static(path.join(__dirname, "About")));
app.use("/Catering", express.static(path.join(__dirname, "Catering")));
app.use("/Contact", express.static(path.join(__dirname, "Contact")));
app.use("/Coupons", express.static(path.join(__dirname, "Coupons")));
app.use(
  "/CSS-Utilities",
  express.static(path.join(__dirname, "CSS-Utilities"))
);
app.use("/Latest-News", express.static(path.join(__dirname, "Latest-News")));
app.use("/Location", express.static(path.join(__dirname, "Location")));
app.use("/Menu", express.static(path.join(__dirname, "Menu")));
app.use("/proxy-server", express.static(path.join(__dirname, "proxy-server")));
app.use("/Store-Hours", express.static(path.join(__dirname, "Store-Hours")));
app.use("/Weekly-Sales", express.static(path.join(__dirname, "Weekly-Sales")));
app.use("/", express.static(path.join(__dirname, "/")));

// Define routes for each HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/About/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "About", "index.html"));
});

app.get("/Catering/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "Catering", "index.html"));
});

app.get("/Contact/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "Contact", "index.html"));
});

app.get("/Coupons/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "Coupons", "index.html"));
});

app.get("/Latest-News/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "Latest-News", "index.html"));
});

app.get("/Location/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "Location", "index.html"));
});

app.get("/Menu/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "Menu", "index.html"));
});

app.get("/Store-Hours/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "Store-Hours", "index.html"));
});

app.get("/Weekly-Sales/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "Weekly-Sales", "index.html"));
});

app.get("/api/reviews", async (req, res) => {
  try {
    const response = await fetch("http://localhost:3001/api/reviews");

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching Yelp reviews:", error);
    res.status(500).json({ error: "Failed to fetch Yelp reviews" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
