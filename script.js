/* =============================================
   POINT LANCHES – script.js
   ============================================= */

/* ---------- MENU BURGER (mobile) ---------- */
const burger  = document.getElementById('burger');
const navLinks = document.querySelector('.nav__links');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');

  // Anima o ícone burger → X
  const spans = burger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Fecha menu ao clicar em link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ---------- SCROLL REVEAL ---------- */
const revealTargets = [
  '.card',
  '.review',
  '.sobre__grid',
  '.rating-bar',
  '.section__head',
  '.cta__title',
  '.cta__sub',
  '.cta__actions',
];

function addRevealClass() {
  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.07}s`;
    });
  });
}

function onScroll() {
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('visible');
    }
  });
}

addRevealClass();
window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // Roda na carga para elementos já visíveis

/* ---------- NAVBAR – fundo ao rolar ---------- */
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.style.background = 'rgba(13,13,13,.92)';
    nav.style.backdropFilter = 'blur(12px)';
    nav.style.boxShadow = '0 2px 24px rgba(0,0,0,.5)';
    nav.style.borderBottom = '1px solid rgba(255,255,255,.06)';
    nav.style.position = 'sticky';
    nav.style.top = '0';
    nav.style.zIndex = '100';
  } else {
    nav.style.background = '';
    nav.style.backdropFilter = '';
    nav.style.boxShadow = '';
    nav.style.borderBottom = '';
    nav.style.position = '';
    nav.style.top = '';
  }
}, { passive: true });

/* ---------- SMOOTH ANCHOR para nav sticky ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---------- CARDS – efeito tilt leve no hover (desktop) ---------- */
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', e => {
    if (window.innerWidth < 768) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - .5) * 12;
    const y = ((e.clientY - rect.top)  / rect.height - .5) * -12;
    card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
    card.style.transition = 'transform .1s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .35s, border-color .25s, box-shadow .25s';
  });
});

/* ---------- CURSOR PERSONALIZADO (desktop apenas) ---------- */
if (window.innerWidth > 768 && !('ontouchstart' in window)) {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: rgba(255,77,28,.7);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%,-50%);
    transition: transform .08s, width .2s, height .2s, opacity .2s;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '36px';
      cursor.style.height = '36px';
      cursor.style.opacity = '.5';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '18px';
      cursor.style.height = '18px';
      cursor.style.opacity = '1';
    });
  });
}

/* ---------- CONTADOR ANIMADO (nota 5,0 e avaliações) ---------- */
function animateCount(el, from, to, decimals, duration) {
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const value    = from + (to - from) * eased;
    el.textContent = value.toFixed(decimals).replace('.', ',');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const scoreEl = document.querySelector('.rating-bar__score');
if (scoreEl) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(scoreEl, 0, 5, 1, 1200);
        observer.disconnect();
      }
    });
  }, { threshold: .5 });
  observer.observe(scoreEl);
}
