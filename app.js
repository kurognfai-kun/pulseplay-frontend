const BACKEND_URL = ""; // If using a backend, add your URL here

// ===== Helper Functions =====
function createBadge(type) {
  const badge = document.createElement("span");
  badge.classList.add("badge");
  badge.textContent = type.toUpperCase();
  if (type.toLowerCase() === "live") badge.classList.add("live");
  if (type.toLowerCase() === "trending") badge.classList.add("trending");
  return badge;
}

function createCard(title, imgSrc, url, badgeType) {
  const card = document.createElement("div");
  card.classList.add("card");

  const image = document.createElement("img");
  image.src = imgSrc;
  image.alt = title;

  const h3 = document.createElement("h3");
  h3.textContent = title;

  const btn = document.createElement("a");
  btn.href = url;
  btn.target = "_blank";
  btn.textContent = "Watch";
  btn.classList.add("watch-btn", "neon-btn");

  if (badgeType) card.appendChild(createBadge(badgeType));
  card.appendChild(image);
  card.appendChild(h3);
  card.appendChild(btn);

  return card;
}

// ===== Twitch Section =====
async function loadTwitch() {
  const container = document.getElementById("twitch-container");
  container.innerHTML = ""; // Clear loader
  try {
    const res = await fetch(`${BACKEND_URL}/api/twitch`);
    const data = await res.json();

    data.streams.forEach(stream => {
      const card = createCard(
        stream.title,
        stream.thumbnail_url.replace("{width}x{height}", "320x180"),
        `https://twitch.tv/${stream.user_name}`,
        "live"
      );
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = "<p>Failed to load Twitch streams.</p>";
    console.error(err);
  }
}

// ===== YouTube Section =====
async function loadYouTube() {
  const container = document.getElementById("youtube-container");
  container.innerHTML = ""; // Clear loader
  try {
    const res = await fetch(`${BACKEND_URL}/api/youtube`);
    const data = await res.json();

    data.videos.forEach(video => {
      const card = createCard(
        video.title,
        video.thumbnail,
        `https://www.youtube.com/watch?v=${video.id}`,
        "trending"
      );
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = "<p>Failed to load YouTube videos.</p>";
    console.error(err);
  }
}

// ===== Featured Clips Section =====
async function loadFeaturedClips() {
  const container = document.getElementById("featured-clips");
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
    container.innerHTML = "<p>Failed to load featured clips.</p>";
    console.error(err);
  }
}

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", () => {
  loadTwitch();
  loadYouTube();
  loadFeaturedClips();
});
