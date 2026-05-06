// ── Scroll-reveal: animação de entrada dos elementos ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));


// ── Active nav on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
});


// ── Species card: feedback ao clicar ──
document.querySelectorAll('.species-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.closest('.species-card').querySelector('h3').textContent;
    alert(`Em breve: página dedicada a "${name}"`);
  });
});


// ── Cobra: língua aparece enquanto o usuário rola ──
document.addEventListener('DOMContentLoaded', () => {
  const lingua = document.getElementById('linguaCobra');
  if (!lingua) return; // segurança: sai se a imagem não existir no HTML

  let scrollTimeout;

  window.addEventListener('scroll', () => {
    lingua.classList.add('mostrando-lingua');

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      lingua.classList.remove('mostrando-lingua');
    }, 250);
  });
});