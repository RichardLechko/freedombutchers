import fetch from "node-fetch";

const API_KEY = process.env.YELP_API_KEY;
const BUSINESS_ID = "freedom-butchers-orland-park";

async function fetchYelpReviews() {
  try {
    const response = await fetch(
      `https://api.yelp.com/v3/businesses/${BUSINESS_ID}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch business details. Status: ${response.status}`
      );
    }

    const data = await response.json();

    const { rating, review_count } = data;

    return { rating, review_count };
  } catch (error) {
    console.error("Error fetching Yelp reviews:", error);
    throw new Error("Failed to fetch Yelp reviews");
  }
}

export default fetchYelpReviews;
