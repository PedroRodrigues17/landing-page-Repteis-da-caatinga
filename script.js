// ── Tema claro/escuro com persistência ──
const themeToggle = document.getElementById('themeToggle');
const themeToggleLabel = themeToggle?.querySelector('.theme-toggle-text');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const themeStorageKey = 'museu-vivo-theme';

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-mode', isDark);

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Ativar modo claro' : 'Ativar modo escuro');
  }

  if (themeToggleLabel) {
    themeToggleLabel.textContent = isDark ? 'Modo claro' : 'Modo escuro';
  }
}

const savedTheme = localStorage.getItem(themeStorageKey);
const initialTheme = savedTheme || (prefersDarkScheme.matches ? 'dark' : 'light');
applyTheme(initialTheme);

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
  localStorage.setItem(themeStorageKey, nextTheme);
  applyTheme(nextTheme);
});

prefersDarkScheme.addEventListener('change', (event) => {
  if (!localStorage.getItem(themeStorageKey)) {
    applyTheme(event.matches ? 'dark' : 'light');
  }
});

// ── Menu mobile ──
const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');
const mobileMenuQuery = window.matchMedia('(max-width: 900px)');

function setMenuOpen(isOpen) {
  document.body.classList.toggle('menu-open', isOpen);
  menuToggle?.setAttribute('aria-expanded', String(isOpen));
  menuToggle?.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
}

menuToggle?.addEventListener('click', () => {
  setMenuOpen(!document.body.classList.contains('menu-open'));
});

primaryNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuOpen(false);
});

mobileMenuQuery.addEventListener('change', (event) => {
  if (!event.matches) setMenuOpen(false);
});

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


