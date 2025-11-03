(async function(){
  const appUrlEl = document.getElementById('appUrl');
  const apiKeyEl = document.getElementById('apiKey');
  const msg = document.getElementById('msg');

  chrome.storage.sync.get(['appUrl','apiKey'], (res) => {
    appUrlEl.value = res.appUrl || '';
    apiKeyEl.value = res.apiKey || '';
  });

  document.getElementById('save').addEventListener('click', () => {
    chrome.storage.sync.set({ appUrl: appUrlEl.value, apiKey: apiKeyEl.value }, () => {
      msg.textContent = 'Saved!';
      setTimeout(()=> msg.textContent='', 1500);
    });
  });
})();
