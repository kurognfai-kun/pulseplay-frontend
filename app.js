/* ===== BACKEND URL ===== */
const BACKEND_URL = ""; // Set your backend URL if needed

/* ===== HELPER FUNCTIONS ===== */
function createBadge(type) {
  const badge = document.createElement("span");
  badge.classList.add("badge");
  badge.textContent = type.toUpperCase();
  if (type.toLowerCase() === "live") badge.classList.add("live");
  if (type.toLowerCase() === "trending") badge.classList.add("trending");
  return badge;
}

function createCard({ title, thumbnail, url, live = false, badgeType }) {
  const card = document.createElement("div");
  card.classList.add("card");
  if (live) card.classList.add("live");
  if (badgeType) card.appendChild(createBadge(badgeType));

  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";

  const image = document.createElement("img");
  image.src = thumbnail;
  image.alt = title;
  image.classList.add("card-img");

  const h3 = document.createElement("h3");
  h3.textContent = title;
  h3.classList.add("card-title");

  link.appendChild(image);
  link.appendChild(h3);
  card.appendChild(link);

  return card;
}

/* ===== AFFILIATE ROTATION ===== */
async function loadAffiliateDeals() {
  const res = await fetch("affiliates.json"); // your local JSON file
  const deals = await res.json();
  const container = document.querySelector(".affiliates");
  if (!container) return;
  container.innerHTML = "";

  const week = new Date().getWeek();
  const deal = deals[week % deals.length];

  const card = document.createElement("section");
  card.classList.add("affiliate-card");
  card.innerHTML = `
    <img src="${deal.image}" alt="${deal.name}" style="max-width:150px;">
    <h2>${deal.name}</h2>
    <p>${deal.description}</p>
    <img class="affiliate-banner" src="${deal.banner}" alt="${deal.name}">
    <a href="${deal.link}" target="_blank" class="neon-btn">Shop ${deal.name}</a>
  `;
  container.appendChild(card);
}

// Week number helper
Date.prototype.getWeek = function() {
  const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
};

