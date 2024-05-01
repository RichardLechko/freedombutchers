document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("http://localhost:3000/api/reviews"); // Updated endpoint to point to your proxy server
    const data = await response.json();

    const { rating, review_count } = data;
    document.querySelector(".rating-and-reviews").innerHTML = `
      <h3>Average Star Rating: ${rating} stars</h3>
      <h3>Number of Reviews: ${review_count}</h3>
    `;
  } catch (error) {
    console.error("Error fetching Yelp reviews:", error);
  }
});

document.querySelector(".prev-arrow").addEventListener("click", function () {
  document.querySelector(".reviews").scrollLeft -= 0.2 * window.innerWidth; // Scrolls left by 20% of window width
});

document.querySelector(".next-arrow").addEventListener("click", function () {
  document.querySelector(".reviews").scrollLeft += 0.2 * window.innerWidth; // Scrolls right by 20% of window width
});
