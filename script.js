// Le Phuoc Hung — Portfolio Script (Taste-skill clean & isolated)

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });

    mobileNav.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
      });
    });
  }
});

// Copy Email Utility
function copyEmail(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = btnElement.innerText;
    btnElement.innerText = 'Copied!';
    btnElement.style.color = '#34d399';

    setTimeout(() => {
      btnElement.innerText = originalText;
      btnElement.style.color = '';
    }, 2000);
  }).catch(err => {
    console.error('Copy failed:', err);
  });
}
