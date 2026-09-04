/**
 * ICTS CONSULTING (SMC-PRIVATE) LIMITED
 * Official Client-Side Interactive Logic & Micro-Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Enforce Light Theme across the entire application
  localStorage.removeItem('icts-theme');
  document.documentElement.removeAttribute('data-theme');

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
  initStatsCounterAnimation();
  initEventSlider();
  initHeroVideo();
  initPillarsSlider();
  initAiGuwenChatbot();
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

  // Create backdrop if not existing
  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header && header.classList.add('scrolled');
    } else {
      header && header.classList.remove('scrolled');
    }
  }, { passive: true });

  function toggleMenu(forceClose) {
    if (!navToggle || !navMenu) return;
    const shouldOpen = forceClose === undefined ? !navMenu.classList.contains('open') : !forceClose;
    navMenu.classList.toggle('open', shouldOpen);
    navToggle.classList.toggle('active', shouldOpen);
    backdrop.classList.toggle('open', shouldOpen);
    navToggle.setAttribute('aria-expanded', shouldOpen);
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    backdrop.addEventListener('click', () => {
      toggleMenu(true);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          toggleMenu(true);
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
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

      const whatsappUrl = `https://wa.me/923229223022?text=${encodeURIComponent(whatsappText)}`;
      window.open(whatsappUrl, '_blank');

      alert(`Thank you, ${name}! Your request for "${track}" has been prepared. Opening WhatsApp (+92 322 9223022) to connect directly with the ICTS Team.`);
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
        <div style="font-weight: 800; color: var(--yellow-main); margin-bottom: 2px;">👋 Nǐ Hǎo! I'm AI gùwèn</div>
        <div>Your ICTS Consultant robot. Ask me about courses, fees, services, PMO & trade!</div>
      </div>

      <!-- Floating Launcher Button with 3D Robot Avatar -->
      <button class="ai-guwen-launcher" id="aiGuwenLauncher" aria-label="Open AI gùwèn Chatbot" title="Chat with AI gùwèn">
        <img src="assests/ai_guwen_robot.jpg" alt="AI gùwèn Robot Avatar" class="ai-guwen-avatar-img">
        <span class="ai-guwen-badge-label">AI GÙWÈN</span>
        <span class="ai-guwen-status-dot" title="Online & Ready"></span>
      </button>

      <!-- Main Chat Window Modal -->
      <div class="ai-guwen-chat-window" id="aiGuwenChatWindow" role="dialog" aria-modal="true" aria-label="AI gùwèn Chat Window">
        <!-- Chat Header -->
        <div class="ai-guwen-header">
          <div class="ai-guwen-header-left">
            <img src="assests/ai_guwen_robot.jpg" alt="AI gùwèn Robot" class="ai-guwen-header-avatar">
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
          <button class="ai-chip" data-query="What are the 4 pillars of service?">🏛️ 4 Pillars</button>
          <button class="ai-chip" data-query="Tell me about Chinese HSK courses & fees">🎓 Courses &amp; Fees</button>
          <button class="ai-chip" data-query="When is the Free Live Zoom Workshop?">🎥 Free Zoom Class</button>
          <button class="ai-chip" data-query="How can I enroll or contact?">📝 How to Enroll</button>
          <button class="ai-chip" data-query="Tell me about Project Management services">📊 Project (EVM)</button>
          <button class="ai-chip" data-query="What Business Promotion & trade services do you offer?">🤝 China-Pak Trade</button>
        </div>

        <!-- Chat Input Footer -->
        <form class="ai-guwen-footer" id="aiGuwenForm">
          <input type="text" class="ai-guwen-input" id="aiGuwenInput" placeholder="Ask AI gùwèn about courses, fees, PMO, trade..." autocomplete="off">
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

  // Comprehensive Website Knowledge Base Engine
  const knowledgeBase = [
    {
      keywords: ['pillar', 'pillars', 'core vertical', 'services overview', 'capabilities', '4 pillars', 'char pillar', 'char khambey'],
      response: `<b>ICTS Consulting (SMC-Private) Limited</b> operates across <b>4 Core Pillars of Service</b>:
<ul>
  <li><b>1. Project Management Services:</b> Feasibility analysis, Earned Value Management (EVM), Primavera P6 & MS Project baselines, PMO setup, and PMI standards.</li>
  <li><b>2. ICT & Digital Services:</b> Corporate websites, cloud infrastructures, web portals, automated business systems, and cybersecurity.</li>
  <li><b>3. Foreign Languages (Mandarin Chinese):</b> Accredited training for HSK 1–6, YCT for Kids, and BCT Business Chinese with official Wo Hui HSK Mock testing platform (800+ global partner network).</li>
  <li><b>4. Business Promotion Consultancy:</b> China-Pakistan CPEC bilateral trade linkages, supplier vetting, commercial negotiations, and institutional networking.</li>
</ul>`,
      actions: [
        { label: 'Explore 4 Pillars', url: 'services.html' },
        { label: 'View Language Courses', url: 'courses.html' }
      ]
    },
    {
      keywords: ['hsk', 'mandarin', 'chinese', 'language', 'course', 'courses', 'fee', 'fees', 'cost', 'price', 'pricing', 'kitni fee', 'fees structure'],
      response: `Here is our <b>Official Mandarin Chinese Course & Fee Structure</b>:
<ul>
  <li><b>HSK-1 (Beginner):</b> PKR 20,000 · 32 Credit Hours (8 weeks · 4 days/wk · 40 min)</li>
  <li><b>HSK-2 (Elementary):</b> PKR 20,000 · 32 Credit Hours (8 weeks)</li>
  <li><b>HSK-3 (Intermediate):</b> PKR 40,000 · 64 Credit Hours (16 weeks)</li>
  <li><b>HSK-4 (Upper-Intermediate):</b> PKR 40,000 · 64 Credit Hours (16 weeks)</li>
  <li><b>HSK-5 (Advanced Academic):</b> PKR 60,000 · 96 Credit Hours (24 weeks)</li>
  <li><b>HSK-6 (Native Mastery):</b> PKR 60,000 · 96 Credit Hours (24 weeks)</li>
</ul>
<p><i>Registration Fee: PKR 2,000 (one-time). Includes official Wo Hui HSK Mock platform exam prep and certificate support.</i></p>
<p>We also offer <b>YCT (Youth Chinese Test for kids ages 6–15)</b> and <b>BCT (Business Chinese for traders & executives)</b>!</p>`,
      actions: [
        { label: 'View Detailed Courses Page', url: 'courses.html' },
        { label: 'Fill Registration Form', url: 'https://docs.google.com/forms/d/e/1FAIpQLSfu58wEK60URVaBsQEgCcEPFz9A6HcU3x0G4nj8HsfsjZu_gg/viewform', external: true },
        { label: 'WhatsApp Admissions', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20want%20to%20know%20about%20Chinese%20course%20admissions', external: true }
      ]
    },
    {
      keywords: ['free', 'zoom', 'workshop', 'trial', 'demo', 'time', 'timing', 'daily', '10 pm', 'live class', 'free class'],
      response: `<b>Free Live Zoom Mandarin Workshop</b>:
<ul>
  <li><b>Schedule:</b> Monday to Thursday at <b>10:00 PM PKT</b></li>
  <li><b>Duration:</b> 40 Minutes of intensive, interactive pronunciation, Pinyin, and conversation practice with certified instructors.</li>
  <li><b>Cost:</b> 100% Free trial session!</li>
  <li><b>Access:</b> Join live on Zoom from your laptop or mobile phone.</li>
</ul>
<p>Would you like to reserve your spot for tonight's session?</p>`,
      actions: [
        { label: 'Join via WhatsApp', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20please%20send%20me%20the%20Free%20Live%20Zoom%20Workshop%20link', external: true },
        { label: 'Call Office: +92 423 5450375', url: 'tel:+924235450375' }
      ]
    },
    {
      keywords: ['project management', 'primavera', 'p6', 'evm', 'earned value', 'ms project', 'pmo', 'pmp', 'capm', 'scheduling', 'variance'],
      response: `<b>Project Management Services (Pillar 01)</b>:
ICTS provides industry-certified project management advisory aligned with PMI standards:
<ul>
  <li><b>Scheduling & Baseline:</b> Primavera P6 & MS Project WBS and Critical Path Method (CPM) baseline scheduling.</li>
  <li><b>EVM Control:</b> Earned Value Management tracking (SPI, CPI, cost variance prevention).</li>
  <li><b>PMO Governance:</b> Setup of corporate Project Management Offices, phase-gate audits, and risk registers.</li>
  <li><b>Corporate Capacity Building:</b> Preparation workshops for PMP, CAPM, and engineering project managers.</li>
</ul>`,
      actions: [
        { label: 'Project Services Details', url: 'services.html#project-management' },
        { label: 'WhatsApp Consultant', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20am%20interested%20in%20Project%20Management%20Services', external: true }
      ]
    },
    {
      keywords: ['ict', 'digital', 'technology', 'web', 'website', 'cloud', 'cyber', 'cybersecurity', 'software', 'app', 'portal', 'erp', 'crm'],
      response: `<b>ICT & Digital Services (Pillar 02)</b>:
We engineer robust, enterprise-grade technology ecosystems:
<ul>
  <li><b>Custom Web Development:</b> High-performance corporate websites, student portals, CMS, and web apps.</li>
  <li><b>Cloud & Infrastructure:</b> Cloud migration, automated backups, and 99.9% uptime architectures.</li>
  <li><b>Cybersecurity:</b> Vulnerability testing, SSL encryption, endpoint protection, and security audits.</li>
  <li><b>Business Automation:</b> ERP/CRM integration and automated business workflow systems.</li>
</ul>`,
      actions: [
        { label: 'Explore Digital Services', url: 'services.html#ict-digital' },
        { label: 'Discuss Tech Project', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20have%20an%20ICT/Web%20project%20inquiry', external: true }
      ]
    },
    {
      keywords: ['business promotion', 'trade', 'china', 'pakistan', 'cpec', 'b2b', 'supplier', 'vetting', 'delegation', 'contract', 'import', 'export'],
      response: `<b>Business Promotion Consultancy (Pillar 04)</b>:
Connecting businesses across the China-Pakistan economic corridor:
<ul>
  <li><b>Cross-Border B2B Matchmaking:</b> Facilitating bilateral trade agreements between Pakistani and Chinese enterprises.</li>
  <li><b>Supplier Vetting & Due Diligence:</b> On-ground factory audits, product quality inspections, and vendor credentials verification.</li>
  <li><b>Trade Delegation Support:</b> Commercial delegations, visa advisory, and bilingual business negotiations.</li>
  <li><b>Institutional Network:</b> Direct linkages with 800+ partner nodes globally.</li>
</ul>`,
      actions: [
        { label: 'Trade Promotion Details', url: 'services.html#business-promotion' },
        { label: 'Inquire on WhatsApp', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20am%20interested%20in%20China-Pakistan%20Trade%20Consultancy', external: true }
      ]
    },
    {
      keywords: ['contact', 'address', 'location', 'phone', 'whatsapp', 'email', 'office', 'kahan hai', 'head office', 'lahore', 'call', 'number'],
      response: `<b>ICTS Consulting (SMC-Private) Limited Contact Details</b>:
<ul>
  <li>📍 <b>Head Office:</b> WAPDA Town Phase-I, Lahore, Punjab, Pakistan</li>
  <li>📞 <b>Landline:</b> <a href="tel:+924235450375" style="color:var(--brand-red); font-weight:800;">+92 423 5450375</a></li>
  <li>💬 <b>Official WhatsApp:</b> <a href="https://wa.me/923229223022" target="_blank" style="color:var(--brand-red); font-weight:800;">+92 322 9223022</a></li>
  <li>✉️ <b>Email:</b> info@ictsconsulting.com</li>
  <li>⏰ <b>Office Hours:</b> Mon–Fri: 9:00 AM – 6:00 PM PKT | Daily Free Zoom: 10:00 PM PKT</li>
</ul>`,
      actions: [
        { label: 'WhatsApp Admissions & Support', url: 'https://wa.me/923229223022', external: true },
        { label: 'View Contact Page & Map', url: 'contact.html' }
      ]
    },
    {
      keywords: ['register', 'enroll', 'admission', 'apply', 'form', 'admission form', 'kaise register karein', 'registration'],
      response: `<b>How to Register & Enroll at ICTS Consulting</b>:
<ol>
  <li><b>Step 1:</b> Fill out our official online Google Registration Form.</li>
  <li><b>Step 2:</b> Our admissions coordinator will reach out to you via WhatsApp (+92 322 9223022) with batch schedules and fee payment methods.</li>
  <li><b>Step 3:</b> Receive your student LMS credentials, Wo Hui HSK Mock exam portal login, and Zoom classroom links!</li>
</ol>`,
      actions: [
        { label: 'Open Registration Form', url: 'https://docs.google.com/forms/d/e/1FAIpQLSfu58wEK60URVaBsQEgCcEPFz9A6HcU3x0G4nj8HsfsjZu_gg/viewform', external: true },
        { label: 'Instant WhatsApp Admissions', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20want%20to%20register%20now', external: true }
      ]
    },
    {
      keywords: ['about', 'who are you', 'company', 'history', 'secp', 'vision', 'mission', 'icts consulting'],
      response: `<b>About ICTS Consulting (SMC-Private) Limited</b>:
<ul>
  <li>Registered corporate consulting entity based in Lahore, Pakistan (SECP compliant).</li>
  <li><b>Motto:</b> <i>Plan Better. Manage Smarter. Deliver Successfully.</i></li>
  <li><b>Core Verticals:</b> Project Management (EVM/P6), ICT & Digital Transformation, Foreign Language Education (Mandarin HSK 1-6), and Business Promotion Consultancy.</li>
  <li>Partnered with Wo Hui HSK Mock platform across 800+ global partner centres.</li>
</ul>`,
      actions: [
        { label: 'Read Company Profile', url: 'about.html' },
        { label: 'Institutional Collaboration', url: 'collaboration.html' }
      ]
    },
    {
      keywords: ['hi', 'hello', 'hey', 'ni hao', 'nǐ hǎo', 'salam', 'assalam', 'aoa', 'halo', 'greeting', '你好'],
      response: `<b>Nǐ Hǎo (你好) and Welcome to ICTS Consulting!</b>
<p>I am <b>AI gùwèn (智能顾问)</b>, your dedicated AI consultant robot. I am trained on all services, course schedules, fee tables, project management methodologies, and trade solutions across ICTS Consulting.</p>
<p>How may I assist you today? You can tap one of the quick chips below or type any question!</p>`,
      actions: [
        { label: 'View 4 Pillars', url: 'services.html' },
        { label: 'Courses & Fees', url: 'courses.html' },
        { label: 'Free Zoom Session', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20want%20to%20join%20the%20Free%20Zoom%20Workshop', external: true }
      ]
    },
    {
      keywords: ['thanks', 'thank you', 'shukriya', 'xie xie', 'xièxie', 'great', 'awesome', 'good', 'ok', 'okay', '谢谢'],
      response: `<b>You're very welcome! (不客气 · Bù kèqì)</b>
<p>At ICTS Consulting, we are always here to help you plan better, work smarter, and communicate globally.</p>
<p>Feel free to ask another question or connect with our human advisors directly on WhatsApp at <b>+92 322 9223022</b>.</p>`,
      actions: [
        { label: 'Chat on WhatsApp', url: 'https://wa.me/923229223022', external: true },
        { label: 'Explore Home', url: 'index.html' }
      ]
    }
  ];

  function renderWelcomeMessage() {
    appendBotMessage(`<b>Nǐ Hǎo! I am AI gùwèn (智能顾问) 🤖</b>
<p>I am ICTS Consulting's official intelligent assistant, trained on all data across our website including:</p>
<ul>
  <li><b>4 Core Pillars of Service</b> (Project Management, ICT, Foreign Languages, Trade)</li>
  <li><b>Mandarin Chinese Courses &amp; Fees</b> (HSK 1-6, YCT, BCT, Wo Hui Mock Test)</li>
  <li><b>Daily Free Live Zoom Workshop</b> (Mon-Thu at 10:00 PM PKT)</li>
  <li><b>Admissions, Registration &amp; Contact Details</b></li>
</ul>
<p>Feel free to click any suggestion below or ask me a question!</p>`, [
      { label: '🏛️ 4 Pillars of Service', query: 'What are the 4 pillars of service?' },
      { label: '🎓 Courses & Fee Table', query: 'Tell me about Chinese HSK courses & fees' },
      { label: '🎥 Free Zoom Class', query: 'When is the Free Live Zoom Workshop?' }
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
          return `<button class="ai-action-btn" data-query="${escapeHtml(act.query)}">${escapeHtml(act.label)}</button>`;
        }
        const target = act.external ? 'target="_blank" rel="noopener"' : '';
        return `<a href="${act.url}" ${target} class="ai-action-btn">${escapeHtml(act.label)} →</a>`;
      }).join('') + `</div>`;
    }

    row.innerHTML = `
      <img src="assests/ai_guwen_robot.jpg" alt="AI gùwèn" class="ai-msg-avatar">
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
      <img src="assests/ai_guwen_robot.jpg" alt="AI gùwèn" class="ai-msg-avatar">
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
        if (cleanQuery.includes(kw)) {
          score += kw.length; // Longer matches carry more weight
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
<p>As <b>AI gùwèn</b>, I can help you with anything regarding <b>ICTS Consulting</b>, including our <b>4 Pillars</b> (Project Management, ICT & Digital Services, Foreign Languages Mandarin HSK/YCT/BCT, and China-Pakistan Business Promotion), our <b>Daily 10 PM Free Zoom Workshops</b>, or <b>Registration & Fees</b>.</p>
<p>Would you like to speak directly with an admissions consultant on WhatsApp?</p>`,
      actions: [
        { label: 'Chat on WhatsApp', url: 'https://wa.me/923229223022?text=Hello%20ICTS,%20I%20have%20an%20inquiry%20regarding%20' + encodeURIComponent(query), external: true },
        { label: 'View 4 Pillars', url: 'services.html' },
        { label: 'Check Courses & Fees', url: 'courses.html' }
      ]
    };
  }

  function handleUserInput(query) {
    const trimmed = query.trim();
    if (!trimmed) return;

    appendUserMessage(trimmed);
    showTypingIndicator();

    // AI reasoning delay simulation (400ms)
    setTimeout(() => {
      removeTypingIndicator();
      const result = findBestAnswer(trimmed);
      appendBotMessage(result.response, result.actions);
    }, 450);
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