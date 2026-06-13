(function () {
  'use strict';

  const slides = document.querySelectorAll('.carousel-slide');
  const thumbs = document.querySelectorAll('.thumb');
  const counter = document.getElementById('photoCounter');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  let currentSlide = 0;

  function preloadSlide(index) {
    const slide = slides[(index + slides.length) % slides.length];
    const src = slide?.querySelector('img')?.src;
    if (src) { const img = new Image(); img.src = src; }
  }

  function goToSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
    thumbs.forEach((t, i) => t.classList.toggle('active', i === currentSlide));
    if (counter) counter.textContent = `${currentSlide + 1} / ${slides.length}`;
    const activeThumb = thumbs[currentSlide];
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
    preloadSlide(currentSlide + 1);
    preloadSlide(currentSlide - 1);
  }

  prevBtn?.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn?.addEventListener('click', () => goToSlide(currentSlide + 1));

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => goToSlide(Number(thumb.dataset.index)));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
    if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
  });

  const stage = document.querySelector('.carousel-stage');
  let touchStartX = 0;

  stage?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  stage?.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
      goToSlide(diff > 0 ? currentSlide - 1 : currentSlide + 1);
    }
  }, { passive: true });

  if (slides.length) preloadSlide(1);

  const quotes = document.querySelectorAll('.sacred-quote');
  const quoteDotsEl = document.getElementById('quoteDots');
  let quoteIndex = 0;
  let quoteTimer;

  quotes.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'quote-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Quote ${i + 1}`);
    dot.addEventListener('click', () => {
      goToQuote(i);
      startQuoteRotation();
    });
    quoteDotsEl?.appendChild(dot);
  });

  const quoteDots = quoteDotsEl?.querySelectorAll('.quote-dot') ?? [];

  function goToQuote(index) {
    quoteIndex = (index + quotes.length) % quotes.length;
    quotes.forEach((q, i) => q.classList.toggle('active', i === quoteIndex));
    quoteDots.forEach((d, i) => d.classList.toggle('active', i === quoteIndex));
  }

  function startQuoteRotation() {
    clearInterval(quoteTimer);
    quoteTimer = setInterval(() => goToQuote(quoteIndex + 1), 9000);
  }

  if (quotes.length) startQuoteRotation();

  const sacredHeader = document.querySelector('.sacred-header');
  if (sacredHeader && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) startQuoteRotation();
      else clearInterval(quoteTimer);
    }, { threshold: 0.15 });
    observer.observe(sacredHeader);
  }

  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      panels.forEach((p) => {
        p.classList.toggle('active', p.id === `tab-${target}`);
      });
    });
  });
})();
