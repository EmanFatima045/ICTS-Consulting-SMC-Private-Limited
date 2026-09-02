/**
 * ICTS CONSULTING (SMC-PRIVATE) LIMITED
 * Official Client-Side Interactive Logic & Micro-Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCountdown();
  initCalculator();
  initLightbox();
  initFAQ();
  initForm();
  initScrollTop();
  initFlipCards();
  initScrollReveal();
  initCardTiltAnimations();
  updateCopyright();
});

/* ==========================================================================
   1. NAVBAR & MOBILE MENU
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navMenu.classList.contains('open'));
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('open');
      }
    });
  }
}

/* ==========================================================================
   2. LIVE ZOOM WORKSHOP REALTIME COUNTDOWN (MON-THU 10:00 PM PKT)
   ========================================================================== */
function initCountdown() {
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');
  const liveTimeClock = document.getElementById('liveTimeClock');

  function getNextSession() {
    const now = new Date();
    const nowUTC = now.getTime() + (now.getTimezoneOffset() * 60000);
    const pktTime = new Date(nowUTC + (3600000 * 5));

    const day = pktTime.getDay();
    const hour = pktTime.getHours();
    const minute = pktTime.getMinutes();

    const isWorkshopDay = (day >= 1 && day <= 4);
    const isLiveNow = isWorkshopDay && (hour === 22 && minute < 45);

    if (isLiveNow && liveTimeClock) {
      liveTimeClock.innerHTML = '<span style="color:#10B981; font-size:24px;">● LIVE NOW</span>';
    }

    let daysUntilNext = 0;

    if (isWorkshopDay) {
      if (hour < 22) {
        daysUntilNext = 0;
      } else {
        daysUntilNext = (day === 4) ? 4 : 1;
      }
    } else if (day === 5) {
      daysUntilNext = 3;
    } else if (day === 6) {
      daysUntilNext = 2;
    } else if (day === 0) {
      daysUntilNext = 1;
    }

    const targetDate = new Date(pktTime);
    targetDate.setDate(targetDate.getDate() + daysUntilNext);
    targetDate.setHours(22, 0, 0, 0);

    const diffMs = targetDate.getTime() - pktTime.getTime();
    return Math.max(0, diffMs);
  }

  function update() {
    const diff = getNextSession();
    const totalSecs = Math.floor(diff / 1000);

    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
    if (cdMinutes) cdMinutes.textContent = String(minutes).padStart(2, '0');
    if (cdSeconds) cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   3. REVENUE & COMMISSION CALCULATOR (MATCHED TO OFFICIAL COURSE FEES)
   ========================================================================== */
function initCalculator() {
  const studentRange = document.getElementById('studentRange');
  const studentValDisplay = document.getElementById('studentValDisplay');
  const trackSelect = document.getElementById('trackSelect');
  const batchesPerYear = document.getElementById('batchesPerYear');
  const batchCommissionDisplay = document.getElementById('batchCommissionDisplay');
  const annualCommissionDisplay = document.getElementById('annualCommissionDisplay');
  const calcResAmountBox = document.getElementById('calcResAmountBox');

  const courseFees = {
    hsk1_2: { fee: 20000, commissionPerStudent: 4000 },
    yct1_2: { fee: 15000, commissionPerStudent: 3000 },
    yct3_4: { fee: 30000, commissionPerStudent: 6000 },
    hsk3_4: { fee: 40000, commissionPerStudent: 8000 },
    bct: { fee: 40000, commissionPerStudent: 8000 }
  };

  function calculate() {
    if (!studentRange || !trackSelect || !batchesPerYear) return;

    const students = parseInt(studentRange.value, 10);
    const trackKey = trackSelect.value;
    const batches = parseInt(batchesPerYear.value, 10);
    const trackInfo = courseFees[trackKey] || courseFees.hsk1_2;

    const batchEarning = students * trackInfo.commissionPerStudent;
    const annualEarning = batchEarning * batches;

    if (studentValDisplay) {
      studentValDisplay.textContent = `${students} Students`;
    }

    if (batchCommissionDisplay) {
      batchCommissionDisplay.textContent = `PKR ${batchEarning.toLocaleString('en-US')}`;
    }

    if (annualCommissionDisplay) {
      annualCommissionDisplay.textContent = annualEarning.toLocaleString('en-US');
    }

    if (calcResAmountBox) {
      calcResAmountBox.classList.remove('pulse');
      void calcResAmountBox.offsetWidth;
      calcResAmountBox.classList.add('pulse');
      setTimeout(() => calcResAmountBox.classList.remove('pulse'), 220);
    }
  }

  if (studentRange) studentRange.addEventListener('input', calculate);
  if (trackSelect) trackSelect.addEventListener('change', calculate);
  if (batchesPerYear) batchesPerYear.addEventListener('change', calculate);

  calculate();
}

/* ==========================================================================
   4. GALLERY LIGHTBOX MODAL
   ========================================================================== */
function initLightbox() {
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (!lightboxModal) return;

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-img');
      const caption = card.getAttribute('data-caption');

      if (lightboxImg && lightboxCaption) {
        lightboxImg.src = src;
        lightboxCaption.textContent = caption || '';
      }

      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeModal);
  }

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. FAQ ACCORDION
   ========================================================================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
          }
        });

        if (isActive) {
          item.classList.remove('active');
        } else {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   6. QUICK INQUIRY / REGISTRATION FORM DISPATCH
   ========================================================================== */
function initForm() {
  const form = document.getElementById('quickRegForm');
  const typeButtons = document.querySelectorAll('.type-toggle-btn');
  let selectedType = 'student';

  typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      typeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedType = btn.getAttribute('data-type');
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const city = document.getElementById('formCity').value.trim();
      const track = document.getElementById('formTrack').value;
      const message = document.getElementById('formMessage').value.trim();

      const inquiryRole = selectedType === 'student' ? 'Student Enrollment (Reg Fee: PKR 2,000)' : 'Corporate Consulting / Partner Center';

      const whatsappText = `*ICTS Consulting — Request & Inquiry*
• *Inquiry Type:* ${inquiryRole}
• *Full Name:* ${name}
• *Phone/WhatsApp:* ${phone}
• *City / Organization:* ${city}
• *Selected Service / Track:* ${track}
${message ? `• *Notes:* ${message}` : ''}`;

      const whatsappUrl = `https://wa.me/923214223022?text=${encodeURIComponent(whatsappText)}`;
      window.open(whatsappUrl, '_blank');

      alert(`Thank you, ${name}! Your request for "${track}" has been prepared. Opening WhatsApp (+92 321 4223022) to connect directly with the ICTS Team.`);
      form.reset();
    });
  }
}

