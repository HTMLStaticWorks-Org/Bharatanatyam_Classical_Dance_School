/**
 * NRITYANJALI — STUDENT DASHBOARD PORTAL
 * Dashboard JavaScript (assets/js/dashboard.js)
 * Supports Single-File Tabbed Router, Batch Enrollment & Arangetram Preparation Tracker
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardRouter();
  initDashboardMobileSidebar();
  initNotificationDropdown();
  initBookingWizard();
  initProfileEditor();
  initLogout();
  initDashboardThemeAndRTL();
  initArangetramTracker();
});

/* ==========================================================================
   1. DASHBOARD SINGLE-PAGE TAB ROUTER
   ========================================================================== */
function initDashboardRouter() {
  const menuLinks = document.querySelectorAll('.js-dash-tab');
  const views = document.querySelectorAll('.tab-view');
  const topbarTitle = document.getElementById('dash-topbar-title');

  const titles = {
    'overview': 'Student Overview',
    'batches': 'Batch Enrollment & Programs',
    'schedules': 'Class & Rehearsal Schedules',
    'arangetram': 'Arangetram Preparation Tracker',
    'bookings': 'My Enrolled Batches',
    'book-wizard': 'Enroll in a Batch',
    'seasonal': 'Special Masterclasses',
    'rewards': 'Sadhana & Guru Recognitions',
    'payments': 'Tuition & Payment History',
    'profile': 'Student Profile',
    'support': 'Guru Feedback & Mentorship'
  };

  const switchTab = (targetId) => {
    const targetView = document.getElementById(`tab-${targetId}`);
    if (!targetView) return;

    views.forEach(v => v.classList.remove('active'));
    menuLinks.forEach(l => l.classList.remove('active'));

    targetView.classList.add('active');

    const activeLink = document.querySelector(`.js-dash-tab[data-tab="${targetId}"]`);
    if (activeLink) activeLink.classList.add('active');

    if (topbarTitle && titles[targetId]) {
      topbarTitle.textContent = titles[targetId];
    }

    // Close mobile sidebar if open
    const sidebar = document.querySelector('.dashboard-sidebar');
    const backdrop = document.getElementById('dash-sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.classList.remove('sidebar-locked');

    // Immediate & post-layout scroll reset to top of dashboard view
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  };

  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.dataset.tab;
      switchTab(tabId);
    });
  });

  // Handle trigger buttons (e.g. "View Schedule" or "Enroll Now" from cards)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-switch-tab]');
    if (trigger) {
      e.preventDefault();
      switchTab(trigger.dataset.switchTab);
    }
  });

  // Handle initial URL hash on page load (e.g. dashboard.html#batches or #schedules)
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && document.getElementById(`tab-${initialHash}`)) {
    switchTab(initialHash);
  }
}

/* ==========================================================================
   2. MOBILE SIDEBAR DRAWER
   ========================================================================== */
function initDashboardMobileSidebar() {
  const hamburger = document.getElementById('dash-hamburger');
  const sidebar = document.querySelector('.dashboard-sidebar');
  const closeBtn = document.getElementById('dash-sidebar-close');
  const backdrop = document.getElementById('dash-sidebar-backdrop');

  const openSidebar = () => {
    if (sidebar) sidebar.classList.add('mobile-open');
    if (backdrop) backdrop.classList.add('active');
    document.body.classList.add('sidebar-locked');
  };

  const closeSidebar = () => {
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.classList.remove('sidebar-locked');
  };

  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSidebar();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeSidebar);
  }
}

/* ==========================================================================
   3. NOTIFICATION DROPDOWN MANAGER
   ========================================================================== */
function initNotificationDropdown() {
  const btn = document.getElementById('notif-toggle-btn');
  const dropdown = document.getElementById('notif-dropdown');
  const markAllBtn = document.getElementById('mark-all-read');
  const unreadItems = document.querySelectorAll('.notif-item.unread');
  const countBadge = document.querySelector('.notif-badge-count');

  if (btn && dropdown) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
  }

  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      unreadItems.forEach(item => item.classList.remove('unread'));
      if (countBadge) countBadge.style.display = 'none';
      showDashToast('All notifications marked as read.');
    });
  }
}

/* ==========================================================================
   4. INTERACTIVE 5-STEP ENROLLMENT WIZARD
   ========================================================================== */
const bookingState = {
  batch: 'Madhyama — Varnam & Jatiswaram Intensive',
  fee: '$180 / Month',
  day: 'Mon & Wed',
  time: '5:30 PM – 7:00 PM',
  level: 'Intermediate (3+ Yrs Exp)'
};

