(function () {
  // Rotating Hero Text
  const heroTexts = [
    "Each a sign of status, rank, and religion.",
    "Each a sign of status, rank, and religion.",
    "Each with colorful personalities.",
    "Find your favorite.",
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

  let heroTextInterval = setInterval(changeHeroText, 6000);

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
      button.textContent = "Enter";
      loadingBarContainer.appendChild(button);
      // Add click event if needed
      button.addEventListener("click", () => {
        // Do something when the button is clicked
        // alert("Button clicked!");
        const introPage = document.getElementById("intro-page");
        introPage.style.transition = "opacity 0.5s ease";
        introPage.style.opacity = 0;
        setTimeout(() => {
          introPage.style.display = "none";
        }, 500);
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
    img.src = `intro_page/intro_images/${i + 1}.jpg`;
    img.style.width = "8%";
    img.className = "photo";
    // Random position on y-axis
    img.style.top = Math.random() * 100 + "%";
    // Random z-index to place some photos in front or behind the hero text
    const topPosition = parseFloat(img.style.top);
    const middleStripTop = window.innerHeight / 2 - 20;
    const middleStripBottom = window.innerHeight / 2 + 20;
    if (topPosition >= middleStripTop && topPosition <= middleStripBottom) {
      img.style.zIndex = 5;
    } else {
      img.style.zIndex = Math.random() < 0.8 ? 5 : 15;
    }
    // Random speed
    img.dataset.speed = 0.02 + Math.random() * 0.4;
    // Random size
    const scale = 0.3 + Math.random() * 1.5;
    img.style.transform = `scale(${scale})`;
    // Random opacity
    img.style.opacity = scale < 1 ? 0.5 : 1;
    // Blurry if further away
    if (scale < 1) {
      img.style.filter = "blur(2px)";
    }
    // Light drop shadow with random opacity and spread
    // const shadowOpacity = 0.1 + Math.random() * 0.2;
    // const shadowSpread = 2 + Math.random() * 1;
    // const shadowDistanceX = Math.random() * 10 - 5; // Random distance between -5 and 5
    // // const shadowDistanceY = Math.random() * 10 - 5; // Random distance between -5 and 5
    // // img.style.boxShadow = `${shadowDistanceX}px ${shadowDistanceY}px ${shadowSpread}px rgba(0, 0, 0, ${shadowOpacity})`;
    // img.style.boxShadow = `${shadowDistanceX}px ${shadowSpread}px rgba(0, 0, 0, ${shadowOpacity})`;

    // Starting position
    // Random starting x position between -500px and -100px
    const startX = -500 + Math.random() * 400;
    img.style.left = startX + "px";
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
        photo.dataset.speed = 0.02 + Math.random() * 0.07;
        photo.style.zIndex = Math.random() < 0.5 ? 5 : 15;
      }
      photo.style.left = x + "px";
    });
    requestAnimationFrame(animatePhotos);
  }

  animatePhotos();
})();
