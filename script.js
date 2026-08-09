// ===== Today's Specials slider =====
(function () {
  const track = document.getElementById('slider-track');
  const dotsWrap = document.getElementById('slider-dots');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  if (!track) return;

  const slides = Array.from(track.children);
  let index = 0;
  let timer = null;
  const AUTO_MS = 5000;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Go to special ' + (i + 1));
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function render() {
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function startAuto() {
    stopAuto();
    timer = setInterval(next, AUTO_MS);
  }
  function stopAuto() {
    if (timer) clearInterval(timer);
  }

  nextBtn.addEventListener('click', () => { next(); startAuto(); });
  prevBtn.addEventListener('click', () => { prev(); startAuto(); });

  const slider = document.getElementById('specials-slider');
  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);

  render();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    startAuto();
  }
})();

// ===== Mobile nav =====
(function () {
  const burger = document.getElementById('nav-burger');
  const menu = document.getElementById('mobile-nav');
  if (!burger || !menu) return;

  burger.addEventListener('click', function () {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// ===== Contact form validation =====
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');

  const fields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('name-error'),
      validate: (v) => v.trim().length >= 2,
      message: 'Please enter your name (at least 2 characters).'
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('email-error'),
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: 'Please enter a valid email address.'
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('message-error'),
      validate: (v) => v.trim().length >= 10,
      message: 'Tell us a little more (at least 10 characters).'
    }
  };

  function validateField(key) {
    const field = fields[key];
    const valid = field.validate(field.input.value);
    field.input.closest('.field').classList.toggle('invalid', !valid);
    field.error.textContent = valid ? '' : field.message;
    return valid;
  }

  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener('blur', () => validateField(key));
    fields[key].input.addEventListener('input', () => {
      if (fields[key].input.closest('.field').classList.contains('invalid')) {
        validateField(key);
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const results = Object.keys(fields).map(validateField);
    const allValid = results.every(Boolean);

    if (!allValid) {
      status.textContent = 'Please fix the highlighted fields before sending.';
      status.classList.remove('success');
      return;
    }

    status.textContent = 'Thanks — your message has been sent. We\'ll reply within a day or two.';
    status.classList.add('success');
    form.reset();
    Object.keys(fields).forEach((key) => {
      fields[key].input.closest('.field').classList.remove('invalid');
      fields[key].error.textContent = '';
    });
  });
})();
