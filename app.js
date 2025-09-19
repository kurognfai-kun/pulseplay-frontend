// Replace with your Render backend URL
const BACKEND_URL = "https://pulseplay-backend.onrender.com";

// Show glowing loading cards
function showLoadingCards(containerId, count = 3) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const card = document.createElement("div");
    card.className = "card loading-card";
    card.innerHTML = `
      <div class="loader-box"></div>
      <h3>Loading...</h3>
      <p>Fetching viewers...</p>
      <div class="watch-btn">⚡</div>
    `;
    container.appendChild(card);
  }
}

// Render cards
function renderCards(containerId, cards) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  cards.forEach(card => container.appendChild(card));
}

// Fetch Twitch
async function loadTwitch() {
  showLoadingCards("twitch-container", 5);
  try {
    const res = await fetch(`${BACKEND_URL}/api/twitch`);
    const data = await res.json();

    const cards = data.data.map(stream => {
      const card = document.createElement("div");
      card.className = "card";

      const imgUrl = stream.box_art_url.replace("{width}", "320").replace("{height}", "180");
      const twitchLink = `https://www.twitch.tv/${stream.user_login}`;

      card.innerHTML = `
        <div class="badge live">LIVE</div>
        <img src="${imgUrl}" alt="${stream.name}">
        <h3>${stream.user_name}</h3>
        <p>Game: ${stream.name}</p>
        <p>Title: ${stream.title}</p>
        <p>Viewers: ${stream.viewer_count.toLocaleString()}</p>
        <a href="${twitchLink}" target="_blank" rel="noopener noreferrer" class="watch-btn">⚡ Watch Now</a>
      `;
      return card;
    });

    renderCards("twitch-container", cards);
  } catch (err) {
    console.error("Error loading Twitch:", err);
  }
}

// Fetch YouTube
async function loadYouTube() {
  showLoadingCards("youtube-container", 5);
  try {
    const res = await fetch(`${BACKEND_URL}/api/youtube`);
    const data = await res.json();

    const cards = data.items.map(video => {
      const card = document.createElement("div");
      card.className = "card";

      const thumbnail = video.snippet.thumbnails.medium.url;
      const title = video.snippet.title;
      const channel = video.snippet.channelTitle;
      const views = video.statistics ? Number(video.statistics.viewCount).toLocaleString() : "N/A";
      const publishDate = new Date(video.snippet.publishedAt).toLocaleDateString();
      const videoLink = `https://www.youtube.com/watch?v=${video.id}`;

      card.innerHTML = `
        <div class="badge trending">TRENDING</div>
        <img src="${thumbnail}" alt="${title}">
        <h3>${title}</h3>
        <p>Channel: ${channel}</p>
        <p>Views: ${views}</p>
        <p>Published: ${publishDate}</p>
        <p class="description">${video.snippet.description.slice(0, 80)}...</p>
        <a href="${videoLink}" target="_blank" rel="noopener noreferrer" class="watch-btn">⚡ Watch Now</a>
      `;
      return card;
    });

    renderCards("youtube-container", cards);
  } catch (err) {
    console.error("Error loading YouTube:", err);
  }
}

// Initial load
loadTwitch();
loadYouTube();

// Auto-refresh every 60 seconds
setInterval(() => {
  console.log("🔄 Refreshing Twitch & YouTube data...");
  loadTwitch();
  loadYouTube();
}, 60000);

// Get current two-week period index
function getBiWeeklyIndex(productsLength) {
  const start = new Date("2025-01-01");
  const now = new Date();
  const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 14) % productsLength;
}

// Render Featured Product (1)
function renderFeaturedProduct(products) {
  const idx = getBiWeeklyIndex(products.length);
  const product = products[idx];
  const container = document.querySelector(".affiliate-featured");
  if (!container) return;

  container.innerHTML = `
    <h2>⭐ Featured Review</h2>
    <div class="affiliate-card">
      <img src="${product.img}" alt="${product.title}">
      <div class="affiliate-info">
        <h3>${product.title}</h3>
        <p>${product.desc}</p>
        <a href="${product.link}" target="_blank" class="affiliate-btn">View Deal</a>
      </div>
    </div>
  `;
}

// Render Latest Deals (3)
function renderLatestDeals(products) {
  const idx = getBiWeeklyIndex(products.length);
  const container = document.querySelector(".affiliate-latest");
  if (!container) return;

  let cards = "";
  for (let i = 0; i < 3; i++) {
    const product = products[(idx + i) % products.length];
    cards += `
      <div class="affiliate-card">
        <img src="${product.img}" alt="${product.title}">
        <div class="affiliate-info">
          <h3>${product.title}</h3>
          <p>${product.desc}</p>
          <a href="${product.link}" target="_blank" class="affiliate-btn">Shop Now</a>
        </div>
      </div>
    `;
  }

  container.innerHTML = `<h2>🔥 Latest Deals</h2><div class="affiliate-grid">${cards}</div>`;
}

// Render "Last Updated" (auto today)
function renderLastUpdated() {
  const container = document.querySelector(".affiliate-last-updated");
  if (!container) return;

  const today = new Date();
  const formatted = today.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  container.innerHTML = `<p class="last-updated">🔄 Deals last refreshed: <strong>${formatted}</strong></p>`;
}

// Fetch JSON and render everything
async function loadAffiliateProducts() {
  try {
    const cacheBuster = `?v=${new Date().getTime()}`;
    const res = await fetch("products.json" + cacheBuster, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products.json");

    const products = await res.json();
    renderFeaturedProduct(products);
    renderLatestDeals(products);
    renderLastUpdated();
  } catch (err) {
    console.error("Error loading affiliate products:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadAffiliateProducts);
