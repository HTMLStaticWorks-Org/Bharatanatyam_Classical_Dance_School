/**
 * NRITYANJALI — ACADEMY OF BHARATANATYAM & CLASSICAL DANCE
 * Public Website Main JavaScript (assets/js/main.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Systems
  initTheme();
  initRTL();
  initNavbar();
  initMobileDrawer();
  initSeasonalSelector();
  initWorkshopFilters();
  initContactForm();
  initLoginForm();
  initRegisterForm();
  initFAQAccordion();
  initBackToTop();
  initInteractiveWorkbench();
});

/* ==========================================================================
   1. THEME SWITCHING (LIGHT / DARK)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('bloom-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeToggleUI(savedTheme);

  const themeBtns = document.querySelectorAll('.js-theme-toggle');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('bloom-theme', newTheme);
      updateThemeToggleUI(newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} mode`);
    });
  });
}

function updateThemeToggleUI(theme) {
  const themeBtns = document.querySelectorAll('.js-theme-toggle');
  themeBtns.forEach(btn => {
    const label = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  });
  const themeTexts = document.querySelectorAll('.js-theme-text');
  themeTexts.forEach(el => {
    el.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  });
}

/* ==========================================================================
   2. RTL SWITCHING (LTR / RTL)
   ========================================================================== */
function initRTL() {
  const savedRTL = localStorage.getItem('bloom-rtl') || 'ltr';
  document.documentElement.setAttribute('dir', savedRTL);
  updateRTLToggleUI(savedRTL);

  const rtlBtns = document.querySelectorAll('.js-rtl-toggle');
  rtlBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('bloom-rtl', newDir);
      updateRTLToggleUI(newDir);
      showToast(`Language direction set to ${newDir.toUpperCase()}`);
    });
  });
}

function updateRTLToggleUI(dir) {
  const rtlBtns = document.querySelectorAll('.js-rtl-toggle');
  rtlBtns.forEach(btn => {
    const label = dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  });
  const rtlTexts = document.querySelectorAll('.js-rtl-text');
  rtlTexts.forEach(el => {
    el.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
  });
}

/* ==========================================================================
   3. STICKY NAVBAR
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   4. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const hamburger = document.querySelector('.mobile-hamburger');
  const drawer = document.querySelector('.mobile-drawer');
  const closeBtn = document.querySelector('.drawer-close-btn');

  if (!hamburger || !drawer) return;

  // Create backdrop if not already existing
  let backdrop = document.querySelector('.drawer-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'drawer-backdrop';
    document.body.appendChild(backdrop);
  }

  const openDrawer = () => {
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // Close when clicking drawer links
  const drawerLinks = drawer.querySelectorAll('.mobile-drawer-link');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ESC key support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   5. INTERACTIVE SEASONAL STORY SELECTOR
   ========================================================================== */
const seasonalData = {
  spring: {
    title: "Vasantotsav — Spring Dance Festival & Padam Repertoire",
    meta: "SPRING REPERTOIRE SEASON",
    desc: "Celebrate renewal with delicate Ashtapadis, Jayadeva's Gita Govinda, soft rhythmic alarippus, and devotional invocations honoring nature and the divine.",
    img: "assets/images/season-spring.jpg",
    style: "Lyrical abhinaya, sringara and bhakti bhava with melodious ragas."
  },
  summer: {
    title: "Greeshma Nritya — Summer Intensive Adavu & Tala Bootcamp",
    meta: "SUMMER ACADEMY INTENSIVE",
    desc: "Rigorous physical stamina building, 64 classical adavus, complex teermanams, solkattu recitation, and daily yoga for classical dancers.",
    img: "assets/images/season-summer.jpg",
    style: "Pure nritta footwork, precision aramandi postures & endurance training."
  },
  autumn: {
    title: "Sharad Utsav — Navaratri Natyanjali & Devi Keerthanams",
    meta: "AUTUMN TEMPLE CELEBRATION",
    desc: "Nine nights of devotional temple offerings, fierce Durga stutis, lyrical Saraswati varnams, and grand ensemble temple courtyard presentations.",
    img: "assets/images/season-autumn.jpg",
    style: "Majestic group choreographies, dramatic sancharis & sacred temple traditions."
  },
  winter: {
    title: "Margazhi Mahotsav — Grand Winter Music & Dance Season",
    meta: "WINTER MARGAM FESTIVAL",
    desc: "Chennai's illustrious December cultural season recitals featuring complete 2-hour solo Margam presentations with live Carnatic orchestra.",
    img: "assets/images/season-winter.jpg",
    style: "Full traditional Margam repertoire: Alarippu through Tillana with live orchestra."
  }
};