/* ==========================================================================
   7. SCROLL TO TOP
   ========================================================================== */
function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   8. FLIP CARDS — CLICK & TAP TO FLIP ANIMATION
   ========================================================================== */
function initFlipCards() {
  const certFlipCard = document.getElementById('certFlipCard');
  if (certFlipCard) {
    certFlipCard.addEventListener('click', () => {
      certFlipCard.classList.toggle('is-flipped');
    });
  }

  const isTouch = window.matchMedia('(hover: none)').matches;
  if (!isTouch) return;

  const flipCards = document.querySelectorAll('.flip-card, .cert-flip-box');
  flipCards.forEach(card => {
    if (card.closest('.gallery-card')) return;
    card.addEventListener('click', () => {
      card.classList.toggle('is-flipped');
    });
  });
}

/* ==========================================================================
   9. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

/* ==========================================================================
   10. INTERACTIVE 3D MOUSE TILT & HOVER MICRO-ANIMATIONS
   ========================================================================== */
function initCardTiltAnimations() {
  // Only apply on non-touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const tiltCards = document.querySelectorAll('.service-feature-card, .who-card, .pillar-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ==========================================================================
   11. COPYRIGHT YEAR
   ========================================================================== */
function updateCopyright() {
  const yearElem = document.getElementById('copyrightYear');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}