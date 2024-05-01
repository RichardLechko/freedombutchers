import express from "express";
import fetch from "node-fetch";

import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3001;

const API_KEY = process.env.YELP_API_KEY;
const BUSINESS_ID = "freedom-butchers-orland-park";

app.get("/api/reviews", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.yelp.com/v3/businesses/${BUSINESS_ID}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching Yelp reviews:", error);
    res.status(500).json({ error: "Failed to fetch Yelp reviews" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is listening on port ${PORT}`);
});