/* ===== TWITCH ===== */
async function loadTwitch() {
  const container = document.getElementById("twitch-container");
  if (!container) return;
  container.innerHTML = "<p>Loading Twitch streams...</p>";

  try {
    const res = await fetch(`${BACKEND_URL}/api/twitch`);
    const streams = await res.json();
    container.innerHTML = "";

    streams.forEach(stream => {
      const card = createCard({
        title: `${stream.name} • ${stream.game}`,
        thumbnail: stream.thumbnail,
        url: stream.url,
        live: true,
        badgeType: "live"
      });
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading Twitch streams.</p>";
  }
}

// Auto-refresh Twitch every 60s
function autoRefreshTwitch(interval = 60000) {
  loadTwitch();
  setInterval(loadTwitch, interval);
}

/* ===== YOUTUBE CAROUSEL ===== */
let youtubeVideos = [];
let currentIndex = 0;

async function rotateYouTube() {
  const container = document.getElementById("youtube-container");
  if (!container) return;

  try {
    const res = await fetch(`${BACKEND_URL}/api/youtube`);
    youtubeVideos = await res.json();
    if (youtubeVideos.length === 0) return;

    container.innerHTML = "";
    container.appendChild(createCard({
      title: youtubeVideos[0].title,
      thumbnail: youtubeVideos[0].thumbnail,
      url: youtubeVideos[0].url,
      badgeType: "trending"
    }));

    setInterval(() => {
      currentIndex = (currentIndex + 1) % youtubeVideos.length;
      container.innerHTML = "";
      container.appendChild(createCard({
        title: youtubeVideos[currentIndex].title,
        thumbnail: youtubeVideos[currentIndex].thumbnail,
        url: youtubeVideos[currentIndex].url,
        badgeType: "trending"
      }));
    }, 10000); // rotate every 10 seconds
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading YouTube videos.</p>";
  }
}

/* ===== FEATURED CLIPS ===== */
async function loadFeaturedClips() {
  const container = document.getElementById("featured-clips");
  if (!container) return;
  container.innerHTML = "";

  try {
    const res = await fetch(`${BACKEND_URL}/api/featured`);
    const clips = await res.json();

    clips.forEach(clip => {
      const iframe = document.createElement("iframe");
      iframe.src = clip.embedUrl;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      container.appendChild(iframe);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Failed to load featured clips.</p>";
  }
}

/* ===== NEON PARTICLES ===== */
function createParticles(count = 50) {
  const container = document.querySelector(".neon-particles");
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${3 + Math.random() * 4}s`;
    const size = 2 + Math.random() * 3;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    container.appendChild(particle);
  }
}

/* ===== INITIALIZE EVERYTHING ===== */
window.addEventListener("DOMContentLoaded", () => {
  loadAffiliateDeals();   // Affiliate rotation
  autoRefreshTwitch();    // Twitch auto-refresh
  rotateYouTube();        // YouTube carousel
  loadFeaturedClips();    // Featured clips
  createParticles(100);   // Neon particle effect
});

// ===== Affiliates Section =====
async function loadAffiliates() {
  const container = document.getElementById("affiliates-container");
  if (!container) return;

  try {
    const res = await fetch("affiliates.json"); // JSON file containing all items
    const data = await res.json();
    container.innerHTML = ""; // clear existing

    // Flatten nested arrays if needed
    const allAffiliates = data.flat();

    allAffiliates.forEach(item => {
      const card = document.createElement("section");
      card.classList.add("affiliate-card");

      // Image (product or brand logo)
      const img = document.createElement("img");
      img.src = item.img || item.image;
      img.alt = item.title || item.name;
      img.style.maxWidth = "150px";
      card.appendChild(img);

      // Name / Title
      const h2 = document.createElement("h2");
      h2.textContent = item.title || item.name;
      card.appendChild(h2);

      // Description
      const p = document.createElement("p");
      p.textContent = item.desc || item.description;
      card.appendChild(p);

      // Banner (optional)
      if (item.banner) {
        const banner = document.createElement("img");
        banner.src = item.banner;
        banner.alt = `${item.title || item.name} Banner`;
        banner.classList.add("affiliate-banner");
        card.appendChild(banner);
      }

      // Link / button
      const btn = document.createElement("a");
      btn.href = item.link;
      btn.target = "_blank";
      btn.rel = "noopener noreferrer";
      btn.classList.add("neon-btn");
      btn.textContent = `Shop ${item.title || item.name}`;
      card.appendChild(btn);

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading affiliates:", err);
    container.innerHTML = "<p>Failed to load affiliate items.</p>";
  }
}

// ===== Initialize =====
window.addEventListener("DOMContentLoaded", () => {
  loadAffiliates();
});


// ===== Affiliates Section (Rotating Carousel with Fade) =====
let affiliates = [];
let currentAffiliateIndex = 0;

async function loadAffiliatesCarousel(interval = 8000) {
  const container = document.getElementById("affiliates-container");
  if (!container) return;

  try {
    const res = await fetch("affiliates.json");
    affiliates = await res.json();

    if (affiliates.length === 0) return;

    // Show the first affiliate
    showAffiliate(container, affiliates[currentAffiliateIndex]);

    // Rotate affiliates
    setInterval(() => {
      fadeOut(container, () => {
        currentAffiliateIndex = (currentAffiliateIndex + 1) % affiliates.length;
        showAffiliate(container, affiliates[currentAffiliateIndex]);
        fadeIn(container);
      });
    }, interval);

  } catch (err) {
    console.error("Error loading affiliates:", err);
    container.innerHTML = "<p>Failed to load affiliate deals.</p>";
  }
}

function showAffiliate(container, deal) {
  container.innerHTML = ""; // Clear previous card

  const card = document.createElement("section");
  card.classList.add("affiliate-card");

  // Logo
  const img = document.createElement("img");
  img.src = deal.image;
  img.alt = `${deal.name} Logo`;
  img.style.maxWidth = "150px";
  card.appendChild(img);

  // Name
  const h2 = document.createElement("h2");
  h2.textContent = deal.name;
  card.appendChild(h2);

  // Description
  const p = document.createElement("p");
  p.textContent = deal.description;
  card.appendChild(p);

  // Banner
  const banner = document.createElement("img");
  banner.src = deal.banner;
  banner.alt = `${deal.name} Banner`;
  banner.classList.add("affiliate-banner");
  card.appendChild(banner);

  // Button
  const btn = document.createElement("a");
  btn.href = deal.link;
  btn.target = "_blank";
  btn.rel = "noopener noreferrer";
  btn.classList.add("neon-btn");
  btn.textContent = `Shop ${deal.name}`;
  card.appendChild(btn);

  container.appendChild(card);
}

// ===== Fade Helpers =====
function fadeOut(element, callback) {
  element.style.transition = "opacity 0.5s ease";
  element.style.opacity = 0;
  setTimeout(() => callback(), 500);
}

function fadeIn(element) {
  element.style.transition = "opacity 0.5s ease";
  element.style.opacity = 1;
}

// ===== Initialize =====
window.addEv


const res = await fetch("affiliates.json");
const deals = await res.json();

// ===== Affiliates Section with Carousel =====
let affiliates = [];
let affiliateIndex = 0;

async function loadAffiliatesCarousel(interval = 8000) {
  const container = document.getElementById("affiliates-container");
  if (!container) return;

  try {
    const res = await fetch("affiliates.json"); // JSON file containing all items
    const data = await res.json();

    // Flatten nested arrays if needed
    affiliates = data.flat();
    if (affiliates.length === 0) return;

    // Show first card
    container.innerHTML = "";
    container.appendChild(createAffiliateCard(affiliates[0]));

    // Rotate cards automatically
    setInterval(() => {
      affiliateIndex = (affiliateIndex + 1) % affiliates.length;
      container.innerHTML = "";
      container.appendChild(createAffiliateCard(affiliates[affiliateIndex]));
    }, interval);

  } catch (err) {
    console.error("Error loading affiliates:", err);
    container.innerHTML = "<p>Failed to load affiliate items.</p>";
  }
}

// ===== Helper: Create Single Affiliate Card =====
function createAffiliateCard(item) {
  const card = document.createElement("section");
  card.classList.add("affiliate-card");

  // Image (product or brand logo)
  const img = document.createElement("img");
  img.src = item.img || item.image;
  img.alt = item.title || item.name;
  img.style.maxWidth = "150px";
  card.appendChild(img);

  // Name / Title
  const h2 = document.createElement("h2");
  h2.textContent = item.title || item.name;
  card.appendChild(h2);

  // Description
  const p = document.createElement("p");
  p.textContent = item.desc || item.description;
  card.appendChild(p);

  // Banner (optional)
  if (item.banner) {
    const banner = document.createElement("img");
    banner.src = item.banner;
    banner.alt = `${item.title || item.name} Banner`;
    banner.classList.add("affiliate-banner");
    card.appendChild(banner);
  }

  // Shop button
  const btn = document.createElement("a");
  btn.href = item.link;
  btn.target = "_blank";
  btn.rel = "noopener noreferrer";
  btn.classList.add("neon-btn");
  btn.textContent = `Shop ${item.title || item.name}`;
  card.appendChild(btn);

  return card;
}

// ===== Initialize =====
window.addEventListener("DOMContentLoaded", () => {
  loadAffiliatesCarousel(10000); // rotate every 10 seconds
});
