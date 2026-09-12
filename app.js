/**
 * ICTS CONSULTING (SMC-PRIVATE) LIMITED
 * Official Client-Side Interactive Logic & Micro-Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Enforce Light Theme across the entire application
  localStorage.removeItem('icts-theme');
  document.documentElement.removeAttribute('data-theme');

  initNavbar();
  initWorkshopModal();
  initCountdown();
  initCalculator();
  initLightbox();
  initFAQ();
  initForm();
  initScrollTop();
  initFlipCards();
  initScrollReveal();
  initCardTiltAnimations();
  initStatsCounterAnimation();
  initEventSlider();
  initHeroVideo();
  initPillarsSlider();
  initAiGuwenChatbot();
  updateCopyright();
});

/* ==========================================================================
   1. NAVBAR & MOBILE MENU (GUARANTEED DESKTOP VISIBILITY)
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navMenu) return;

  // Create backdrop if not existing
  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  // Header background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header && header.classList.add('scrolled');
    } else {
      header && header.classList.remove('scrolled');
    }
  }, { passive: true });

  function toggleMenu(forceClose) {
    if (!navToggle || !navMenu) return;
    const isCurrentlyOpen = navMenu.classList.contains('open');
    const shouldOpen = forceClose === true ? false : (forceClose === false ? true : !isCurrentlyOpen);

    navMenu.classList.toggle('open', shouldOpen);
    navToggle.classList.toggle('active', shouldOpen);
    backdrop.classList.toggle('open', shouldOpen);
    navToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      toggleMenu(true);
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        toggleMenu(true);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMenu(true);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && navMenu.classList.contains('open')) {
      toggleMenu(true);
    }
  });
  // Swipe-to-close gesture for mobile drawer
  let touchStartX = 0;
  let touchCurrentX = 0;
  navMenu.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  navMenu.addEventListener('touchmove', (e) => {
    touchCurrentX = e.touches[0].clientX;
  }, { passive: true });

  navMenu.addEventListener('touchend', () => {
    const swipeDistance = touchCurrentX - touchStartX;
    if (swipeDistance > 60 && navMenu.classList.contains('open')) {
      toggleMenu(true);
    }
    touchStartX = 0;
    touchCurrentX = 0;
  }, { passive: true });
}

/* ==========================================================================
   1.1 LIVE WORKSHOP MODAL HANDLER & COPY CREDENTIALS
   ========================================================================== */
function initWorkshopModal() {
  const modalTriggers = document.querySelectorAll('[data-open-workshop-modal], .open-workshop-modal');
  const modal = document.getElementById('workshopModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close-btn');
  const copyBtns = modal.querySelectorAll('[data-copy-text]');

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy-text');
      if (textToCopy && navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalHTML = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-check" style="margin-right: 4px;"></i><span>Copied!</span>';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('copied');
          }, 2000);
        }).catch(() => { });
      }
    });
  });
}
/* ==========================================================================
   2. LIVE ZOOM WORKSHOP REALTIME COUNTDOWN (MON-THU 10:00 PM PKT)
   ========================================================================== */
function initCountdown() {
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');
  const liveTimeClock = document.getElementById('liveTimeClock');

  if (!cdHours) return;

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
    if (!studentRange) return;

    const val = parseInt(studentRange.value, 10);
    const trackKey = trackSelect ? trackSelect.value : 'hsk1_2';
    const trackInfo = courseFees[trackKey] || courseFees.hsk1_2;

    if (studentValDisplay) {
      if (studentValDisplay.id === 'studentValDisplay' && document.getElementById('study-advisory')) {
        studentValDisplay.textContent = `${val} Hours/Week`;
      } else {
        studentValDisplay.textContent = `${val} Students`;
      }
    }

    if (batchesPerYear && batchCommissionDisplay) {
      const batches = parseInt(batchesPerYear.value, 10) || 1;
      const batchEarning = val * trackInfo.commissionPerStudent;
      const annualEarning = batchEarning * batches;

      batchCommissionDisplay.textContent = `PKR ${batchEarning.toLocaleString('en-US')}`;
      if (annualCommissionDisplay) {
        annualCommissionDisplay.textContent = annualEarning.toLocaleString('en-US');
      }
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
   6. FORMSPREE INQUIRY & FEEDBACK FORM (CONNECTS TO info@ictsconsulting.com)
   ========================================================================== */
function initForm() {
  const form = document.getElementById('contactInquiryForm') || document.getElementById('quickRegForm');
  const categoryPills = document.querySelectorAll('.category-pill-btn');
  const categoryInput = document.getElementById('selectedCategoryInput');
  const subjectInput = document.getElementById('formSubject');
  const serviceSelect = document.getElementById('formServiceSelect');
  const hiddenSubject = document.getElementById('hiddenFormSubject');

  let activeCategory = 'General Query';

  // Category Pills Toggle
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => {
        p.classList.remove('active');
        p.style.background = '#FFF';
        p.style.color = '#000';
        p.style.borderColor = '#D9B29C';
      });

      pill.classList.add('active');
      pill.style.background = '#000000';
      pill.style.color = '#F1CF54';
      pill.style.borderColor = '#000000';

      activeCategory = pill.getAttribute('data-category') || 'General Query';
      if (categoryInput) categoryInput.value = activeCategory;

      // Auto-adapt dropdown and subject placeholder based on category
      if (serviceSelect) {
        if (activeCategory === 'Course Inquiry') {
          serviceSelect.value = 'HSK 1-2 Beginners Mandarin Track';
        } else if (activeCategory === 'Feedback') {
          serviceSelect.value = 'Feedback / Review on Services';
        } else if (activeCategory === 'Suggestion') {
          serviceSelect.value = 'Suggestion / Partnership Proposal';
        } else {
          serviceSelect.value = 'General Query / Information';
        }
      }

      if (hiddenSubject) {
        hiddenSubject.value = `[ICTS Portal: ${activeCategory}] ${subjectInput && subjectInput.value ? subjectInput.value : 'New Submission'}`;
      }
    });
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const firstNameEl = document.getElementById('formFirstName');
      const lastNameEl = document.getElementById('formLastName');
      const emailEl = document.getElementById('formEmail');
      const phoneEl = document.getElementById('formPhone');
      const serviceEl = document.getElementById('formServiceSelect');
      const subjectEl = document.getElementById('formSubject');
      const messageEl = document.getElementById('formMessage');

      const submitBtn = document.getElementById('formSubmitBtn');
      const submitText = document.getElementById('formSubmitText');
      const submitIcon = document.getElementById('formSubmitIcon');

      const successAlert = document.getElementById('formStatusSuccess');
      const errorAlert = document.getElementById('formStatusError');
      const errorMsg = document.getElementById('formStatusErrorMsg');

      // Hide any previous alert
      if (successAlert) successAlert.style.display = 'none';
      if (errorAlert) errorAlert.style.display = 'none';

      // Values
      const firstName = firstNameEl ? firstNameEl.value.trim() : '';
      const lastName = lastNameEl ? lastNameEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const phone = phoneEl ? phoneEl.value.trim() : '';
      const service = serviceEl ? serviceEl.value : 'General';
      const subject = subjectEl ? subjectEl.value.trim() : 'Inquiry';
      const message = messageEl ? messageEl.value.trim() : '';

      if (!firstName || !lastName || !email || !subject || !message) {
        if (errorAlert) {
          if (errorMsg) errorMsg.textContent = 'Please fill out all required fields marked with (*).';
          errorAlert.style.display = 'block';
        }
        return;
      }

      // Set Submitting State
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.75';
        submitBtn.style.cursor = 'not-allowed';
      }
      if (submitText) submitText.textContent = 'Sending Message to info@ictsconsulting.com...';
      if (submitIcon) submitIcon.className = 'fa-solid fa-spinner fa-spin';

      const payload = {
        "First Name": firstName,
        "Last Name": lastName,
        "Full Name": `${firstName} ${lastName}`,
        "email": email,
        "_replyto": email,
        "Phone / WhatsApp": phone || "Not provided",
        "Inquiry Category": activeCategory,
        "Program / Topic": service,
        "_subject": `[ICTS Portal: ${activeCategory}] ${subject} (from ${firstName} ${lastName})`,
        "Subject": subject,
        "Message": message
      };

      try {
        const response = await fetch("https://formspree.io/f/xdeornvw", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          if (successAlert) {
            successAlert.style.display = 'block';
            successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          form.reset();

          // Reset pills to first pill
          if (categoryPills.length > 0) {
            categoryPills[0].click();
          }
        } else {
          const data = await response.json();
          if (errorAlert) {
            if (errorMsg) {
              if (data.errors && data.errors.length > 0) {
                errorMsg.textContent = data.errors.map(err => err.message).join(', ');
              } else {
                errorMsg.innerHTML = 'Unable to send message right now. Please email us directly at <a href="mailto:info@ictsconsulting.com" style="color: #991B1B; font-weight: 800; text-decoration: underline;">info@ictsconsulting.com</a>.';
              }
            }
            errorAlert.style.display = 'block';
          }
        }
      } catch (err) {
        console.error('Form submission network error:', err);
        if (errorAlert) {
          if (errorMsg) {
            errorMsg.innerHTML = 'Network connection error. Please email us directly at <a href="mailto:info@ictsconsulting.com" style="color: #991B1B; font-weight: 800; text-decoration: underline;">info@ictsconsulting.com</a> or WhatsApp +92 322 9223022.';
          }
          errorAlert.style.display = 'block';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.style.cursor = 'pointer';
        }
        if (submitText) submitText.textContent = 'Send Message to info@ictsconsulting.com';
        if (submitIcon) submitIcon.className = 'fa-solid fa-paper-plane';
      }
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
   11. STATS NUMBER SMOOTH COUNT-UP ANIMATION
   ========================================================================== */
function initStatsCounterAnimation() {
  const statNumbers = document.querySelectorAll('.hero-stat-number, .about-stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const originalText = el.textContent.trim();
        const targetNum = parseInt(originalText.replace(/[^0-9]/g, ''), 10);
        const suffix = originalText.replace(/[0-9]/g, '');

        if (!isNaN(targetNum) && targetNum > 0) {
          let current = 0;
          const duration = 1200;
          const steps = 30;
          const increment = Math.ceil(targetNum / steps);
          const intervalTime = Math.floor(duration / steps);

          const counter = setInterval(() => {
            current += increment;
            if (current >= targetNum) {
              current = targetNum;
              clearInterval(counter);
            }
            el.textContent = current + suffix;
          }, intervalTime);
        }
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.6 });

  statNumbers.forEach(stat => observer.observe(stat));
}

