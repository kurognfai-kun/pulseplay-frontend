const BACKEND_URL = "https://pulseplay-backend-ljyq.onrender.com";

// ===== Helper Functions =====
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

// ===== Twitch =====
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
  loadTwitch(); // Initial load
  setInterval(loadTwitch, interval);
}

// ===== YouTube =====
let youtubeVideos = [];
let currentIndex = 0;

async function rotateYouTube() {
  const container = document.getElementById("youtube-container");
  if (!container) return;

  try {
    const res = await fetch(`${BACKEND_URL}/api/youtube`);
    youtubeVideos = await res.json();
    if (youtubeVideos.length === 0) return;

    // Show first video
    container.innerHTML = "";
    container.appendChild(
      createCard({
        title: youtubeVideos[0].title,
        thumbnail: youtubeVideos[0].thumbnail,
        url: youtubeVideos[0].url,
        badgeType: "trending"
      })
    );

    // Rotate every 10 seconds
    setInterval(() => {
      currentIndex = (currentIndex + 1) % youtubeVideos.length;
      container.innerHTML = "";
      container.appendChild(
        createCard({
          title: youtubeVideos[currentIndex].title,
          thumbnail: youtubeVideos[currentIndex].thumbnail,
          url: youtubeVideos[currentIndex].url,
          badgeType: "trending"
        })
      );
    }, 10000);
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading YouTube videos.</p>";
  }
}

// ===== Featured Clips =====
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
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      container.appendChild(iframe);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Failed to load featured clips.</p>";
  }
}

// ===== Neon Particles =====
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

// ===== Initialize =====
window.addEventListener("DOMContentLoaded", () => {
  autoRefreshTwitch();    // Twitch auto-refresh
  rotateYouTube();        // YouTube carousel
  loadFeaturedClips();    // Featured clips
  createParticles(100);   // Neon particle effect
});