function initSeasonalSelector() {
  const tabs = document.querySelectorAll('.seasonal-tab-btn');
  if (!tabs.length) return;

  const titleEl = document.getElementById('seasonal-title');
  const metaEl = document.getElementById('seasonal-meta');
  const descEl = document.getElementById('seasonal-desc');
  const styleEl = document.getElementById('seasonal-style');
  const imgEl = document.getElementById('seasonal-img');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const season = tab.dataset.season;
      if (!seasonalData[season]) return;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const data = seasonalData[season];
      if (titleEl) titleEl.textContent = data.title;
      if (metaEl) metaEl.textContent = data.meta;
      if (descEl) descEl.textContent = data.desc;
      if (styleEl) styleEl.textContent = data.style;
      if (imgEl) {
        imgEl.style.opacity = 0;
        setTimeout(() => {
          imgEl.src = data.img;
          imgEl.style.opacity = 1;
        }, 200);
      }
    });
  });
}

/* ==========================================================================
   6. WORKSHOP FILTER SYSTEM
   ========================================================================== */
function initWorkshopFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workshopCards = document.querySelectorAll('.workshop-card');

  if (!filterBtns.length || !workshopCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.filter;

      workshopCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease-out forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. CONTACT FORM VALIDATION
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name');
    const email = document.getElementById('contact-email');
    const type = document.getElementById('contact-type');
    const message = document.getElementById('contact-message');

    let isValid = true;

    if (!name.value.trim()) {
      showFieldError('name-error', 'Please enter your full name');
      isValid = false;
    } else {
      hideFieldError('name-error');
    }

    if (!email.value.trim() || !validateEmail(email.value)) {
      showFieldError('email-error', 'Please enter a valid email address');
      isValid = false;
    } else {
      hideFieldError('email-error');
    }

    if (!message.value.trim()) {
      showFieldError('message-error', 'Please write your message or enquiry');
      isValid = false;
    } else {
      hideFieldError('message-error');
    }

    if (isValid) {
      showToast('YOUR ENQUIRY HAS BEEN RECEIVED. We will respond within 24 hours.');
      contactForm.reset();
    }
  });
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
  }
}

function hideFieldError(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ==========================================================================
   8. AUTH & LOGIN / REGISTER VALIDATION
   ========================================================================== */
function initLoginForm() {
  const loginForm = document.getElementById('login-form');
  
  // Attach Social Login Listeners
  document.querySelectorAll('.js-social-login').forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.getAttribute('data-provider') || 'Social Account';
      showToast(`Signing in with ${provider}... Redirecting to portal...`);
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
    });
  });

  if (!loginForm) return;

  const pwdInput = document.getElementById('login-password');
  const togglePwdBtn = document.getElementById('toggle-password');

  if (togglePwdBtn && pwdInput) {
    togglePwdBtn.addEventListener('click', () => {
      const type = pwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
      pwdInput.setAttribute('type', type);
      togglePwdBtn.textContent = type === 'password' ? 'Show' : 'Hide';
    });
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = pwdInput ? pwdInput.value.trim() : '';

    if (email && password) {
      showToast('Login successful! Redirecting to guest studio portal...');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
    }
  });
}

