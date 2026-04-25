(() => {
  'use strict';

  // ===== Header shadow on scroll =====
  const hdr = document.getElementById('hdr');
  const onScroll = () => hdr.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== Burger / mobile nav =====
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }));
  }

  // ===== Reveal on scroll =====
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-in'));
  }

  // ===== Form-type prefill from CTA =====
  const formType = document.getElementById('f-type');
  document.querySelectorAll('[data-form-type]').forEach(el => {
    el.addEventListener('click', () => {
      const t = el.getAttribute('data-form-type');
      if (formType && t) {
        // wait for scroll
        setTimeout(() => {
          const opt = Array.from(formType.options).find(o => o.value === t || o.textContent === t);
          if (opt) formType.value = opt.value || opt.textContent;
        }, 300);
      }
    });
  });

  // ===== Form submit -> mailto =====
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // simple validation
      let ok = true;
      ['f-name', 'f-contact', 'f-type'].forEach(id => {
        const el = document.getElementById(id);
        const wrap = el.closest('.field');
        if (!el.value.trim()) { wrap.classList.add('is-invalid'); ok = false; }
        else { wrap.classList.remove('is-invalid'); }
      });
      if (!ok) return;

      const name = document.getElementById('f-name').value.trim();
      const contact = document.getElementById('f-contact').value.trim();
      const type = document.getElementById('f-type').value.trim();
      const msg = document.getElementById('f-msg').value.trim();

      const subject = encodeURIComponent(`Заявка с сайта: ${type}`);
      const body = encodeURIComponent(
        `Имя: ${name}\nКонтакт: ${contact}\nТип запроса: ${type}\n\nСообщение:\n${msg || '—'}`
      );
      window.location.href = `mailto:egor.luksho@gmail.com?subject=${subject}&body=${body}`;
      if (success) success.hidden = false;
    });
    // clear invalid on input
    form.querySelectorAll('input,select,textarea').forEach(el => {
      el.addEventListener('input', () => el.closest('.field')?.classList.remove('is-invalid'));
    });
  }

  // ===== Lightbox =====
  const gallery = document.getElementById('gallery');
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');

  if (gallery && lb) {
    const buttons = Array.from(gallery.querySelectorAll('button[data-full]'));
    let idx = 0;
    let lastFocus = null;

    const open = (i) => {
      idx = (i + buttons.length) % buttons.length;
      const src = buttons[idx].getAttribute('data-full');
      const altSrc = buttons[idx].querySelector('img')?.alt || '';
      lbImg.src = src; lbImg.alt = altSrc;
      lb.hidden = false;
      // force reflow then animate
      requestAnimationFrame(() => lb.classList.add('is-open'));
      lastFocus = document.activeElement;
      lbClose.focus();
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      lb.classList.remove('is-open');
      setTimeout(() => { lb.hidden = true; lbImg.src = ''; }, 200);
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };

    buttons.forEach((b, i) => b.addEventListener('click', () => open(i)));
    lbClose.addEventListener('click', close);
    lbPrev.addEventListener('click', () => open(idx - 1));
    lbNext.addEventListener('click', () => open(idx + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') open(idx - 1);
      else if (e.key === 'ArrowRight') open(idx + 1);
    });
  }
})();
