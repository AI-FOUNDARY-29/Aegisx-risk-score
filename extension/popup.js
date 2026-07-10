document.addEventListener('DOMContentLoaded', () => {
  const statusIcon = document.getElementById('statusIcon');
  const statusText = document.getElementById('statusText');
  const statusDetails = document.getElementById('statusDetails');

  // Query the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab && currentTab.url) {
      
      // Send URL to background script for analysis
      chrome.runtime.sendMessage({ type: 'ANALYZE_URL', payload: currentTab.url }, (response) => {
        if (chrome.runtime.lastError || !response) {
          statusText.textContent = 'Scan Unavailable';
          statusIcon.textContent = '⚠️';
          statusText.className = 'status-text warning';
          statusDetails.textContent = 'Could not reach AegisX backend.';
          return;
        }

        if (response.is_threat) {
          statusIcon.textContent = '🚨';
          statusText.textContent = 'Threat Detected';
          statusText.className = 'status-text danger';
          statusDetails.textContent = response.message;
        } else {
          statusIcon.textContent = '✅';
          statusText.textContent = 'Page is Secure';
          statusText.className = 'status-text safe';
          statusDetails.textContent = 'No malicious patterns found.';
        }
      });
    }
  });
});
