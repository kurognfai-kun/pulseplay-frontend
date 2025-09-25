// ===== Affiliate Data =====
const affiliates = [
  {
    title: "Razer Kraken V3 Gaming Headset",
    desc: "Immersive surround sound and crystal-clear mic quality, perfect for both competitive and casual gamers.",
    img: "https://assets3.razerzone.com/bC9-z3JQuW0nZnScR9XfIFwVtLo=/78x78/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh5f%2Fh5e%2F9248879509534%2F211021-kraken-v3-1500x1000-2.jpg",
    link: "https://amzn.to/3Vz8NeB"
  },
  {
    title: "Logitech G502 Hero Mouse",
    desc: "High-performance gaming mouse with customizable DPI and weights for precision gameplay.",
    img: "https://resource.logitechg.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/gaming/en/non-braid/hyjal-g502-hero/2025/g502-hero-mouse-in-the-box-gallery-5.png",
    link: "https://amzn.to/3Kirl0o"
  },
  {
    title: "Corsair K95 RGB Platinum Keyboard",
    desc: "Mechanical keyboard with dynamic RGB lighting and programmable keys for ultimate control.",
    img: "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Gaming-Keyboards/CH-9127014-NA/Gallery/K95_Platinum_003.webp",
    link: "https://amzn.to/4pV3X9B"
  },
  {
    title: "Secretlab Titan Evo Chair",
    desc: "Ergonomic comfort designed for marathon gaming sessions.",
    img: "https://m.media-amazon.com/images/I/410uYasNqFL._AC_SY300_SX300_QL70_FMwebp_.jpg",
    link: "https://amzn.to/3KiOL5A"
  },
  {
    title: "Elgato Stream Deck MK.2",
    desc: "Control your stream, apps, and music with one tap. Essential for Twitch and YouTube streamers.",
    img: "https://m.media-amazon.com/images/I/61gtdFnK+UL._AC_SY300_SX300_QL70_FMwebp_.jpg",
    link: "https://amzn.to/4mykInZ"
  },
  {
    title: "Blue Yeti USB Microphone",
    desc: "Professional-grade mic for streaming, podcasting, and voiceovers.",
    img: "https://m.media-amazon.com/images/I/61egnO8q6ZL._AC_UL480_FMwebp_QL65_.jpg",
    link: "https://amzn.to/4nnV5Yc"
  },
  {
    title: "AOC 24-inch 144Hz Gaming Monitor",
    desc: "Smooth visuals with ultra-fast refresh rate, perfect for FPS and esports.",
    img: "https://m.media-amazon.com/images/I/815zhTSEyEL._AC_UY327_FMwebp_QL65_.jpg",
    link: "https://amzn.to/4nmkUb8"
  },
  
  // PlayStation + Sony
  {
    title: "PlayStation Direct",
    desc: "Shop official PlayStation consoles, games, and accessories directly from Sony.",
    img: "image/PSLogo.png",
    banner: "https://media.direct.playstation.com/is/image/sierialto/PS5-Digital30-Hero-1?$Background_Large$",
    link: "YOUR_PLAYSTATION_AFFILIATE_LINK"
  },
  {
    title: "Sony Gear",
    desc: "Find the best Sony gaming headsets, DualSense controllers, and more.",
    img: "image/sonylogo.png",
    banner: "https://media.direct.playstation.com/is/image/sierialto/Elite-Hero-1-new?$Background_Large$",
    link: "YOUR_SONY_AFFILIATE_LINK"
  }
];

// ===== Render Function =====
function renderAffiliates() {
  const container = document.getElementById("affiliate-container");
  container.innerHTML = "";

  affiliates.forEach(item => {
    const card = document.createElement("section");
    card.className = "affiliate-card";

    // Logo or product image
    const img = document.createElement("img");
    img.src = item.img;
    img.alt = item.title;
    img.style.maxWidth = "150px";
    card.appendChild(img);

    // Title
    const h2 = document.createElement("h2");
    h2.textContent = item.title;
    card.appendChild(h2);

    // Description
    const p = document.createElement("p");
    p.textContent = item.desc;
    card.appendChild(p);

    // Optional banner
    if (item.banner) {
      const banner = document.createElement("img");
      banner.src = item.banner;
      banner.alt = item.title + " banner";
      banner.classList.add("affiliate-banner");
      card.appendChild(banner);
    }

    // Link button
    const link = document.createElement("a");
    link.href = item.link;
    link.target = "_blank";
    link.className = "neon-btn";
    link.textContent = "Shop Now";
    card.appendChild(link);

    container.appendChild(card);
  });
}

// ===== Initialize =====
window.addEventListener("DOMContentLoaded", renderAffiliates);
