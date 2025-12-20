// Lightweight analytics helper for NAVE
// Replace GA and Clarity IDs in index.html before going live.
(function () {
  // Reusable GA4 event sender. Safe if GA is absent.
  function trackEvent(name, params = {}) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', name, params);
      }
    } catch (err) {
      // Keep silent in production; this is a no-op fallback.
      console.debug('Analytics tracking skipped:', err);
    }
  }

  // Bind click tracking to any selector.
  function bindClick(selector, eventName) {
    const nodes = document.querySelectorAll(selector);
    nodes.forEach((node) => {
      node.addEventListener('click', () => {
        trackEvent(eventName, {
          label: (node.dataset.label || node.textContent || '').trim(),
          location: node.dataset.location || undefined
        });
      });
    });
  }

  // Track contact form submissions as conversions.
  function bindContactForm() {
    const form = document.querySelector('form.contact-form');
    if (!form) return;
    form.addEventListener('submit', () => {
      trackEvent('submit_contact_form', { category: 'conversion' });
      trackEvent('lead_submitted', { category: 'conversion' });
    });
  }

  function init() {
    bindClick('[data-analytics="contact-button"]', 'click_contact_button');
    bindClick('[data-analytics="click_email"]', 'click_email');
    bindClick('[data-analytics="click_phone"]', 'click_phone');
    bindContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for other scripts (e.g., modal open tracking).
  window.analytics = {
    trackEvent
  };
})();
