// Placeholder animation setup
window.addEventListener("scroll", () => {
  const hero = document.getElementById("hero");
  if (window.scrollY > 50) {
    hero.style.opacity = "0.9";
  } else {
    hero.style.opacity = "1";
  }
});
