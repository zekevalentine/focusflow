(() => {
  function guess(selectorList) {
    for (const sel of selectorList) {
      const el = document.querySelector(sel);
      if (el && el.textContent) return el.textContent.trim();
    }
    return '';
  }

  const title = guess(['h1', 'h1 a', '[data-test="job-title"]', '.topcard__title', 'article h1']);
  const company = guess(['[data-test="employer-name"]', '.topcard__org-name-link', '.topcard__flavor', 'a[href*="company"]', 'header a']);

  window.__focusflow_job = { title, company, url: location.href };
})();