/* ==========================================================================
   12. COPYRIGHT YEAR
   ========================================================================== */
function updateCopyright() {
  const yearElem = document.getElementById('copyrightYear');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   13. AUTOMATIC EVENT SLIDESHOW (AUTOPLAY + PAUSE ON HOVER + CONTROLS)
   ========================================================================== */
function initEventSlider() {
  const slider = document.getElementById('eventSlider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.event-slide');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  const slideDuration = 3500; // Auto-slides every 3.5 seconds

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        restartAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    slides[currentIndex].classList.remove('active');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];
    if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      restartAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      restartAutoplay();
    });
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, slideDuration);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
}

/* ==========================================================================
   14. HERO BACKGROUND VIDEO CONTROLLER
   ========================================================================== */
function initHeroVideo() {
  const video = document.getElementById('heroBgVideo');
  const controlPill = document.getElementById('heroVideoControl');
  const textElem = document.getElementById('videoControlText');
  const pauseIcon = document.getElementById('videoPauseIcon');
  const playIcon = document.getElementById('videoPlayIcon');

  if (!video || !controlPill) return;

  // Attempt autoplay with audio muted
  video.muted = true;
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Browser autoplay policy might need first interaction
      const resumeOnAction = () => {
        video.play().catch(() => { });
        document.removeEventListener('click', resumeOnAction);
        document.removeEventListener('scroll', resumeOnAction);
      };
      document.addEventListener('click', resumeOnAction, { once: true });
      document.addEventListener('scroll', resumeOnAction, { once: true });
    });
  }

  function togglePlayback(e) {
    e && e.stopPropagation();
    if (video.paused) {
      video.play().then(() => {
        controlPill.classList.remove('paused');
        if (textElem) textElem.textContent = 'Video Playing';
        if (pauseIcon) pauseIcon.style.display = 'block';
        if (playIcon) playIcon.style.display = 'none';
      }).catch(() => { });
    } else {
      video.pause();
      controlPill.classList.add('paused');
      if (textElem) textElem.textContent = 'Video Paused';
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (playIcon) playIcon.style.display = 'block';
    }
  }

  controlPill.addEventListener('click', togglePlayback);
}

/* ==========================================================================
   15. 4 PILLARS OF SERVICE AUTOMATIC SLIDER (AUTOPLAY + PROGRESS TIMELINE)
   ========================================================================== */
function initPillarsSlider() {
  const slider = document.getElementById('pillarsSlider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.pillar-slide');
  const tabBtns = slider.querySelectorAll('.pillar-tab-btn');
  const dots = slider.querySelectorAll('.pillar-dot');
  const prevBtn = document.getElementById('pillarPrevBtn');
  const nextBtn = document.getElementById('pillarNextBtn');
  const timerBar = document.getElementById('pillarTimerBar');

  if (!slides.length) return;

  let currentPillar = 0;
  let progressInterval = null;
  const slideDuration = 4500; // 4.5 seconds per pillar
  let elapsed = 0;
  const tick = 50; // update progress every 50ms

  function showSlide(index) {
    slides[currentPillar].classList.remove('active');
    if (tabBtns[currentPillar]) {
      tabBtns[currentPillar].classList.remove('active');
      tabBtns[currentPillar].setAttribute('aria-selected', 'false');
    }
    if (dots[currentPillar]) dots[currentPillar].classList.remove('active');

    currentPillar = (index + slides.length) % slides.length;

    slides[currentPillar].classList.add('active');
    if (tabBtns[currentPillar]) {
      tabBtns[currentPillar].classList.add('active');
      tabBtns[currentPillar].setAttribute('aria-selected', 'true');
    }
    if (dots[currentPillar]) dots[currentPillar].classList.add('active');

    resetProgress();
  }

  function nextSlide() {
    showSlide(currentPillar + 1);
  }

  function prevSlide() {
    showSlide(currentPillar - 1);
  }

  function resetProgress() {
    elapsed = 0;
    if (timerBar) timerBar.style.width = '0%';
  }

  function startAutoplay() {
    stopAutoplay();
    resetProgress();
    progressInterval = setInterval(() => {
      elapsed += tick;
      const pct = Math.min(100, (elapsed / slideDuration) * 100);
      if (timerBar) timerBar.style.width = `${pct}%`;
      if (elapsed >= slideDuration) {
        nextSlide();
      }
    }, tick);
  }

  function stopAutoplay() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }

  // Interactive tab navigation
  tabBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      showSlide(idx);
      startAutoplay();
    });
  });

  // Navigation dots
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      startAutoplay();
    });
  });

  // Next / Prev buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
    });
  }

  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
}

/* ==========================================================================
   16. AI GÙWÈN (智能顾问) OFFICIAL KNOWLEDGE CHATBOT
   Trained comprehensively on all data across ICTS Consulting website
   ========================================================================== */
