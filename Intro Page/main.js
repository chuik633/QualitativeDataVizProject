// Rotating Hero Text
const heroTexts = [
  "There are 11,000 hats at The Smithsonian",
  "Each distinct signs of status, rank, and religion.",
  "Each with colorful personalities.",
];

let currentTextIndex = 0;
const heroRotatingTextElement = document.getElementById("hero-rotating-text");

function changeHeroText() {
  if (currentTextIndex < heroTexts.length - 1) {
    // Fade out
    heroRotatingTextElement.style.opacity = 0;

    setTimeout(() => {
      currentTextIndex++;
      heroRotatingTextElement.textContent = heroTexts[currentTextIndex];
      // Fade in
      heroRotatingTextElement.style.opacity = 1;
    }, 1000);
  } else {
    // Do nothing, stay on last text
    clearInterval(heroTextInterval);
  }
}

let heroTextInterval = setInterval(changeHeroText, 7000);

// Loading Bar Animation
const loadingBar = document.getElementById("loading-bar");
const loadingBarFill = document.createElement("div");
loadingBarFill.className = "loading-bar-fill";
loadingBar.appendChild(loadingBarFill);

let loadingDuration = 10000; // 10 seconds
let startTime = null;

function animateLoadingBar(timestamp) {
  if (!startTime) startTime = timestamp;
  let progress = timestamp - startTime;
  let percentage = Math.min((progress / loadingDuration) * 100, 100);
  loadingBarFill.style.width = percentage + "%";

  if (progress < loadingDuration) {
    requestAnimationFrame(animateLoadingBar);
  } else {
    // Replace loading bar with button
    loadingBar.parentNode.removeChild(loadingBar);
    const loadingBarContainer = document.querySelector(
      ".loading-bar-container"
    );
    const button = document.createElement("div");
    button.className = "loading-button";
    button.textContent = "Find Your Fit";
    loadingBarContainer.appendChild(button);
    // Add click event if needed
    button.addEventListener("click", () => {
      // Do something when the button is clicked
      alert("Button clicked!");
    });
  }
}

requestAnimationFrame(animateLoadingBar);

// Photo Gallery Animation
const photoGallery = document.querySelector(".photo-gallery");

const totalPhotos = 20;
const photos = [];

for (let i = 0; i < totalPhotos; i++) {
  const img = document.createElement("img");
  img.src = `https://via.placeholder.com/${100 + Math.random() * 200}`;
  img.className = "photo";
  // Random position on y-axis
  img.style.top = Math.random() * 100 + "%";
  // Random z-index to place some photos in front or behind the hero text
  img.style.zIndex = Math.random() < 0.5 ? 5 : 15;
  // Random speed
  img.dataset.speed = 1 + Math.random() * 2;
  // Random size
  const scale = 0.5 + Math.random() * 1.5;
  img.style.transform = `scale(${scale})`;
  // Random opacity
  img.style.opacity = scale < 1 ? 0.5 : 1;
  // Blurry if further away
  if (scale < 1) {
    img.style.filter = "blur(2px)";
  }
  // Starting position
  img.style.left = -200 + "px";
  photoGallery.appendChild(img);
  photos.push(img);
}

// Animate the photos
function animatePhotos() {
  photos.forEach((photo) => {
    let x = parseFloat(photo.style.left) || -photo.width;
    x += parseFloat(photo.dataset.speed);
    if (x > window.innerWidth + photo.width) {
      x = -photo.width;
      photo.style.top =
        Math.random() * (window.innerHeight - photo.height) + "px";
      // Optionally, randomize other properties again
      const scale = 0.5 + Math.random() * 1.5;
      photo.style.transform = `scale(${scale})`;
      photo.style.opacity = scale < 1 ? 0.5 : 1;
      if (scale < 1) {
        photo.style.filter = "blur(2px)";
      } else {
        photo.style.filter = "none";
      }
      photo.dataset.speed = 1 + Math.random() * 2;
      photo.style.zIndex = Math.random() < 0.5 ? 5 : 15;
    }
    photo.style.left = x + "px";
  });
  requestAnimationFrame(animatePhotos);
}

animatePhotos();