function initBookingWizard() {
  const wizard = document.getElementById('booking-wizard-container');
  if (!wizard) return;

  const stepCards = wizard.querySelectorAll('.wizard-step-card');
  const stepPills = wizard.querySelectorAll('.wizard-step-pill');
  const progressFill = document.getElementById('wizard-progress-fill');

  let currentStep = 1;

  const goToStep = (step) => {
    currentStep = step;
    stepCards.forEach((c, idx) => {
      c.style.display = (idx + 1 === step) ? 'block' : 'none';
    });
    stepPills.forEach((p, idx) => {
      if (idx + 1 === step) {
        p.classList.add('active');
      } else if (idx + 1 < step) {
        p.classList.add('completed');
        p.classList.remove('active');
      } else {
        p.classList.remove('active', 'completed');
      }
    });

    if (progressFill) {
      const pct = ((step - 1) / (stepCards.length - 1)) * 100;
      progressFill.style.width = `${pct}%`;
    }
  };

  // Next and Back buttons
  wizard.querySelectorAll('[data-wizard-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < stepCards.length) {
        goToStep(currentStep + 1);
      }
    });
  });

  wizard.querySelectorAll('[data-wizard-prev]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });
  });

  // Direct step pill navigation
  stepPills.forEach((pill, idx) => {
    pill.style.cursor = 'pointer';
    pill.addEventListener('click', () => {
      goToStep(idx + 1);
    });
  });

  // Step item selection cards
  wizard.querySelectorAll('.wizard-select-item').forEach(item => {
    item.addEventListener('click', () => {
      const parent = item.closest('.wizard-select-group');
      if (parent) {
        parent.querySelectorAll('.wizard-select-item').forEach(i => i.classList.remove('selected'));
      }
      item.classList.add('selected');

      const batchVal = item.dataset.batch;
      const feeVal = item.dataset.fee;
      if (batchVal) bookingState.batch = batchVal;
      if (feeVal) bookingState.fee = feeVal;

      // Update summary fields
      const sumBatch = document.getElementById('sum-batch');
      const sumFee = document.getElementById('sum-fee');
      if (sumBatch) sumBatch.textContent = bookingState.batch;
      if (sumFee) sumFee.textContent = bookingState.fee;
    });
  });

  // Final Confirmation Submit
  const confirmBtn = document.getElementById('wizard-confirm-btn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      showDashToast(`Successfully enrolled in ${bookingState.batch}!`);
      setTimeout(() => {
        const routerOverview = document.querySelector('.js-dash-tab[data-tab="overview"]');
        if (routerOverview) routerOverview.click();
      }, 900);
    });
  }
}

/* ==========================================================================
   5. ARANGETRAM PREPARATION TRACKER
   ========================================================================== */
function initArangetramTracker() {
  const checkboxes = document.querySelectorAll('.js-arangetram-check');
  const progressText = document.getElementById('arangetram-progress-pct');
  const progressBar = document.getElementById('arangetram-progress-bar');

  if (!checkboxes.length) return;

  const updateProgress = () => {
    const total = checkboxes.length;
    let checked = 0;
    checkboxes.forEach(cb => {
      if (cb.checked) checked++;
    });

    const pct = Math.round((checked / total) * 100);
    if (progressText) progressText.textContent = `${pct}%`;
    if (progressBar) progressBar.style.width = `${pct}%`;
  };

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      updateProgress();
      const parentRow = cb.closest('.repertoire-row');
      if (parentRow) {
        if (cb.checked) {
          parentRow.classList.add('row-completed');
          showDashToast('Repertoire milestone marked as Guru Approved!');
        } else {
          parentRow.classList.remove('row-completed');
          showDashToast('Milestone status updated to In Progress.');
        }
      }
    });
  });
}

/* ==========================================================================
   6. PROFILE FORM EDITOR
   ========================================================================== */
function initProfileEditor() {
  const profileForm = document.getElementById('profile-form');
  if (!profileForm) return;

  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('prof-name').value;
    const guestNameEl = document.querySelector('.guest-name');
    if (guestNameEl) guestNameEl.textContent = name;

    showDashToast('Student profile updated successfully!');
  });
}

/* ==========================================================================
   7. LOGOUT
   ========================================================================== */
function initLogout() {
  const logoutBtns = document.querySelectorAll('.js-logout-btn');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showDashToast('Signing out from Student Portal...');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 600);
    });
  });
}

/* ==========================================================================
   8. DASHBOARD THEME & RTL PERSISTENCE
   ========================================================================== */
function initDashboardThemeAndRTL() {
  // Theme Setup & Toggle Listener
  const savedTheme = localStorage.getItem('bloom-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const themeBtns = document.querySelectorAll('.js-theme-toggle');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('bloom-theme', newTheme);
      showDashToast(`Switched to ${newTheme.toUpperCase()} mode`);
    });
  });

  // RTL Setup & Toggle Listener
  const savedRTL = localStorage.getItem('bloom-rtl') || 'ltr';
  document.documentElement.setAttribute('dir', savedRTL);

  const rtlBtns = document.querySelectorAll('.js-rtl-toggle');
  rtlBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('bloom-rtl', newDir);
      showDashToast(`Language direction set to ${newDir.toUpperCase()}`);
    });
  });
}

function showDashToast(msg) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="color: var(--terracotta-bloom);">ॐ</span> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}