function initAiGuwenChatbot() {
  // Check if chatbot container already exists, otherwise create it dynamically
  let chatWrapper = document.getElementById('aiGuwenWrapper');
  if (!chatWrapper) {
    chatWrapper = document.createElement('div');
    chatWrapper.id = 'aiGuwenWrapper';
    chatWrapper.className = 'ai-guwen-wrapper';
    chatWrapper.innerHTML = `
      <!-- Welcome Floating Speech Bubble Tooltip -->
      <div class="ai-guwen-tooltip" id="aiGuwenTooltip">
        <button class="ai-guwen-tooltip-close" id="closeAiTooltip" aria-label="Close tooltip">×</button>
        <div style="font-weight: 800; color: var(--yellow-main); margin-bottom: 2px;"><i class="fa-solid fa-robot" style="margin-right:4px;"></i> Nǐ Hǎo! I'm AI gùwèn</div>
        <div>Your ICTS Consultant robot. Ask me about courses, spiritual sciences, CEO message, services, events & collaborations!</div>
      </div>

      <!-- Floating Launcher Button with 3D Robot Avatar -->
      <button class="ai-guwen-launcher" id="aiGuwenLauncher" aria-label="Open AI gùwèn Chatbot" title="Chat with AI gùwèn">
        <img src="assests/ai_guwen_robot.webp" alt="AI gùwèn Robot Avatar" class="ai-guwen-avatar-img">
        <span class="ai-guwen-badge-label">AI GÙWÈN</span>
        <span class="ai-guwen-status-dot" title="Online & Ready"></span>
      </button>

      <!-- Main Chat Window Modal -->
      <div class="ai-guwen-chat-window" id="aiGuwenChatWindow" role="dialog" aria-modal="true" aria-label="AI gùwèn Chat Window">
        <!-- Chat Header -->
        <div class="ai-guwen-header">
          <div class="ai-guwen-header-left">
            <img src="assests/ai_guwen_robot.webp" alt="AI gùwèn Robot" class="ai-guwen-header-avatar">
            <div class="ai-guwen-header-info">
              <h4>AI gùwèn <span style="font-size:11px; font-weight:700; color:#F1CF54; background:rgba(241,207,84,0.2); padding:1px 6px; border-radius:99px;">智能顾问</span></h4>
              <span>ICTS Official Advisor · Online 24/7</span>
            </div>
          </div>
          <div class="ai-guwen-header-actions">
            <button class="ai-guwen-header-btn" id="aiGuwenClear" title="Restart Chat" aria-label="Clear chat">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
            </button>
            <button class="ai-guwen-header-btn" id="aiGuwenClose" title="Minimize Chat" aria-label="Close chat">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>

        <!-- Messages Stream -->
        <div class="ai-guwen-messages-area" id="aiGuwenMessages"></div>

        <!-- Quick Questions Chips -->
        <div class="ai-guwen-chips-bar" id="aiGuwenChips">
          <button class="ai-chip" data-query="Tell me about the CEO Message & Vision"><i class="fa-solid fa-bullhorn"></i> CEO Message</button>
          <button class="ai-chip" data-query="What courses do you offer?"><i class="fa-solid fa-graduation-cap"></i> All Courses</button>
          <button class="ai-chip" data-query="Tell me about Spiritual Sciences & Loh-o-Qalam"><i class="fa-solid fa-feather-pointed"></i> Spiritual Sciences</button>
          <button class="ai-chip" data-query="What are the 4 pillars of service?"><i class="fa-solid fa-building-columns"></i> 4 Pillars</button>
          <button class="ai-chip" data-query="Tell me about Learn N Earn & 20% Commission"><i class="fa-solid fa-hand-holding-dollar"></i> Learn N Earn (20%)</button>
          <button class="ai-chip" data-query="When is the Free Live Zoom Workshop?"><i class="fa-solid fa-video"></i> Free Zoom Class</button>
          <button class="ai-chip" data-query="Tell me about your Collaborations and CIT Alliance"><i class="fa-solid fa-handshake"></i> Collaborations</button>
          <button class="ai-chip" data-query="How can I enroll or contact?"><i class="fa-solid fa-file-pen"></i> How to Enroll</button>
        </div>

        <!-- Chat Input Footer -->
        <form class="ai-guwen-footer" id="aiGuwenForm">
          <input type="text" class="ai-guwen-input" id="aiGuwenInput" placeholder="Ask about courses, spiritual sciences, CEO message, services, events..." autocomplete="off">
          <button type="submit" class="ai-guwen-send-btn" id="aiGuwenSendBtn" aria-label="Send Message">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
    `;
    document.body.appendChild(chatWrapper);
  }

  const launcher = document.getElementById('aiGuwenLauncher');
  const chatWindow = document.getElementById('aiGuwenChatWindow');
  const closeBtn = document.getElementById('aiGuwenClose');
  const clearBtn = document.getElementById('aiGuwenClear');
  const messagesArea = document.getElementById('aiGuwenMessages');
  const chatForm = document.getElementById('aiGuwenForm');
  const chatInput = document.getElementById('aiGuwenInput');
  const tooltip = document.getElementById('aiGuwenTooltip');
  const closeTooltipBtn = document.getElementById('closeAiTooltip');
  const chipsContainer = document.getElementById('aiGuwenChips');

  // Automatically show welcome tooltip after 2.5s if not dismissed
  if (tooltip && !sessionStorage.getItem('ai-guwen-tooltip-dismissed')) {
    setTimeout(() => {
      tooltip.classList.add('show');
    }, 2500);
  }

  if (closeTooltipBtn && tooltip) {
    closeTooltipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      tooltip.classList.remove('show');
      sessionStorage.setItem('ai-guwen-tooltip-dismissed', '1');
    });
  }

  function toggleChat(open) {
    const isOpen = open !== undefined ? open : !chatWindow.classList.contains('open');
    chatWindow.classList.toggle('open', isOpen);
    if (isOpen) {
      if (tooltip) tooltip.classList.remove('show');
      if (chatInput) chatInput.focus();
      if (!messagesArea.children.length) {
        renderWelcomeMessage();
      }
    }
  }

  launcher.addEventListener('click', () => toggleChat());
  closeBtn.addEventListener('click', () => toggleChat(false));
  clearBtn.addEventListener('click', () => {
    messagesArea.innerHTML = '';
    renderWelcomeMessage();
  });

  // Comprehensive Website Knowledge Base Engine (Up to date with entire website)
  const knowledgeBase = [
    // 1. CEO MESSAGE & LEADERSHIP
    {
      keywords: ['ceo', 'founder', 'ibrar', 'bhatti', 'azeemi', 'director', 'managing director', 'ceo message', 'message from ceo', 'leadership', 'vision of ceo', 'mission of ceo', 'quote', 'ibrar hussain'],
      response: `<b>Message from the CEO — Mr. Ibrar Hussain Bhatti Azeemi</b>
<p><i>CEO &amp; Managing Director, ICTS Consulting (SMC-Private) Limited</i></p>
<p style="color:var(--brand-red); font-weight:800; margin:6px 0;">"Building Connections. Creating Opportunities. Serving with Purpose."</p>
<p>At ICTS Consulting, we believe true success is not measured only by what we achieve, but by the value we create for others. Our mission brings together <b>People, Knowledge, Technology, and Opportunities</b> across our four verticals.</p>
<blockquote style="background:rgba(0,0,0,0.05); border-left:3px solid var(--yellow-main); padding:6px 12px; margin:8px 0; font-style:italic;">
“With faith in our hearts, knowledge in our minds, and purpose in our work, we strive to create a better and more connected world.”
</blockquote>
<p><b>Strategic Value Chain:</b><br>
People gain knowledge → Technology creates efficiency → Projects create results → Languages create understanding → Businesses create opportunities → Communities experience growth.</p>`,
      actions: [
        { label: 'Read Company Profile', url: 'about.html#ceo-leadership' },
        { label: 'Spiritual Counseling with CEO', url: 'spiritual-sciences.html' },
        { label: 'WhatsApp CEO Office', url: 'https://wa.me/923214223022', external: true }
      ]
    },

    // 2. SPIRITUAL SCIENCES & COUNSELING & LOH-O-QALAM
    {
      keywords: ['spiritual', 'spiritual sciences', 'counseling', 'loh-o-qalam', 'lohoqalam', 'anger', 'anger management', 'anxiety', 'overthinking', 'mindfulness', 'meditation', 'self-discipline', 'procrastination', 'fears', 'relationship', 'inner peace', 'burnout', 'decision making', 'ghussa', 'irfan-e-elahi', 'mushkilaat ka hal', 'dreams', 'consciousness'],
      response: `<b>Spiritual Counseling &amp; Loh-o-Qalam Training</b> (By Mr. Ibrar Hussain Bhatti):
<p><b>1. 1-on-1 Confidential Spiritual Counseling:</b> Safe, private sessions providing practical guidance on:</p>
<ul>
  <li><b>Anger Management:</b> Mapping Trigger → Thought → Emotion → Reaction → Consequence (featured in TV discourse on <i>Mushkilaat Ka Hal / Irfan-e-Elahi</i>).</li>
  <li><b>Self-Discipline &amp; Procrastination:</b> Building consistent daily routines and personal accountability.</li>
  <li><b>Anxiety &amp; Worry:</b> Grounding practices to replace overthinking with clarity.</li>
  <li><b>Overthinking &amp; Negative Thoughts:</b> Distinguishing Fact vs Interpretation vs Fear vs Response.</li>
  <li><b>Fears &amp; Insecurity, Relationships &amp; Family Harmony, Low Confidence, Inner Peace &amp; Burnout, and Decision-Making.</b></li>
</ul>
<p><b>2. 3-Month LOH-O-QALAM Training Program:</b><br>
12 Weekly Live Interactive Sessions (60–90 Mins each), practical workbook, attention drills, dream exploration, and consciousness mapping.</p>`,
      actions: [
        { label: 'Explore Spiritual Sciences Page', url: 'spiritual-sciences.html' },
        { label: 'Book 1-on-1 Counseling on WhatsApp', url: 'https://wa.me/923214223022?text=Hello%20Mr.%20Ibrar%20Hussain%20Bhatti,%20I%20would%20like%20to%20consult%20you%20regarding%20Spiritual%20Counseling%20and%20Loh-o-Qalam.', external: true },
        { label: 'View 12-Session Syllabus', url: 'spiritual-sciences.html#lohoqalam-course' }
      ]
    },

    // 3. MANDARIN CHINESE COURSES (HSK 1-6) - NO PRICES
    {
      keywords: ['hsk', 'mandarin', 'chinese course', 'chinese courses', 'learn chinese', 'hsk 1', 'hsk 2', 'hsk 3', 'hsk 4', 'hsk 5', 'hsk 6', 'chinese language', 'hsk-1', 'hsk-2', 'hsk-3', 'hsk-4', 'hsk-5', 'hsk-6'],
      response: `<b>Official HSK 3.0 Chinese Language Proficiency Track (Levels 1–6)</b>:
<ul>
  <li><b>HSK-1 (Beginner):</b> 32 Credit Hours (8 Weeks) · Pinyin phonetics, standard pronunciation, basic vocabulary &amp; daily greetings.</li>
  <li><b>HSK-2 (Elementary):</b> 32 Credit Hours (8 Weeks) · Daily dialogues, shopping, travel, and essential sentence structures.</li>
  <li><b>HSK-3 (Intermediate):</b> 64 Credit Hours (16 Weeks) · University admission baseline, work &amp; academic communication.</li>
  <li><b>HSK-4 (Upper-Intermediate):</b> 64 Credit Hours (16 Weeks) · Fluent conversationalist, full degree scholarship qualification.</li>
  <li><b>HSK-5 (Academic Mastery):</b> 96 Credit Hours (24 Weeks) · Newspaper reading, film comprehension, and executive speeches.</li>
  <li><b>HSK-6 (Native-Level):</b> 96 Credit Hours (24 Weeks) · High-level commercial translation and professional fluency.</li>
</ul>
<p><i><b>Modes Available:</b> Live Interactive Zoom Batches + Lifetime HD Recorded Lectures. Includes official Wo Hui AI Mock Exams and certificate support.</i></p>`,
      actions: [
        { label: 'View Detailed Courses Page', url: 'courses.html' },
        { label: 'Fill Registration Form (Live / Recorded)', url: 'https://docs.google.com/forms/d/e/1FAIpQLSfu58wEK60URVaBsQEgCcEPFz9A6HcU3x0G4nj8HsfsjZu_gg/viewform', external: true },
        { label: 'WhatsApp Admissions', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20want%20to%20know%20about%20HSK%20course%20admissions', external: true }
      ]
    },

    // 4. YCT KIDS CHINESE & SUMMER CAMP
    {
      keywords: ['yct', 'kids', 'children', 'child', 'school', 'teen', 'summer camp', 'grades 2 to 8', 'bacho', 'kids chinese', 'yct-1', 'yct-2', 'yct-3', 'yct-4', 'young learners'],
      response: `<b>Youth Chinese Test (YCT) &amp; Summer Camps (Ages 6–15)</b>:
<ul>
  <li><b>YCT-1 (Starter):</b> 24 Credit Hours · Pinyin songs, colors, numbers, and animal flashcards.</li>
  <li><b>YCT-2 (Elementary):</b> 24 Credit Hours · Family members, school life, and simple dialogues.</li>
  <li><b>YCT-3 (Intermediate):</b> 48 Credit Hours · Storytelling, Hanzi character recognition, and hobbies.</li>
  <li><b>YCT-4 (Advanced):</b> 48 Credit Hours · Paragraph reading, cultural themes, and speech writing.</li>
  <li><b>YCT Mock &amp; Camp:</b> Diagnostic testing with 100% pass record, cultural immersion, and calligraphy.</li>
  <li><b>6-Week Mandarin Summer Camp (Grades 2–8):</b> Proven 12-session intensive camp where kids independently present self-introductions in fluent Mandarin!</li>
</ul>`,
      actions: [
        { label: 'Enroll Child Online', url: 'https://docs.google.com/forms/d/e/1FAIpQLSfu58wEK60URVaBsQEgCcEPFz9A6HcU3x0G4nj8HsfsjZu_gg/viewform', external: true },
        { label: 'WhatsApp Kids Advisory', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20am%20interested%20in%20YCT%20Kids%20Chinese%20for%20my%20child', external: true },
        { label: 'View Summer Camp Showcase', url: 'courses.html#summer-camp' }
      ]
    },

    // 5. BCT BUSINESS CHINESE
    {
      keywords: ['bct', 'business chinese', 'business mandarin', 'trader', 'executive', '1688 procurement', 'bct-a', 'bct-b', 'bct trade', 'bct cpec', 'bct spoken'],
      response: `<b>BCT Business Chinese (For Importers, Traders &amp; Executives)</b>:
<ul>
  <li><b>BCT-A (Standard 1, 2 &amp; 3):</b> 96 Credit Hours · Commercial dialogues, factory visits, dining etiquette &amp; business cards.</li>
  <li><b>BCT-B (Standard 4 &amp; 5):</b> 96 Credit Hours · Executive contracts, banking, customs terms &amp; Joint Ventures.</li>
  <li><b>BCT Spoken Fluency:</b> High-frequency commercial negotiations, pricing &amp; meeting etiquette.</li>
  <li><b>BCT Trade Sourcing:</b> Direct 1688 / Alibaba factory communication, MOQs, quotations &amp; shipping terms.</li>
  <li><b>BCT CPEC Alliances:</b> Bilateral trade frameworks, corporate partnerships &amp; MoUs.</li>
</ul>`,
      actions: [
        { label: 'Enroll Executive Online', url: 'https://docs.google.com/forms/d/e/1FAIpQLSfu58wEK60URVaBsQEgCcEPFz9A6HcU3x0G4nj8HsfsjZu_gg/viewform', external: true },
        { label: 'WhatsApp Business Track', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20am%20interested%20in%20BCT%20Business%20Chinese', external: true }
      ]
    },

    // 6. CHINA PRODUCT SOURCING & E-COMMERCE MASTER PROGRAM
    {
      keywords: ['ecommerce', 'e-commerce', 'sourcing', 'china sourcing', '1688', 'alibaba', 'shopify', 'master program', 'product sourcing', 'private label', 'branding', '24 weeks', 'meta ads', 'tiktok ads'],
      response: `<b>China Product Sourcing &amp; E-Commerce Master Program (24 Weeks / 6 Levels)</b>:
<p>A step-by-step masterclass to source, brand, launch, and scale your global business from China:</p>
<ul>
  <li><b>Level 1 (Weeks 1–4):</b> E-Commerce foundation, AI winning product research &amp; margin validation.</li>
  <li><b>Level 2 (Weeks 5–8):</b> Direct 1688/Alibaba factory sourcing, Chinese price negotiation &amp; QC audits.</li>
  <li><b>Level 3 (Weeks 9–12):</b> Private label branding, custom packaging, 3D renders &amp; viral video content.</li>
  <li><b>Level 4 (Weeks 13–16):</b> High-conversion Shopify store setup, payment gateways &amp; automated fulfillment.</li>
  <li><b>Level 5 (Weeks 17–20):</b> Digital marketing blueprints (Meta Ads, TikTok Spark Ads, Google PMax &amp; ROAS optimization).</li>
  <li><b>Level 6 (Weeks 21–24):</b> Global D2C launch, Pakistan wholesale B2B distribution &amp; scaling.</li>
</ul>`,
      actions: [
        { label: 'Enroll in E-Com Masterclass', url: 'https://docs.google.com/forms/d/e/1FAIpQLSfu58wEK60URVaBsQEgCcEPFz9A6HcU3x0G4nj8HsfsjZu_gg/viewform', external: true },
        { label: 'WhatsApp Sourcing Desk', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20want%20to%20enroll%20in%20the%20China%20Product%20Sourcing%20&%20E-Commerce%20Master%20Program', external: true },
        { label: 'View Program Roadmap', url: 'courses.html#china-ecommerce-master' }
      ]
    },

    // 7. DIGITAL COMMERCE MASTER PROGRAM (UPCOMING / WAITLIST)
    {
      keywords: ['digital commerce', 'amazon', 'amazon fba', 'tiktok shop', 'local shopify', 'cod', 'cash on delivery', 'stripe', 'fintech', 'performance marketing', 'waitlist', 'pre-register'],
      response: `<b>Digital Commerce Master Program (Upcoming / Pre-Registration Open)</b>:
<ul>
  <li><b>Amazon FBA:</b> Product hunting, listing optimization, Amazon PPC, and warehousing (USA, UK &amp; UAE).</li>
  <li><b>TikTok Shop &amp; Social Commerce:</b> Live stream selling, creator affiliate marketing, and viral short videos.</li>
  <li><b>Local Shopify in Pakistan:</b> Cash-on-Delivery (COD) courier APIs (Trax, TCS, CallCourier), high-converting stores.</li>
  <li><b>Performance Marketing:</b> Profitable Meta, TikTok, and Google ad funnels with custom conversion tracking.</li>
  <li><b>Cross-Border Fintech &amp; Stripe Setup:</b> International LLC/LTD company registration from Pakistan, verified Stripe and Wise business accounts.</li>
  <li><b>AI Tools &amp; Automation:</b> AI-assisted product research, automated copywriting, and customer support bots.</li>
</ul>`,
      actions: [
        { label: 'Pre-Register on Waitlist', url: 'https://docs.google.com/forms/d/e/1FAIpQLSfu58wEK60URVaBsQEgCcEPFz9A6HcU3x0G4nj8HsfsjZu_gg/viewform', external: true },
        { label: 'WhatsApp Early Bird', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20want%20to%20pre-register%20for%20Digital%20Commerce', external: true }
      ]
    },

    // 8. OTHER FOREIGN LANGUAGES
    {
      keywords: ['english', 'ielts', 'arabic', 'gulf arabic', 'german', 'goethe', 'japanese', 'jlpt', 'korean', 'topik', 'other languages', 'foreign languages', 'international languages'],
      response: `<b>Other International Language Programs at ICTS Consulting</b>:
<ul>
  <li><b>English Language:</b> IELTS exam preparation, Business English, and executive corporate reporting.</li>
  <li><b>Arabic Language:</b> Gulf business Arabic, conversational fluency, and commercial translation.</li>
  <li><b>German Language:</b> Goethe-Institut A1–B2 certification for engineering studies, medical professionals &amp; German opportunity visas.</li>
  <li><b>Japanese &amp; Korean:</b> JLPT &amp; TOPIK exam preparation for East Asian technology careers and university scholarships.</li>
</ul>`,
      actions: [
        { label: 'Inquire Language Tracks', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20am%20interested%20in%20Foreign%20Language%20Training', external: true },
        { label: 'View Languages Page', url: 'courses.html#international-languages' }
      ]
    },

    // 9. ALL COURSES CONSOLIDATED
    {
      keywords: ['all courses', 'courses list', 'what courses', 'offerings', 'curriculum list', 'tamam courses', 'course list'],
      response: `<b>Complete Course Portfolio at ICTS Consulting</b>:
<ol>
  <li><b>Mandarin Chinese:</b> HSK 3.0 (Levels 1–6), YCT for Kids (Ages 6–15), BCT Business Chinese, and Wo Hui HSK Mock series.</li>
  <li><b>Spiritual Sciences:</b> 1-on-1 Spiritual Counseling and 3-Month LOH-O-QALAM Training with Mr. Ibrar Hussain Bhatti.</li>
  <li><b>E-Commerce &amp; Sourcing:</b> 24-Week China Product Sourcing &amp; E-Commerce Master Program + Digital Commerce (Amazon/TikTok/Shopify/Stripe).</li>
  <li><b>Other International Languages:</b> English (IELTS), Arabic (Gulf Business), German (Goethe A1-B2), Japanese (JLPT), and Korean (TOPIK).</li>
</ol>
<p><i>All programs offer flexible options for <b>Live Interactive Zoom Sessions</b> and <b>Lifetime HD Recorded Lectures</b>.</i></p>`,
      actions: [
        { label: 'Explore All Courses', url: 'courses.html' },
        { label: 'Register Online Now', url: 'https://docs.google.com/forms/d/e/1FAIpQLSfu58wEK60URVaBsQEgCcEPFz9A6HcU3x0G4nj8HsfsjZu_gg/viewform', external: true },
        { label: 'WhatsApp Admissions', url: 'https://wa.me/923229223022', external: true }
      ]
    },

    // 10. BATCH TIMINGS & SCHEDULES
    {
      keywords: ['batch', 'timing', 'schedule', 'time', 'classes timing', 'kab hoti hain', 'morning', 'evening', 'afternoon', 'timings'],
      response: `<b>ICTS Regular Batch Timings &amp; Schedules</b>:
<ul>
  <li><b>Morning Batch:</b> 9:00 AM – 11:00 AM PKT (University students, freelancers &amp; early professionals)</li>
  <li><b>Afternoon Batch:</b> 2:00 PM – 4:00 PM PKT (Midday learners &amp; institutional cohorts)</li>
  <li><b>Evening Batch:</b> 8:00 PM – 10:00 PM PKT (Working executives, traders &amp; professionals)</li>
  <li><b>Kids Batch (YCT):</b> 5:00 PM – 6:30 PM PKT (Ages 6–15 after school hours)</li>
  <li><b>Free Daily Zoom Workshop:</b> Monday to Thursday at <b>10:00 PM PKT</b></li>
</ul>
<p><i>Recorded lectures with lifetime access are also provided for all enrolled students!</i></p>`,
      actions: [
        { label: 'Register for Preferred Batch', url: 'https://docs.google.com/forms/d/e/1FAIpQLSfu58wEK60URVaBsQEgCcEPFz9A6HcU3x0G4nj8HsfsjZu_gg/viewform', external: true },
        { label: 'WhatsApp Batch Coordinator', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20please%20tell%20me%20about%20batch%20timings', external: true }
      ]
    },

    // 11. PRICING & FEE INQUIRY (NO HARDCODED PRICES - DIRECT TO ENROLLMENT & INCLUSIONS)
    {
      keywords: ['fee', 'fees', 'cost', 'price', 'pricing', 'kitni fee', 'charges', 'expense', 'paisa', 'kitna kharcha'],
      response: `<b>ICTS Course Inclusions &amp; Fee Inquiries</b>:
<p>Program fees vary depending on your chosen course track, level, and learning mode (<b>Live Interactive Zoom Batches</b> or <b>Lifetime HD Recorded Lectures</b>).</p>
<p><b>Every enrollment includes:</b></p>
<ul>
  <li>Complete live instruction or lifetime recorded video lectures</li>
  <li>Official Standard textbooks &amp; Hanzi writing workbooks</li>
  <li>Official Wo Hui HSK AI Mock examination portal credentials</li>
  <li>Direct WhatsApp instructor support and verified completion certificates</li>
</ul>
<p>Please fill out our short registration form or message our admissions coordinator on WhatsApp for current intake fee packages and early-bird discounts!</p>`,
      actions: [
        { label: 'Fill Online Registration Form', url: 'https://docs.google.com/forms/d/e/1FAIpQLSfu58wEK60URVaBsQEgCcEPFz9A6HcU3x0G4nj8HsfsjZu_gg/viewform', external: true },
        { label: 'WhatsApp Fee & Batch Inquiry', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20want%20to%20know%20the%20fee%20structure%20and%20intake%20details%20for%20courses', external: true },
        { label: 'View Courses Page', url: 'courses.html' }
      ]
    },

    // 12. 4 CORE PILLARS OF SERVICES
    {
      keywords: ['pillar', 'pillars', 'services overview', 'capabilities', '4 pillars', 'char pillar', 'all services', 'what services', 'service'],
      response: `<b>ICTS Consulting 4 Core Pillars of Service</b>:
<ul>
  <li><b>1. Project Management Services:</b> Feasibility analysis, Earned Value Management (EVM), Primavera P6 &amp; MS Project baselines, PMO setup, and PMI standards.</li>
  <li><b>2. ICT &amp; Digital Services:</b> Corporate websites, student portals, cloud infrastructures (AWS/GCP/Azure), SaaS systems, and cybersecurity hardening.</li>
  <li><b>3. Foreign Languages &amp; Education:</b> Accredited Mandarin training for HSK 1–6, YCT for Kids, and BCT Business Chinese with official Wo Hui AI Mock testing platform.</li>
  <li><b>4. Business Promotion Consultancy:</b> China-Pakistan CPEC bilateral trade linkages, supplier vetting, commercial negotiations, and institutional network growth.</li>
</ul>`,
      actions: [
        { label: 'Explore 4 Pillars in Detail', url: 'services.html' },
        { label: 'Open a Chinese Language Center', url: 'services.html#center-setup' },
        { label: 'WhatsApp Services Desk', url: 'https://wa.me/923229223022', external: true }
      ]
    },

    // 13. PILLAR 1: PROJECT MANAGEMENT SERVICES
    {
      keywords: ['project management', 'primavera', 'p6', 'evm', 'earned value', 'ms project', 'pmo', 'pmp', 'capm', 'scheduling', 'variance', 'cpm', 'wbs'],
      response: `<b>Project Management Services (Pillar 01)</b>:
<p>ICTS provides industry-certified project management advisory aligned with PMI &amp; PMBOK standards:</p>
<ul>
  <li><b>Planning &amp; Baseline Scheduling:</b> Work Breakdown Structure (WBS), Critical Path Method (CPM), and Primavera P6 / MS Project architectures.</li>
  <li><b>EVM Control &amp; Variance Analysis:</b> Earned Value Management tracking (SPI, CPI, cost variance prevention, and executive stakeholder dashboards).</li>
  <li><b>PMO Governance &amp; Setup:</b> Establishment of corporate Project Management Offices, phase-gate audits, and risk mitigation registers.</li>
  <li><b>Corporate Capacity Building:</b> PMP, CAPM, and engineering project management preparation.</li>
</ul>`,
      actions: [
        { label: 'Project Services Details', url: 'services.html#project-management' },
        { label: 'WhatsApp Consultant', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20am%20interested%20in%20Project%20Management%20Services', external: true }
      ]
    },

    // 14. PILLAR 2: ICT & DIGITAL SERVICES
    {
      keywords: ['ict', 'digital', 'technology', 'web', 'website', 'cloud', 'cyber', 'cybersecurity', 'software', 'app', 'portal', 'erp', 'crm', 'saas', 'seo'],
      response: `<b>ICT &amp; Digital Services (Pillar 02)</b>:
<p>We build robust, high-performance technology ecosystems:</p>
<ul>
  <li><b>Web Portals &amp; SaaS Systems:</b> Responsive corporate websites, student learning portals, LMS, and API integrations.</li>
  <li><b>Cloud &amp; Infrastructure:</b> Cloud migration (AWS, Google Cloud, Azure), SSL security, daily backups, and 99.9% uptime architecture.</li>
  <li><b>Cybersecurity:</b> Vulnerability assessments, endpoint protection, and security audits.</li>
  <li><b>SEO, Analytics &amp; Automation:</b> Technical search engine optimization, automated CRM pipelines, and intelligent WhatsApp bots.</li>
</ul>`,
      actions: [
        { label: 'Explore Digital Services', url: 'services.html#ict-digital' },
        { label: 'Discuss Tech Project on WhatsApp', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20have%20an%20ICT/Web%20project%20inquiry', external: true }
      ]
    },

    // 15. PILLAR 4: BUSINESS PROMOTION & CHINA-PAKISTAN TRADE
    {
      keywords: ['business promotion', 'trade', 'china', 'pakistan', 'cpec', 'b2b', 'supplier', 'vetting', 'delegation', 'contract', 'import', 'export', 'due diligence', 'factory verification'],
      response: `<b>Business Promotion Consultancy (Pillar 04)</b>:
<p>Connecting businesses across the China-Pakistan Economic Corridor (CPEC):</p>
<ul>
  <li><b>Cross-Border B2B Matchmaking:</b> Facilitating bilateral commercial agreements between Pakistani and Chinese enterprises.</li>
  <li><b>Supplier Vetting &amp; Due Diligence:</b> On-ground factory audits, product quality inspections, and vendor credentials verification in China.</li>
  <li><b>Trade Delegation Support:</b> Commercial delegations, expo representation, visa advisory, and bilingual negotiations.</li>
  <li><b>Joint Venture Advisory:</b> Direct linkages with 800+ partner nodes globally.</li>
</ul>`,
      actions: [
        { label: 'Trade Promotion Details', url: 'services.html#business-promotion' },
        { label: 'WhatsApp Trade Desk', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20am%20interested%20in%20China-Pakistan%20Trade%20Consultancy', external: true }
      ]
    },

    // 16. OPEN A CHINESE LANGUAGE CENTER (TURNKEY SETUP)
    {
      keywords: ['open center', 'center setup', 'franchise', 'start center', 'language center', 'smart classroom', 'open chinese center', 'licensing center'],
      response: `<b>Turnkey Educational Advisory: Open a Chinese Language Center</b>:
<p>ICTS guides you step-by-step on how to open, license, equip, staff, and run a high-performing Chinese Language Center:</p>
<ul>
  <li><b>Step 1: Feasibility &amp; Business Planning:</b> Demographic catchment study, CAPEX/OPEX budgeting &amp; cash flow forecasts.</li>
  <li><b>Step 2: Licensing &amp; Accreditations:</b> Institutional registration, regulatory compliance &amp; HSK testing platform affiliation.</li>
  <li><b>Step 3: Smart Classroom Setup:</b> Interactive touchscreens, dual-audio Zoom broadcasting &amp; LMS student portals.</li>
  <li><b>Step 4: Ministry Curriculum Supply:</b> Direct provision of official HSK 1–6 books, YCT flashcards &amp; Wo Hui AI Mock access.</li>
  <li><b>Step 5: Faculty Recruitment:</b> Vetting and screening of certified native and bilingual instructors.</li>
  <li><b>Step 6: Marketing &amp; Admissions:</b> Student mobilization funnels and institutional revenue sharing up to 20%.</li>
</ul>`,
      actions: [
        { label: 'Open Chinese Center Guide', url: 'services.html#center-setup' },
        { label: 'Chat with Center Advisor', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20want%20guidance%20on%20how%20to%20open%20a%20Chinese%20Language%20Center', external: true }
      ]
    },

    // 17. COLLABORATIONS & INSTITUTIONAL ALLIANCES
    {
      keywords: ['collaboration', 'collaborations', 'partner', 'partners', 'partnership', 'cit', 'cit pvt ltd', 'wo hui', 'wohui', 'uaf', 'university', 'alliances', 'institutional'],
      response: `<b>Official Collaborations &amp; Institutional Alliances</b>:
<ul>
  <li><b>ICTS &amp; CIT Pvt. Ltd. Strategic Partnership:</b> A nationwide initiative uniting ICTS's accredited Mandarin curriculum and teacher provisioning with CIT's network of <b>800+ learning centres</b> in Pakistan.</li>
  <li><b>Wo Hui Mandarin (Singapore / Global):</b> Official HSK Mock platform partner delivering AI-graded exam simulations across an 800+ global partner network.</li>
  <li><b>University of Agriculture Faisalabad (UAF):</b> Institutional Chinese examination partnership where candidates achieved a <b>100% exam pass rate</b>.</li>
  <li><b>School &amp; College Partnerships:</b> Providing schools, colleges, and academies with curriculum licensing, testing support, and up to <b>20% revenue sharing</b>.</li>
</ul>`,
      actions: [
        { label: 'View Collaboration Page', url: 'collaboration.html' },
        { label: 'Discuss Institutional Partnership', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20our%20institution%20wants%20to%20partner%20with%20ICTS', external: true }
      ]
    },

    // 18. EVENTS, LEARN N EARN & 20% COMMISSION MODEL
    {
      keywords: ['event', 'events', 'learn n earn', 'learn and earn', 'commission', '20%', '20 percent', 'referral', 'affiliate', 'student referral', 'earn money', 'kamai', 'chinese language day', 'summer camp'],
      response: `<b>Events &amp; Learn N Earn (20% Direct Commission Model)</b>:
<p>ICTS Consulting offers three lucrative earning pathways to monetize your network:</p>
<ul>
  <li><b>1. Individual Student Referral Program (20% Commission):</b> Earn an instant 20% cash commission for every student you refer to any language (HSK/YCT/BCT) or E-Commerce course (earn PKR 20,000 to 100,000+ monthly).</li>
  <li><b>2. E-Commerce Master Program Affiliate (20% Sharing):</b> Refer entrepreneurs &amp; trainees to the 24-Week China Product Sourcing Masterclass.</li>
  <li><b>3. Open a Chinese Center:</b> Institutional revenue sharing up to 20% for academy and center owners.</li>
  <li><b>Community Events:</b> International Chinese Language Day celebration in Lahore, Youth Certification Award ceremonies, and 6-week Summer Camps.</li>
</ul>`,
      actions: [
        { label: 'Explore Learn N Earn', url: 'events.html' },
        { label: 'Start Referring on WhatsApp (20%)', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20want%20to%20earn%2020%25%20by%20referring%20students', external: true }
      ]
    },

    // 19. FREE LIVE ZOOM WORKSHOP
    {
      keywords: ['free', 'zoom', 'workshop', 'trial', 'demo', 'time', 'timing', 'daily', '10 pm', 'live class', 'free class', 'meeting id', 'passcode'],
      response: `<b>Free Scheduled Live Zoom Workshop</b>:
<p><b>Chinese Language &amp; Business Promotional Workshop</b></p>
<ul>
  <li><b>Schedule:</b> Monday, Tuesday, Wednesday &amp; Thursday at <b>10:00 PM PKT</b></li>
  <li><b>Meeting Access:</b> Online Zoom Live · <b>100% Free Entry</b></li>
  <li><b>Meeting ID:</b> <code style="color:var(--yellow-main); font-weight:800; background:#000; padding:2px 6px; border-radius:4px;">823 7234 8859</code></li>
  <li><b>Passcode:</b> <code style="color:var(--yellow-main); font-weight:800; background:#000; padding:2px 6px; border-radius:4px;">893624</code></li>
  <li><b>Focus:</b> 40 minutes of pronunciation, Pinyin, interactive conversation practice, and student mobilization commission breakdown.</li>
</ul>`,
      actions: [
        { label: 'Join Live Zoom Stream', url: 'https://us06web.zoom.us/j/82372348859?pwd=pCsrMhFb1wW8bXUwb0jalWC5cAP1RT.1', external: true },
        { label: 'WhatsApp Workshop Link', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20please%20send%20me%20the%20Free%20Live%20Zoom%20Workshop%20link', external: true }
      ]
    },

    // 20. HOW TO REGISTER & ENROLL
    {
      keywords: ['register', 'enroll', 'admission', 'apply', 'form', 'admission form', 'kaise register karein', 'registration', 'recorded', 'recording', 'live lecture', 'recorded lecture', 'dakhla'],
      response: `<b>How to Register &amp; Enroll (Live Classes &amp; Recorded Lectures)</b>:
<ol>
  <li><b>Step 1:</b> Fill out our official online Google Registration Form and choose your preferred learning mode (<b>Live Interactive Zoom Batches</b> or <b>Lifetime HD Recorded Lectures</b>).</li>
  <li><b>Step 2:</b> Our admissions coordinator will reach out to you via WhatsApp (+92 322 9223022) with batch timings and registration confirmation.</li>
  <li><b>Step 3:</b> Receive your student LMS credentials, Wo Hui HSK Mock exam portal login, and Zoom classroom links!</li>
</ol>`,
      actions: [
        { label: 'Fill Registration Form (Live & Recorded)', url: 'https://docs.google.com/forms/d/e/1FAIpQLSfu58wEK60URVaBsQEgCcEPFz9A6HcU3x0G4nj8HsfsjZu_gg/viewform', external: true },
        { label: 'Instant WhatsApp Admissions', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20want%20to%20register%20now', external: true }
      ]
    },

    // 21. CONTACT & HEAD OFFICE
    {
      keywords: ['contact', 'address', 'location', 'phone', 'whatsapp', 'email', 'office', 'kahan hai', 'head office', 'lahore', 'call', 'number', 'helpline'],
      response: `<b>ICTS Consulting (SMC-Private) Limited Contact Details</b>:
<ul style="list-style:none; padding-left:0; margin:8px 0;">
  <li style="margin-bottom:6px;"><i class="fa-solid fa-location-dot" style="color:var(--brand-red); margin-right:6px;"></i><b>Head Office:</b> WAPDA Town Phase-I, Lahore, Punjab, Pakistan</li>
  <li style="margin-bottom:6px;"><i class="fa-solid fa-phone" style="color:var(--brand-red); margin-right:6px;"></i><b>Landline:</b> <a href="tel:+924235450375" style="color:var(--brand-red); font-weight:800;">+92 423 5450375</a></li>
  <li style="margin-bottom:6px;"><i class="fa-brands fa-whatsapp" style="color:#25D366; margin-right:6px;"></i><b>Admissions WhatsApp:</b> <a href="https://wa.me/923229223022" target="_blank" style="color:var(--brand-red); font-weight:800;">+92 322 9223022</a></li>
  <li style="margin-bottom:6px;"><i class="fa-brands fa-whatsapp" style="color:#25D366; margin-right:6px;"></i><b>Spiritual Sciences WhatsApp:</b> <a href="https://wa.me/923214223022" target="_blank" style="color:var(--brand-red); font-weight:800;">+92 321 4223022</a></li>
  <li style="margin-bottom:6px;"><i class="fa-solid fa-envelope" style="color:var(--brand-red); margin-right:6px;"></i><b>Email:</b> info@ictsconsulting.com</li>
  <li style="margin-bottom:6px;"><i class="fa-regular fa-clock" style="color:var(--brand-red); margin-right:6px;"></i><b>Office Hours:</b> Mon–Fri: 9:00 AM – 6:00 PM PKT | Free Zoom: 10:00 PM PKT</li>
</ul>`,
      actions: [
        { label: 'WhatsApp Admissions', url: 'https://wa.me/923229223022', external: true },
        { label: 'WhatsApp Spiritual Counseling', url: 'https://wa.me/923214223022', external: true },
        { label: 'View Contact Page & Map', url: 'contact.html' }
      ]
    },

    // 22. ABOUT COMPANY & PROFILE
    {
      keywords: ['about', 'who are you', 'company', 'history', 'secp', 'vision', 'mission', 'icts consulting', 'company profile'],
      response: `<b>About ICTS Consulting (SMC-Private) Limited</b>:
<ul>
  <li>SECP-registered corporate consulting, technology, and language education enterprise based in Lahore, Pakistan.</li>
  <li><b>Motto:</b> <i>Plan Better. Manage Smarter. Deliver Successfully.</i></li>
  <li><b>Leadership:</b> Mr. Ibrar Hussain Bhatti Azeemi (CEO &amp; Managing Director).</li>
  <li><b>4 Core Verticals:</b> Project Management (EVM/P6), ICT &amp; Digital Solutions, Foreign Language Education (Mandarin HSK/YCT/BCT), and China-Pakistan Business Promotion.</li>
  <li><b>Network:</b> Institutional alliance with CIT Pvt. Ltd. (800+ learning centres) and Wo Hui Mandarin (800+ global partner network).</li>
</ul>`,
      actions: [
        { label: 'Read Company Profile', url: 'about.html' },
        { label: 'Institutional Collaboration', url: 'collaboration.html' }
      ]
    },

    // 23. GREETINGS
    {
      keywords: ['hi', 'hello', 'hey', 'ni hao', 'nǐ hǎo', 'salam', 'assalam', 'aoa', 'halo', 'greeting', '你好'],
      response: `<b>Nǐ Hǎo (你好) and Welcome to ICTS Consulting!</b>
<p>I am <b>AI gùwèn (智能顾问)</b>, your dedicated AI consultant robot. I am trained on all services, course curriculums, spiritual sciences counseling, CEO vision, collaborations, and events across ICTS Consulting.</p>
<p>How may I assist you today? Feel free to click any suggestion below or type your question!</p>`,
      actions: [
        { label: 'View CEO Message', url: 'about.html#ceo-leadership' },
        { label: 'Explore All Courses', url: 'courses.html' },
        { label: 'Spiritual Sciences', url: 'spiritual-sciences.html' },
        { label: 'Free Zoom Session', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20want%20to%20join%20the%20Free%20Zoom%20Workshop', external: true }
      ]
    },

    // 24. THANK YOU & CLOSING
    {
      keywords: ['thanks', 'thank you', 'shukriya', 'xie xie', 'xièxie', 'great', 'awesome', 'good', 'ok', 'okay', '谢谢'],
      response: `<b>You're very welcome! (不客气 · Bù kèqì)</b>
<p>At ICTS Consulting, we are always here to help you plan better, work smarter, communicate globally, and grow sustainably.</p>
<p>Feel free to ask another question or connect directly with our advisors on WhatsApp at <b>+92 322 9223022</b>.</p>`,
      actions: [
        { label: 'Chat on WhatsApp', url: 'https://wa.me/923229223022', external: true },
        { label: 'Explore Home', url: 'index.html' }
      ]
    }
  ];

  function renderWelcomeMessage() {
    appendBotMessage(`<b>Nǐ Hǎo! I am AI gùwèn (智能顾问)</b>
<p>I am ICTS Consulting's official intelligent assistant, trained on all data across our website including:</p>
<ul>
  <li><b>Core Message of CEO &amp; Leadership</b> (Mr. Ibrar Hussain Bhatti Azeemi)</li>
  <li><b>Spiritual Sciences &amp; Loh-o-Qalam</b> (1-on-1 Counseling &amp; 3-Month Training)</li>
  <li><b>All Courses &amp; Programs</b> (HSK 1-6, YCT Kids, BCT Business, 24-Wk E-Com Master, Digital Commerce, Languages)</li>
  <li><b>4 Pillars of Service &amp; Turnkey Center Setup</b> (Project Management, ICT, Languages, Trade)</li>
  <li><b>Learn N Earn (20% Direct Commission Model) &amp; Daily Free Live Zoom Workshop</b></li>
  <li><b>Collaborations</b> (CIT Pvt. Ltd. 800+ Centers &amp; Wo Hui Global Network)</li>
</ul>
<p>Feel free to click any suggestion below or ask me any question!</p>`, [
      { label: '<i class="fa-solid fa-bullhorn"></i> CEO Message', query: 'Tell me about the CEO Message & Vision' },
      { label: '<i class="fa-solid fa-graduation-cap"></i> All Courses', query: 'What courses do you offer?' },
      { label: '<i class="fa-solid fa-feather-pointed"></i> Spiritual Sciences', query: 'Tell me about Spiritual Sciences & Loh-o-Qalam' },
      { label: '<i class="fa-solid fa-video"></i> Free Zoom Class', query: 'When is the Free Live Zoom Workshop?' }
    ]);
  }

  function appendUserMessage(text) {
    const row = document.createElement('div');
    row.className = 'ai-msg-row user';
    row.innerHTML = `<div class="ai-msg-bubble">${escapeHtml(text)}</div>`;
    messagesArea.appendChild(row);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  function appendBotMessage(htmlContent, actions = []) {
    const row = document.createElement('div');
    row.className = 'ai-msg-row bot';

    let actionBtnsHtml = '';
    if (actions && actions.length) {
      actionBtnsHtml = `<div class="ai-msg-actions">` + actions.map(act => {
        if (act.query) {
          return `<button class="ai-action-btn" data-query="${escapeHtml(act.query)}">${act.label}</button>`;
        }
        const target = act.external ? 'target="_blank" rel="noopener"' : '';
        return `<a href="${act.url}" ${target} class="ai-action-btn">${escapeHtml(act.label)} →</a>`;
      }).join('') + `</div>`;
    }

    row.innerHTML = `
      <img src="assests/ai_guwen_robot.webp" alt="AI gùwèn" class="ai-msg-avatar">
      <div class="ai-msg-bubble">
        ${htmlContent}
        ${actionBtnsHtml}
      </div>
    `;
    messagesArea.appendChild(row);

    // Attach listeners to query action buttons
    row.querySelectorAll('button.ai-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const q = btn.getAttribute('data-query');
        if (q) handleUserInput(q);
      });
    });

    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'ai-msg-row bot typing-row';
    indicator.id = 'aiTypingIndicator';
    indicator.innerHTML = `
      <img src="assests/ai_guwen_robot.webp" alt="AI gùwèn" class="ai-msg-avatar">
      <div class="ai-typing-indicator">
        <span></span><span></span><span></span>
      </div>
    `;
    messagesArea.appendChild(indicator);
    messagesArea.scrollTop = messagesArea.scrollHeight;
    return indicator;
  }

  function removeTypingIndicator() {
    const el = document.getElementById('aiTypingIndicator');
    if (el) el.remove();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function findBestAnswer(query) {
    const cleanQuery = query.toLowerCase().trim();

    let bestMatch = null;
    let highestScore = 0;

    knowledgeBase.forEach(item => {
      let score = 0;
      item.keywords.forEach(kw => {
        const cleanKw = kw.toLowerCase();
        if (cleanQuery === cleanKw) {
          score += 100; // Exact match bonus
        } else if (cleanQuery.includes(cleanKw)) {
          score += cleanKw.length * 2; // Longer keyword match carries higher priority
        }
      });
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    });

    if (bestMatch && highestScore > 0) {
      return bestMatch;
    }

    // Default Fallback Response
    return {
      response: `Thank you for your question! 
<p>As <b>AI gùwèn</b>, I can assist you with anything regarding <b>ICTS Consulting</b>, including our <b>CEO Message &amp; Vision</b>, <b>Spiritual Sciences &amp; Loh-o-Qalam</b>, <b>All Language &amp; E-Commerce Courses</b>, our <b>4 Service Pillars</b>, <b>Learn N Earn 20% Commission</b>, <b>Institutional Collaborations</b>, and our <b>Daily 10 PM Free Zoom Workshops</b>.</p>
<p>Would you like to connect directly with an advisor on WhatsApp?</p>`,
      actions: [
        { label: 'Chat on WhatsApp', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20have%20an%20inquiry%20regarding%20' + encodeURIComponent(query), external: true },
        { label: 'Explore All Courses', url: 'courses.html' },
        { label: 'Spiritual Sciences', url: 'spiritual-sciences.html' },
        { label: 'View 4 Pillars', url: 'services.html' }
      ]
    };
  }

  function handleUserInput(query) {
    const trimmed = query.trim();
    if (!trimmed) return;

    appendUserMessage(trimmed);
    showTypingIndicator();

    // AI reasoning delay simulation (350ms)
    setTimeout(() => {
      removeTypingIndicator();
      const result = findBestAnswer(trimmed);
      appendBotMessage(result.response, result.actions);
    }, 380);
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = chatInput.value;
    chatInput.value = '';
    handleUserInput(query);
  });

  // Suggestion chips clicks
  if (chipsContainer) {
    chipsContainer.querySelectorAll('.ai-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const q = chip.getAttribute('data-query');
        if (q) handleUserInput(q);
      });
    });
  }
}

/* ==========================================================================
   17. DYNAMIC COPYRIGHT YEAR
   ========================================================================== */
function updateCopyright() {
  const yearSpan = document.getElementById('copyrightYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}