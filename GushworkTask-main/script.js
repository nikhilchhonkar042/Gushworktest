window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");

  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});
const images = [
  "./images/Fishnet.jpg",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80",
  "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&q=80",
  "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&q=80",
];

let currentIndex = 0;

const mainImg = document.getElementById("mainImage");
const lens = document.getElementById("zoomLens");
const result = document.getElementById("zoomResult");
const thumbsContainer = document.getElementById("thumbsContainer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const ZOOM = 3;

// ── Build thumbnails ──
function buildThumbs() {
  thumbsContainer.innerHTML = "";
  images.forEach((src, i) => {
    const thumb = document.createElement("div");
    thumb.className = "thumb" + (i === currentIndex ? " active" : "");
    thumb.style.backgroundImage = `url('${src}')`;
    thumb.style.backgroundSize = "cover";
    thumb.style.backgroundPosition = "center";
    thumb.addEventListener("click", () => setImage(i));
    thumbsContainer.appendChild(thumb);
  });
}

// ── Switch image ──
function setImage(index) {
  currentIndex = index;
  mainImg.src = images[currentIndex];

  // update zoom result src too
  result.style.backgroundImage = `url('${mainImg.src}')`;

  // update active thumb
  document.querySelectorAll(".thumb").forEach((t, i) => {
    t.classList.toggle("active", i === currentIndex);
  });
}

// ── Arrow buttons ──
prevBtn.addEventListener("click", () => {
  setImage((currentIndex - 1 + images.length) % images.length);
});

nextBtn.addEventListener("click", () => {
  setImage((currentIndex + 1) % images.length);
});

// ── Zoom logic (unchanged) ──
mainImg.addEventListener("mouseenter", () => {
  lens.style.display = "block";
  result.style.display = "block";
  result.style.backgroundImage = `url('${mainImg.src}')`;
});

mainImg.addEventListener("mouseleave", () => {
  lens.style.display = "none";
  result.style.display = "none";
});

mainImg.addEventListener("mousemove", (e) => {
  const imgRect = mainImg.getBoundingClientRect();
  const containerRect = mainImg.closest(".main-img").getBoundingClientRect();

  let x = e.clientX - imgRect.left;
  let y = e.clientY - imgRect.top;

  let lensX = x - lens.offsetWidth / 2;
  let lensY = y - lens.offsetHeight / 2;
  lensX = Math.max(0, Math.min(lensX, imgRect.width - lens.offsetWidth));
  lensY = Math.max(0, Math.min(lensY, imgRect.height - lens.offsetHeight));

  lens.style.left = lensX + "px";
  lens.style.top = lensY + "px";

  const bgSizeX = imgRect.width * ZOOM;
  const bgSizeY = imgRect.height * ZOOM;
  const bgPosX = -(lensX * ZOOM);
  const bgPosY = -(lensY * ZOOM);

  result.style.backgroundSize = `${bgSizeX}px ${bgSizeY}px`;
  result.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;

  const parentRect = mainImg
    .closest(".main-img")
    .parentElement.getBoundingClientRect();
  result.style.left = containerRect.right - parentRect.left + 16 + "px";
  result.style.top = containerRect.top - parentRect.top + "px";
});

// ── Init ──
buildThumbs();