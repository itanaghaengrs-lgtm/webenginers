/* ═══════════════════════════════════════
   ANAGHA ENGINEERS — MAIN JAVASCRIPT
   main.js
═══════════════════════════════════════ */

/* ── LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('out');
  }, 2200);
});

/* ── NAVBAR SCROLL ── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('sc', window.scrollY > 60);
});

/* ── toogle mobile menu ── */

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

/* ══════════════════════════════════════
   PARTICLE CANVAS
══════════════════════════════════════ */
const canvas = document.getElementById('pcan');
const ctx    = canvas.getContext('2d');
let W, H, parts = [];

function resizeCanvas() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.vx   = (Math.random() - 0.5) * 0.35;
    this.vy   = (Math.random() - 0.5) * 0.35;
    this.r    = Math.random() * 1.4 + 0.3;
    this.a    = Math.random() * 0.4 + 0.1;
    this.life = Math.random() * 220 + 80;
    this.age  = 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.age++;
    if (this.age > this.life || this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.a * (1 - this.age / this.life);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = '#c8922a';
    ctx.fill();
    ctx.restore();
  }
}

/* Populate particles */
for (let i = 0; i < 90; i++) parts.push(new Particle());

/* Draw connection lines between nearby particles */
function drawConnections() {
  for (let i = 0; i < parts.length; i++) {
    for (let j = i + 1; j < parts.length; j++) {
      const dx   = parts[i].x - parts[j].x;
      const dy   = parts[i].y - parts[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 110) * 0.07;
        ctx.strokeStyle = '#c8922a';
        ctx.lineWidth   = 0.5;
        ctx.beginPath();
        ctx.moveTo(parts[i].x, parts[i].y);
        ctx.lineTo(parts[j].x, parts[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

/* Particle animation loop */
(function particleLoop() {
  ctx.clearRect(0, 0, W, H);
  drawConnections();
  parts.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(particleLoop);
})();

/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('vis');
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.rv').forEach(el => revealObserver.observe(el));

/* ══════════════════════════════════════
   ANIMATED COUNTERS
══════════════════════════════════════ */
function animateCounter(el, target) {
  let start = null;
  const duration = 1800;

  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
    el.textContent  = Math.round(ease * target);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target;
    }
  };

  requestAnimationFrame(step);
}

document.querySelectorAll('.ccell').forEach(cell => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const countEl = e.target.querySelector('.cnt');
          const target  = parseInt(e.target.querySelector('.cnum').dataset.target);
          if (countEl && !countEl.dataset.done) {
            countEl.dataset.done = '1';
            animateCounter(countEl, target);
          }
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(cell);
});

/* ══════════════════════════════════════
   CONTACT FORM SUBMIT
══════════════════════════════════════ */
function handleForm(e) {
  e.preventDefault();
  const btn  = e.target.querySelector('.fsub');
  const span = btn.querySelector('span');

  span.textContent   = "Sent! We'll be in touch ✓";
  btn.style.background = '#2a7a4a';

  setTimeout(() => {
    btn.style.background = '';
    span.textContent     = 'Send Enquiry →';
    e.target.reset();
  }, 4000);
}