function initRegisterForm() {
  const regForm = document.getElementById('register-form');
  if (!regForm) return;

  const pwdInput = document.getElementById('reg-password');
  const confirmPwdInput = document.getElementById('reg-confirm-password');
  const togglePwdBtn = document.getElementById('toggle-reg-password');
  const toggleConfirmPwdBtn = document.getElementById('toggle-reg-confirm-password');
  const errorEl = document.getElementById('register-error');

  if (togglePwdBtn && pwdInput) {
    togglePwdBtn.addEventListener('click', () => {
      const type = pwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
      pwdInput.setAttribute('type', type);
      togglePwdBtn.textContent = type === 'password' ? 'Show' : 'Hide';
    });
  }

  if (toggleConfirmPwdBtn && confirmPwdInput) {
    toggleConfirmPwdBtn.addEventListener('click', () => {
      const type = confirmPwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
      confirmPwdInput.setAttribute('type', type);
      toggleConfirmPwdBtn.textContent = type === 'password' ? 'Show' : 'Hide';
    });
  }

  regForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (pwdInput && confirmPwdInput && pwdInput.value !== confirmPwdInput.value) {
      if (errorEl) {
        errorEl.textContent = 'Passwords do not match. Please try again.';
        errorEl.style.display = 'block';
      }
      return;
    }

    if (errorEl) errorEl.style.display = 'none';
    showToast('Account created successfully! Welcome to Bloom & Form.');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 900);
  });
}

/* ==========================================================================
   9. FAQ ACCORDION
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });
}

/* ==========================================================================
   10. TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✿</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

/* ==========================================================================
   11. FLOATING BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  let btn = document.querySelector('.back-to-top-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'back-to-top-btn';
    btn.setAttribute('aria-label', 'Back to top');
    btn.setAttribute('title', 'Back to top');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);
  }

  const handleScroll = () => {
    if (window.scrollY > 280) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   12. INTERACTIVE ARTISAN WORKBENCH SIMULATOR
   ========================================================================== */
const workbenchPhases = {
  vessel: {
    index: 0,
    badge: "Phase 01 • Sthanaka & Aramandi",
    title: "Aramandi Stance & Geometric Precision",
    desc: "Master the foundational half-seated posture (Aramandi/Ayata Mandala), erect spine, grounded heels, and horizontal knee alignment described in the Natya Shastra.",
    img: "assets/images/program-beginner.jpg",
    cardTitle: "Technique Highlight: Center of Gravity & Stamina",
    cardText: "The Aramandi posture creates the sacred triangular geometry essential to Bharatanatyam, training deep quadricep endurance and rhythmic stability for fast-paced teermanams.",
    hotspots: [
      { top: "72%", start: "38%", title: "Salangai Foot Strike", desc: "Heels aligned at 180 degrees with rhythmic striking on the wooden dance floor in Tala cadence." },
      { top: "35%", start: "65%", title: "Spinal Balance", desc: "Erect posture maintaining Natyarambha arm stretch parallel to the floor." },
      { top: "60%", start: "22%", title: "Aramandi Knee Angle", desc: "Knees turned outward creating the hallmark diamond silhouette of classical South Indian dance." }
    ]
  },
  foliage: {
    index: 1,
    badge: "Phase 02 • Hastha Mudras",
    title: "Asamyuta & Samyuta Hasthas (Hand Gestures)",
    desc: "Learn the 28 single-hand (Asamyuta) and 24 double-hand (Samyuta) gestures from Abhinaya Darpana — each conveying gods, nature, emotions, and poetic symbols.",
    img: "assets/images/mudra-detail.jpg",
    cardTitle: "Technique Highlight: Mudra Clarity & Drishti Bheda",
    cardText: "Every mudra is paired with eye movements (Drishti) according to the timeless shloka: 'Yato Hasthastato Drishti, Yato Drishtistato Manah' — where the hand goes, the eye follows.",
    hotspots: [
      { top: "25%", start: "30%", title: "Pataka Hastha", desc: "Flag gesture symbolizing clouds, forest, night, river, and divine blessings." },
      { top: "50%", start: "55%", title: "Mayura & Hamsasya", desc: "Delicate gestures depicting peacocks, pearls, tying marriage vows, and flute playing." },
      { top: "75%", start: "45%", title: "Anjali & Shikhara", desc: "Devotional salutation offered to Lord Nataraja, Guru, and rasikas." }
    ]
  },
  blooms: {
    index: 2,
    badge: "Phase 03 • Tala & Nritta",
    title: "Teermanams & Jathiswaram Footwork",
    desc: "Execute intricate rhythmic cadences (Arithis, Muktayis, and Teermanams) set to complex cycles of Adi, Rupaka, and Misra Chapu talas guided by nattuvangam cymbals.",
    img: "assets/images/program-intermediate.jpg",
    cardTitle: "Technique Highlight: Sollukattu & Rhythmic Synchronization",
    cardText: "Dancers recite complex solkattu syllables (Tha-dhi-thom-nam) while executing split-second footwork, maintaining impeccable laya across slow, medium, and fast speeds.",
    hotspots: [
      { top: "32%", start: "45%", title: "Nattuvangam Sync", desc: "Perfect synchronization between the Guru's bronze taalam cymbals and dancer's ankle bells." },
      { top: "45%", start: "25%", title: "Jathi Speed Transitions", desc: "Navigating Vilamba (slow), Madhyama (medium), and Druta (fast) speeds with effortless grace." },
      { top: "68%", start: "60%", title: "Mridangam Rhythms", desc: "Echoing the resonant beats of the mridangam with crisp floor taps." }
    ]
  },
  finishing: {
    index: 3,
    badge: "Phase 04 • Abhinaya & Margam",
    title: "Varnam Mastery & Arangetram Stage Recital",
    desc: "Unite pure dance (Nritta) and expressive storytelling (Abhinaya) in the grand Varnam centerpiece, culminating in the festive Dhanashree Tillana and sacred Mangalam.",
    img: "assets/images/program-arangetram.jpg",
    cardTitle: "Technique Highlight: Sanchari Bhava & Navarasa",
    cardText: "Dancers evoke the nine classical emotional states (Navarasas) through nuanced micro-expressions of the eyes, brows, and facial muscles to bring ancient poetry to life.",
    hotspots: [
      { top: "40%", start: "50%", title: "Complete Margam Suite", desc: "A 2.5-hour solo graduation recital performed with live five-piece Carnatic orchestra." },
      { top: "80%", start: "35%", title: "Traditional Kanchipuram Silk", desc: "Pleated classical dance costume designed to fan open dramatically in deep postures." },
      { top: "20%", start: "65%", title: "Temple Jewelry & Alta", desc: "Traditional South Indian gold temple ornaments and auspicious red alta adorning hands and feet." }
    ]
  }
};

