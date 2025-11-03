(async function() {
  const titleEl = document.getElementById('title');
  const companyEl = document.getElementById('company');
  const urlEl = document.getElementById('url');
  const msg = document.getElementById('msg');
  const saveBtn = document.getElementById('saveBtn');
  const openOptions = document.getElementById('openOptions');

  openOptions.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  // Prefill from content script
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const injected = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.__focusflow_job
  });
  const job = (injected && injected[0] && injected[0].result) || {};
  titleEl.value = job.title || '';
  companyEl.value = job.company || '';
  urlEl.value = job.url || (tab?.url || '');

  saveBtn.addEventListener('click', () => {
    chrome.storage.sync.get(['appUrl','apiKey'], async ({ appUrl, apiKey }) => {
      if (!appUrl || !apiKey) { msg.textContent = 'Set App URL & API key in Options.'; return; }
      try {
        const res = await fetch(appUrl.replace(/\/$/, '') + '/api/save-job-with-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
          body: JSON.stringify({
            company_name: companyEl.value,
            position_title: titleEl.value,
            job_url: urlEl.value
          }),
        });
        const data = await res.json();
        if (res.ok) { msg.textContent = 'Saved!'; setTimeout(()=> msg.textContent='', 1500); }
        else { msg.textContent = data.error || 'Error'; }
      } catch (e) {
        msg.textContent = 'Network error';
      }
    });
  });
})();
