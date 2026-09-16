/* =========================================================
   Wizard's Journey - Client-Side Interactivity
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCarousel();
  initLightbox();
});

/* 1. Ambient Arcane Particles */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  const particleCount = Math.min(width < 768 ? 30 : 65, 80);
  const particles = [];
  const colors = [
    'rgba(56, 189, 248, ',  // Cyan
    'rgba(168, 85, 247, ',  // Purple
    'rgba(245, 158, 11, ',  // Gold
    'rgba(255, 255, 255, '  // White
  ];
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.5 - 0.2, // Drift upward
      baseAlpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      angle: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
  
  function render() {
    ctx.clearRect(0, 0, width, height);
    
    for (let p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.angle += p.pulseSpeed;
      
      const alpha = p.baseAlpha + Math.sin(p.angle) * 0.2;
      
      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.max(0.05, Math.min(1, alpha)) + ')';
      ctx.fill();
    }
    
    requestAnimationFrame(render);
  }
  
  render();
}

/* 2. Interactive Screenshot Carousel */
function initCarousel() {
  const stage = document.querySelector('.carousel-stage');
  const slides = document.querySelectorAll('.carousel-slide');
  const thumbs = document.querySelectorAll('.thumb-card');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  
  if (!stage || slides.length === 0) return;
  
  let currentIndex = 0;
  let timer = null;
  
  function updateCarousel(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;
    
    stage.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    thumbs.forEach((t, i) => {
      if (i === currentIndex) {
        t.classList.add('active');
        t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        t.classList.remove('active');
      }
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateCarousel(currentIndex - 1);
      resetAutoTimer();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateCarousel(currentIndex + 1);
      resetAutoTimer();
    });
  }
  
  thumbs.forEach((t, i) => {
    t.addEventListener('click', () => {
      updateCarousel(i);
      resetAutoTimer();
    });
  });
  
  function startAutoTimer() {
    timer = setInterval(() => {
      updateCarousel(currentIndex + 1);
    }, 6000);
  }
  
  function resetAutoTimer() {
    clearInterval(timer);
    startAutoTimer();
  }
  
  startAutoTimer();
  
  const container = document.querySelector('.carousel-container');
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(timer));
    container.addEventListener('mouseleave', () => startAutoTimer());
  }
}

/* 3. Lightbox Fullscreen Preview */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const clickableImages = document.querySelectorAll('.carousel-viewport img');
  
  if (!lightbox || !lightboxImg) return;
  
  clickableImages.forEach(img => {
    img.addEventListener('click', () => {
      const src = img.getAttribute('src');
      lightboxImg.setAttribute('src', src);
      lightbox.classList.add('active');
    });
  });
  
  function closeLightbox() {
    lightbox.classList.remove('active');
  }
  
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === closeBtn) closeLightbox();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}
