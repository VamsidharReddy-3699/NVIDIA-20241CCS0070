document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 1. Sticky Navigation Header Scroll Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
    } else {
      navbar.classList.remove('scrolled');
      navbar.style.boxShadow = 'none';
    }
  });

  // 2. Mobile Drawer Navigation Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    document.body.style.overflow = ''; // Restore scrolling
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openDrawer);
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // 3. Smooth Scrolling for Navigation Anchor Links
  const allScrollLinks = document.querySelectorAll('a[href^="#"]');
  allScrollLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip back to top or empty links
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetSection = document.querySelector(href);
      if (targetSection) {
        e.preventDefault();
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 4. Voter ID Search Simulator
  const voterIdInput = document.getElementById('voterIdInput');
  const voterSearchBtn = document.getElementById('voterSearchBtn');
  const voterResultsPane = document.getElementById('voterResultsPane');

  // Mock voter registration database
  const mockVoters = {
    'AP-TDP-2026-99': {
      name: 'K. Rama Krishna Reddy',
      constituency: 'Mangalagiri',
      booth: 'Booth #142 - ZPHS School, Mangalagiri',
      status: 'Active Cadre Member',
      joined: '12-May-2018',
      roleClass: 'registered'
    },
    'AP-CBN-1950-01': {
      name: 'N. Chandrababu Naidu',
      constituency: 'Kuppam',
      booth: 'Booth #01 - Govt Degree College, Kuppam',
      status: 'Executive Officer',
      joined: '08-May-1982',
      roleClass: 'registered'
    },
    'AP-MURALI-1983-02': {
      name: 'Murali Krishna Reddy',
      constituency: 'Mangalagiri',
      booth: 'Booth #45 - Public Library, Mangalagiri',
      status: 'Youth Wing Leader',
      joined: '15-Dec-2009',
      roleClass: 'registered'
    },
    'AP-NEW-2026-05': {
      name: 'B. Sravani Rao',
      constituency: 'Tirupati',
      booth: 'Booth #19 - Municipal Building, Tirupati',
      status: 'Pending Verification',
      joined: '04-July-2026',
      roleClass: 'pending'
    }
  };

  function executeVoterQuery() {
    const rawVal = voterIdInput.value.trim();
    const queryVal = rawVal.toUpperCase();

    if (!queryVal) {
      voterResultsPane.innerHTML = `
        <div class="empty-state">
          <i data-lucide="alert-circle" class="empty-icon" style="color: var(--accent-red);"></i>
          <p>Please enter a Voter Card ID key to execute query.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    // Set loading spinner state
    voterResultsPane.innerHTML = `
      <div class="loader-element">
        <div class="spinner"></div>
        <p style="font-family: monospace; font-size: 0.85rem; color: var(--accent-yellow);">SEARCHING CIVIC REGISTRY PORTAL...</p>
      </div>
    `;

    setTimeout(() => {
      const record = mockVoters[queryVal];
      if (record) {
        voterResultsPane.innerHTML = `
          <div class="result-success animate-fade">
            <div class="result-row">
              <span class="result-label">Voter Name</span>
              <span class="result-val">${record.name}</span>
            </div>
            <div class="result-row">
              <span class="result-label">Constituency</span>
              <span class="result-val">${record.constituency}</span>
            </div>
            <div class="result-row">
              <span class="result-label">Polling Station</span>
              <span class="result-val" style="font-size: 0.85rem;">${record.booth}</span>
            </div>
            <div class="result-row">
              <span class="result-label">System Status</span>
              <span class="status-badge ${record.roleClass}">${record.status}</span>
            </div>
          </div>
        `;
      } else {
        voterResultsPane.innerHTML = `
          <div class="result-success animate-fade" style="text-align: center;">
            <i data-lucide="database-zap" class="empty-icon" style="color: var(--text-muted); margin-bottom: 0.5rem;"></i>
            <h4 style="margin-bottom: 0.25rem;">Record Not Found</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 240px; margin: 0 auto 0.75rem;">
              No matching records for "${rawVal}" in our sandbox database.
            </p>
            <span style="font-size: 0.75rem; color: var(--accent-yellow); font-family: monospace;">Try: AP-TDP-2026-99</span>
          </div>
        `;
      }
      lucide.createIcons();
    }, 900);
  }

  if (voterSearchBtn) {
    voterSearchBtn.addEventListener('click', executeVoterQuery);
  }

  if (voterIdInput) {
    voterIdInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        executeVoterQuery();
      }
    });
  }

  // 5. Party Membership digital card generator
  const cadreForm = document.getElementById('cadreForm');
  const generateCardBtn = document.getElementById('generateCardBtn');
  const generatedCardContainer = document.getElementById('generatedCardContainer');
  const cardNameDisplay = document.getElementById('cardNameDisplay');
  const cardConstDisplay = document.getElementById('cardConstDisplay');
  const resetCardBtn = document.getElementById('resetCardBtn');

  if (cadreForm) {
    cadreForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const cadreName = document.getElementById('cadreName').value.trim();
      const cadreConstituency = document.getElementById('cadreConstituency').value;
      
      if (!cadreName || !cadreConstituency) return;

      // Show loader on the button
      const originalBtnText = generateCardBtn.innerHTML;
      generateCardBtn.disabled = true;
      generateCardBtn.innerHTML = `<span class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></span> Simulating CADRE sync...`;

      setTimeout(() => {
        // Hydrate Card Output
        cardNameDisplay.textContent = cadreName;
        cardConstDisplay.textContent = cadreConstituency;
        
        // Pick a random card ID
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const cardIdNum = document.querySelector('.card-id-num');
        if (cardIdNum) {
          cardIdNum.textContent = `ID: TDP-2026-${randomNum}`;
        }

        // Toggle Views
        cadreForm.classList.add('hidden');
        generatedCardContainer.classList.remove('hidden');
        
        // Reset button state
        generateCardBtn.disabled = false;
        generateCardBtn.innerHTML = originalBtnText;
      }, 1200);
    });
  }

  if (resetCardBtn) {
    resetCardBtn.addEventListener('click', () => {
      cadreForm.reset();
      generatedCardContainer.classList.add('hidden');
      cadreForm.classList.remove('hidden');
    });
  }

  // 6. Contact Form submission logic
  const contactForm = document.getElementById('contactForm');
  const contactSubmitBtn = document.getElementById('contactSubmitBtn');
  const contactFeedback = document.getElementById('contactFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameVal = document.getElementById('contactName').value.trim();
      const emailVal = document.getElementById('contactEmail').value.trim();
      const messageVal = document.getElementById('contactMessage').value.trim();

      if (!nameVal || !emailVal || !messageVal) return;

      // Disable submission
      const originalText = contactSubmitBtn.innerHTML;
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.innerHTML = `<span class="spinner" style="width: 16px; height: 16px; border-width: 2px; display: inline-block;"></span> Despatching message...`;
      contactFeedback.className = 'form-feedback hidden';

      setTimeout(() => {
        // Show success alert message
        contactFeedback.textContent = `Salutations, ${nameVal}! Your campaign tech request has been successfully dispatched. We will contact you at ${emailVal} within 24 hours.`;
        contactFeedback.className = 'form-feedback success';
        
        // Reset inputs
        contactForm.reset();
        
        // Restore button state
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.innerHTML = originalText;
      }, 1400);
    });
  }

  // 7. Scroll Reveal Triggering Logic (Viewport intersection)
  const revealItems = document.querySelectorAll('.project-card, .voter-tool-card, .membership-split, .about-grid, .contact-card');
  
  const revealOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, revealOptions);

  revealItems.forEach(item => {
    // Add initial hidden state for observer
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(item);
  });

  // Inject standard css helper for reveal animations
  const style = document.createElement('style');
  style.textContent = `
    .reveal {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    .animate-fade {
      animation: fadeIn 0.4s ease forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }
    .header.scrolled {
      padding: 0.75rem 2rem !important;
      background-color: rgba(255, 255, 237, 0.98) !important;
      border-bottom: 1px solid #134F2C !important;
    }
  `;
  document.head.appendChild(style);
});
