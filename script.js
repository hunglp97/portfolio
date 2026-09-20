// Le Phuoc Hung — Portfolio & Showcase Script

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Smooth scroll offset handling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Animated Numbers Counter on Scroll
  const counters = document.querySelectorAll('.stat-number, .stat-val');
  let animated = false;

  const animateCounters = () => {
    if (animated) return;
    counters.forEach(counter => {
      const text = counter.innerText;
      // Extract numeric value
      const match = text.match(/[\d,\.]+/);
      if (match) {
        const target = parseFloat(match[0].replace(/,/g, ''));
        if (target > 0) {
          let current = 0;
          const increment = target / 30;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              clearInterval(timer);
              counter.innerText = text; // Restore original formatted string
            }
          }, 30);
        }
      }
    });
    animated = true;
  };

  // Trigger counter animation on viewport entry
  const statsSection = document.querySelector('.stats-banner');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(statsSection);
  }
});

// Copy to Clipboard Utility
function copyToClipboard(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    const originalHtml = btnElement.innerHTML;
    btnElement.innerHTML = '<i class="fa-solid fa-check text-emerald-400"></i>';
    btnElement.title = 'Copied!';
    
    setTimeout(() => {
      btnElement.innerHTML = originalHtml;
      btnElement.title = 'Copy';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}
