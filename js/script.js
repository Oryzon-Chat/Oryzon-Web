const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

const cursorGlow = document.getElementById('cursorGlow');
let glowX = window.innerWidth / 2;
let glowY = window.innerHeight / 3;
let targetX = glowX;
let targetY = glowY;

window.addEventListener('mousemove', e => {
  targetX = e.clientX;
  targetY = e.clientY;
}, { passive: true });

function animateGlow() {
  glowX += (targetX - glowX) * 0.08;
  glowY += (targetY - glowY) * 0.08;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';
  requestAnimationFrame(animateGlow);
}
animateGlow();

const revealItems = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach(item => revealObserver.observe(item));

const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabButtons.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`.tab-panel[data-panel="${target}"]`).classList.add('active');
  });
});

const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#!@$%&*+=?§';

function scrambleText(el, finalText, duration) {
  const steps = Math.max(finalText.length, 10);
  let frame = 0;
  const totalFrames = Math.round(duration / 30);
  const interval = setInterval(() => {
    let output = '';
    const revealCount = Math.floor((frame / totalFrames) * finalText.length);
    for (let i = 0; i < finalText.length; i++) {
      if (i < revealCount) {
        output += finalText[i];
      } else if (finalText[i] === ' ') {
        output += ' ';
      } else {
        output += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      }
    }
    el.textContent = output;
    frame++;
    if (frame > totalFrames) {
      el.textContent = finalText;
      clearInterval(interval);
    }
  }, 30);
}

const decryptTargets = document.querySelectorAll('.decrypt-target');
const decryptObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const final = el.dataset.final;
      const delay = Array.from(decryptTargets).indexOf(el) * 260;
      setTimeout(() => scrambleText(el, final, 900), delay);
      decryptObserver.unobserve(el);
    }
  });
}, { threshold: 0.4 });

decryptTargets.forEach(el => decryptObserver.observe(el));
