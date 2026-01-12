// Smooth scroll function
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

// Google Login Handler
document
  .getElementById("googleLoginBtn")
  .addEventListener("click", function () {
    // Google OAuth 2.0 Configuration
    const clientId = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
    const redirectUri = window.location.origin;
    const scope = "email profile";

    // Create OAuth URL
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=token&` +
      `scope=${encodeURIComponent(scope)}`;

    // For demo purposes, show alert
    alert(
      "🔐 Google Login Integration\n\n" +
        "Untuk mengaktifkan login Google:\n" +
        "1. Buat project di Google Cloud Console\n" +
        "2. Enable Google+ API\n" +
        "3. Buat OAuth 2.0 Client ID\n" +
        "4. Ganti YOUR_GOOGLE_CLIENT_ID dengan Client ID Anda\n\n" +
        "Dokumentasi: https://developers.google.com/identity/protocols/oauth2"
    );

    // Uncomment this when you have a real Client ID
    // window.location.href = authUrl;
  });

// Handle OAuth callback
window.addEventListener("load", function () {
  const hash = window.location.hash;
  if (hash && hash.includes("access_token")) {
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");

    if (accessToken) {
      // Fetch user info from Google
      fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("User info:", data);
          // Store user info in localStorage
          localStorage.setItem("user", JSON.stringify(data));
          // Update UI
          updateUIForLoggedInUser(data);
          // Clear hash from URL
          window.history.replaceState(null, null, window.location.pathname);
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });
    }
  }

  // Check if user is already logged in
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    updateUIForLoggedInUser(user);
  }
});

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
  const loginBtn = document.getElementById("googleLoginBtn");
  if (loginBtn && user) {
    loginBtn.innerHTML = `
            <img src="${user.picture}" alt="${user.name}" style="width: 24px; height: 24px; border-radius: 50%;">
            <span>${user.name}</span>
        `;
    loginBtn.onclick = function () {
      if (confirm("Logout dari akun Google?")) {
        localStorage.removeItem("user");
        location.reload();
      }
    };
  }
}

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all feature cards and endpoint cards
document.addEventListener("DOMContentLoaded", function () {
  const animatedElements = document.querySelectorAll(
    ".feature-card, .endpoint-card, .stat-card"
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    observer.observe(el);
  });
});

// Add parallax effect to hero section
window.addEventListener("scroll", function () {
  const scrolled = window.pageYOffset;
  const heroContent = document.querySelector(".hero-content");
  const heroVisual = document.querySelector(".hero-visual");

  if (heroContent) {
    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
  }

  if (heroVisual) {
    heroVisual.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Add active state to navigation links
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", function () {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Copy code to clipboard functionality
document.querySelectorAll(".code-block").forEach((block) => {
  block.addEventListener("click", function () {
    const code = this.querySelector("code").textContent;
    navigator.clipboard.writeText(code).then(() => {
      // Show tooltip
      const tooltip = document.createElement("div");
      tooltip.textContent = "Copied!";
      tooltip.style.cssText = `
                position: absolute;
                background: #4ade80;
                color: #0f172a;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                font-size: 0.875rem;
                font-weight: 600;
                pointer-events: none;
                z-index: 1000;
                animation: fadeOut 2s forwards;
            `;
      this.style.position = "relative";
      this.appendChild(tooltip);

      setTimeout(() => {
        tooltip.remove();
      }, 2000);
    });
  });
});

// Add CSS for fadeOut animation
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; transform: translateY(0); }
        70% { opacity: 1; }
        100% { opacity: 0; transform: translateY(-10px); }
    }
    
    .nav-link.active {
        color: var(--white);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    .code-block {
        cursor: pointer;
        position: relative;
    }
    
    .code-block:hover {
        background: rgba(0, 0, 0, 0.4);
    }
`;
document.head.appendChild(style);

console.log(
  "%c🚀 API Indonesia",
  "font-size: 24px; font-weight: bold; color: #667eea;"
);
console.log(
  "%cFree Indonesian Regional Data API",
  "font-size: 14px; color: #64748b;"
);
console.log(
  "%cGitHub: https://github.com/andri-creative",
  "font-size: 12px; color: #a5b4fc;"
);