function initInteractiveWorkbench() {
  const container = document.querySelector('.workbench-container');
  if (!container) return;

  const stageImg = document.getElementById('workbench-img');
  const stageBadge = document.getElementById('workbench-badge');
  const titleEl = document.getElementById('workbench-title');
  const descEl = document.getElementById('workbench-desc');
  const cardTitle = document.getElementById('workbench-card-title');
  const cardText = document.getElementById('workbench-card-text');
  const buttons = document.querySelectorAll('.workbench-selector-btn');
  const dots = document.querySelectorAll('.workbench-dot');
  const stage = document.querySelector('.workbench-stage');

  function setPhase(key) {
    const data = workbenchPhases[key];
    if (!data) return;

    buttons.forEach(b => b.classList.toggle('active', b.dataset.workbench === key));
    dots.forEach((d, i) => d.classList.toggle('active', i === data.index));

    if (stageBadge) stageBadge.textContent = data.badge;
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
    if (cardTitle) cardTitle.textContent = data.cardTitle;
    if (cardText) cardText.textContent = data.cardText;

    if (stageImg) {
      stageImg.style.opacity = '0';
      stageImg.style.transform = 'scale(0.96)';
      setTimeout(() => {
        stageImg.src = data.img;
        stageImg.style.opacity = '1';
        stageImg.style.transform = 'scale(1)';
      }, 200);
    }
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      setPhase(btn.dataset.workbench);
    });
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const stepIdx = parseInt(dot.dataset.step, 10);
      const keys = Object.keys(workbenchPhases);
      if (keys[stepIdx]) {
        setPhase(keys[stepIdx]);
      }
    });
  });

  // Initial setup: first phase is active by default

  // Hero carousel dot toggling
  const heroDots = document.querySelectorAll('.carousel-dot');
  heroDots.forEach((d, idx) => {
    d.addEventListener('click', () => {
      heroDots.forEach(dot => dot.classList.remove('active'));
      d.classList.add('active');
    });
  });
}

