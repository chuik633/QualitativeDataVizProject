(function () {
  // Define the path to your CSV data
  const raw_data_url = "data/expanded_hats_Oct20_noCards_with_clusters.csv";

  let imageUrls = [];

  // Load the data and extract image URLs
  d3.csv(raw_data_url).then((data) => {
    data.forEach((d) => {
      d["imageUrl"] = d["image"];
      imageUrls.push(d.imageUrl);
    });

    // Now that imageUrls is populated, start preloading
    preloadImages(imageUrls, () => {
      console.log("All images preloaded");
      // Proceed with other initialization if needed
    });
  });

  function preloadImages(urls, callback) {
    let loadedCount = 0;
    const total = urls.length;

    if (total === 0) {
      callback();
      return;
    }

    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = img.onerror = () => {
        loadedCount++;
        if (loadedCount === total) {
          callback();
        }
      };
    });
  }

  // In intro_main.js or wherever the intro page is initialized
  preloadImages(imageUrls, () => {
    console.log("All images preloaded");
  });

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

  let loadingDuration = 20000; // 20 seconds
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

    // Scatter images across the entire viewport width and height
    img.style.top = Math.random() * 150 + "%";
    img.style.left = Math.random() * 1000 + "%";

    // Start with opacity 0
    img.style.opacity = 0;

    // Add transition for fade-in effect
    img.style.transition = "opacity 1s ease-in";

    // Rest of the existing styling
    const topPosition = parseFloat(img.style.top);
    const middleStripTop = window.innerHeight / 2 - 20;
    const middleStripBottom = window.innerHeight / 2 + 20;
    if (topPosition >= middleStripTop && topPosition <= middleStripBottom) {
      img.style.zIndex = 5;
    } else {
      img.style.zIndex = Math.random() < 0.8 ? 5 : 15;
    }

    img.dataset.speed = 0.02 + Math.random() * 0.4;
    const scale = 0.3 + Math.random() * 1.5;
    img.style.transform = `scale(${scale})`;

    if (scale < 1) {
      img.style.filter = "blur(2px)";
    }

    photoGallery.appendChild(img);
    photos.push(img);

    // Fade in after a small random delay
    setTimeout(() => {
      img.style.opacity = scale < 1 ? 0.5 : 1;
    }, Math.random() * 2000); // Random delay up to 2 seconds
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