// ── Carrossel do bloco Sobre ──
const aboutCarousel = document.querySelector('[data-about-carousel]');
if (aboutCarousel) {
  const slides = Array.from(aboutCarousel.querySelectorAll('.carousel-slide'));
  const prevButton = aboutCarousel.querySelector('[data-carousel-prev]');
  const nextButton = aboutCarousel.querySelector('[data-carousel-next]');
  const pauseButton = aboutCarousel.querySelector('[data-carousel-pause]');
  const dotsContainer = aboutCarousel.querySelector('.carousel-dots');
  let activeIndex = 0;
  let autoplayId = null;
  let isPaused = false;

  const dots = slides.map((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Ir para a imagem ${index + 1}`);
    dot.addEventListener('click', () => setSlide(index));
    dotsContainer.appendChild(dot);
    return dot;
  });

  function setSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === activeIndex);
    });
  }

  function nextSlide() {
    setSlide(activeIndex + 1);
  }

  function previousSlide() {
    setSlide(activeIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayId = setInterval(nextSlide, 4500);
  }

  function stopAutoplay() {
    if (autoplayId) {
      clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  prevButton.addEventListener('click', previousSlide);
  nextButton.addEventListener('click', nextSlide);
  pauseButton?.addEventListener('click', () => {
    isPaused = !isPaused;
    if (isPaused) {
      stopAutoplay();
      pauseButton.textContent = '▶';
      pauseButton.setAttribute('aria-label', 'Retomar carrossel');
    } else {
      startAutoplay();
      pauseButton.textContent = '⏸';
      pauseButton.setAttribute('aria-label', 'Pausar carrossel');
    }
  });
  aboutCarousel.addEventListener('mouseenter', stopAutoplay);
  aboutCarousel.addEventListener('mouseleave', () => { if (!isPaused) startAutoplay(); });
  aboutCarousel.addEventListener('focusin', stopAutoplay);
  aboutCarousel.addEventListener('focusout', () => { if (!isPaused) startAutoplay(); });

  setSlide(0);
  startAutoplay();
}


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


// ── Side panel SPA para 'Saiba mais' (camada de dados detalhados)
const panel = document.getElementById('sidePanel');
const overlay = document.getElementById('panelOverlay');
const panelClose = document.getElementById('panelClose');
const panelTitle = document.getElementById('panelTitle');
const panelSubtitle = document.getElementById('panelSubtitle');
const panelImage = document.getElementById('panelImage');
const panelDescription = document.getElementById('panelDescription');
const panelHabitat = document.getElementById('panelHabitat');
const panelDiet = document.getElementById('panelDiet');
const panelStatus = document.getElementById('panelStatus');
const panelFact = document.getElementById('panelFact');

const speciesData = {
  'Lagartos': {
    iucn: 'LC',
    subtitle: 'Sauria — lagartos da Caatinga',
    img: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Green_iguana_%28Iguana_iguana%29_juvenile_head.jpg',
    description: 'Os lagartos da Caatinga incluem várias famílias adaptadas ao clima semiárido: alguns escavam para escapar do calor, outros são ativos ao amanhecer. A imagem apresentada mostra uma iguana verde juvenil, usada aqui como referência visual para o card de lagartos.',
    habitat: 'Cerrados secos, caatinga arbustiva, áreas rochosas e entre a vegetação esparsa.',
    diet: 'Insetos, pequenos invertebrados e, dependendo da espécie, frutas e vegetação ocasional.',
    status: 'A maior parte das espécies locais apresenta risco baixo, mas populações isoladas podem estar ameaçadas por perda de habitat.',
    fact: 'Alguns lagartos conseguem regenerar a cauda como estratégia de fuga; observando com calma você pode ver marcas de regeneração em indivíduos adultos. A foto usada no card é de uma iguana verde juvenil do Wikimedia Commons.'
  },
  'Cobras': {
    iucn: 'LC',
    subtitle: 'Serpentes — diversidade peçonhenta e não peçonhenta | Mascote: Píton Albina',
    img: 'cobra com fundo transparente.png',
    description: 'As cobras da Caatinga variam desde espécies inofensivas até algumas peçonhentas. Elas desempenham papel essencial no equilíbrio, controlando populações de roedores e outros pequenos animais. Nossa mascote é uma Píton Albina (Python regius), uma cobra real africana com mutação genética que impede a produção de melanina, resultando em sua coloração amarela e branca característica. Apesar de suas origens africanas, as pítons albinas conquistaram o público por seu temperamento dócil e aparência única.',
    habitat: 'Áreas abertas, tocas abandonadas, matas ciliares e entulhos próximos a áreas humanas. Pítons albinas em cativeiro requerem ambientes aquecidos e seguros.',
    diet: 'Roedores, aves, anfíbios e outros répteis, dependendo da espécie. Pítons albinas alimentam-se principalmente de roedores.',
    status: 'Varia por espécie; educação e manejo são importantes para reduzir conflitos com pessoas. Pítons albinas em cativeiro são comuns e viáveis.',
    fact: 'Nossa mascote, a píton albina, é uma mutação rara na natureza mas viável em cativeiro. Seu albinismo resulta em um padrão amarelo ouro com olhos geralmente pretos (diferente de outros albinos). Ela nos lembra que toda criatura tem sua beleza e importância — a missão do Museu Vivo é celebrar e preservar essa diversidade!'
  },
  'Quelônios': {
    iucn: 'VU',
    subtitle: 'Quelônios — tartarugas e jabutis da Caatinga',
    img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Red-footed_Tortoise_in_Barbados_02.jpg',
    description: 'Os quelônios incluem jabutis (tartarugas terrestres) e cágados; são importantes dispersores de sementes e parte vital do ecossistema. Os jabutis terrestres vivem em áreas de solo firme, com vegetação baixa e bastante sombra.',
    habitat: 'Solo firme com vegetação rasteira, áreas de sombra e proximidade de recursos hídricos sazonais.',
    diet: 'Herbívoros ou onívoros: frutas, folhas, flores e, ocasionalmente, pequenos invertebrados.',
    status: 'Algumas populações são vulneráveis devido à captura e perda de habitat; a reprodução é lenta.',
    fact: 'Os jabutis têm uma relação importante com a regeneração de plantas, pois dispersam sementes inteiras que conseguem germinar melhor após passagem pelo trato digestivo.'
  },
  'Iguanas': {
    iucn: 'LC',
    subtitle: 'Iguanas — répteis arborícolas e robustos',
    img: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=1000&q=80',
    description: 'As iguanas são répteis de porte imponente, cauda longa e hábitos que variam entre a vegetação densa e áreas ensolaradas. Apesar de não serem nativas da Caatinga, são animais muito conhecidos e ajudam a aproximar o público do universo dos répteis.',
    habitat: 'Áreas arborizadas, regiões quentes e ambientes com acesso a sol e sombra.',
    diet: 'Principalmente folhas, frutos e brotos, com variação conforme a espécie.',
    status: 'Em geral não ameaçadas, mas a conservação depende do habitat adequado e do controle de tráfico de animais.',
    fact: 'As iguanas usam o calor do sol para regular a temperatura corporal e podem permanecer longos períodos imóveis nas árvores.'
  },
  'Jacarés': {
    iucn: 'LC',
    subtitle: 'Crocodilianos — predadores semiaquáticos',
    img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Yacare_caiman_(Caiman_yacare)_juvenile.JPG',
    description: 'Os jacarés são répteis semiaquáticos de corpo robusto, focinho alongado e mandíbula muito forte. Passam boa parte do tempo na água ou nas margens, onde se camuflam com facilidade e caçam de forma eficiente. Eles são importantes para o equilíbrio dos ambientes aquáticos, ajudando a controlar populações de outros animais.',
    habitat: 'Rios, lagoas, brejos, áreas alagadas e margens com vegetação densa, onde conseguem se esconder e se aquecer ao sol.',
    diet: 'Peixes, crustáceos, anfíbios, aves, pequenos mamíferos e, quando disponíveis, carcaças de animais.',
    status: 'A conservação varia conforme a espécie e a pressão humana sobre rios e brejos; a proteção das áreas úmidas é essencial para sua sobrevivência.',
    fact: 'Os jacarés têm excelente visão e audição, além de olhos e narinas posicionados no topo da cabeça, o que permite ficar quase totalmente submersos enquanto observam o ambiente.'
  }
};

function openPanel(data) {
  // data pode vir de speciesData ou do cartão
  const {
    title = '', subtitle = '', img = '', description = '', habitat = '', diet = '', status = '', fact = ''
  } = data || {};

  panelTitle.textContent = title;
  panelSubtitle.textContent = subtitle || '';
  panelImage.src = img || '';
  panelImage.alt = title || '';
  panelDescription.textContent = description || '';
  panelHabitat.textContent = habitat || 'Informação não disponível.';
  panelDiet.textContent = diet || 'Informação não disponível.';
  panelStatus.textContent = status || 'Informação não disponível.';
  panelFact.textContent = fact || '';

  const iucnEl = document.getElementById('panelIucn');
  if (iucnEl) {
    const code = data.iucn || 'DD';
    iucnEl.textContent = code;
    iucnEl.className = 'iucn-chip iucn-' + code.toLowerCase();
  }

  panel.classList.add('open');
  overlay.classList.add('visible');
  panel.setAttribute('aria-hidden', 'false');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closePanel() {
  panel.classList.remove('open');
  overlay.classList.remove('visible');
  panel.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.species-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.species-card');
    const title = card.querySelector('h3')?.textContent?.trim() || '';
    // tenta buscar dados ricos pelo título
    const rich = speciesData[title];
    if (rich) {
      openPanel(Object.assign({ title }, rich));
      return;
    }

    // fallback simples: usa conteúdo do cartão
    const img = card.querySelector('img')?.src || '';
    const description = card.querySelector('p')?.textContent || '';
    openPanel({ title, img, description });
  });
});

if (panelClose) panelClose.addEventListener('click', closePanel);
if (overlay) overlay.addEventListener('click', closePanel);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });


// ── Cobra: língua aparece enquanto o usuário rola ──
document.addEventListener('DOMContentLoaded', () => {
  const lingua = document.getElementById('linguaCobra');
  if (!lingua) return; // segurança: sai se a imagem não existir no HTML

  let scrollTimeout;

  const cobraDecor = document.querySelector('.cobra-decor');
  cobraDecor?.addEventListener('mouseenter', () => {
    lingua.classList.add('mostrando-lingua');
  });
  cobraDecor?.addEventListener('mouseleave', () => {
    setTimeout(() => lingua.classList.remove('mostrando-lingua'), 400);
  });

  window.addEventListener('scroll', () => {
    lingua.classList.add('mostrando-lingua');

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      lingua.classList.remove('mostrando-lingua');
    }, 250);
  });
});
