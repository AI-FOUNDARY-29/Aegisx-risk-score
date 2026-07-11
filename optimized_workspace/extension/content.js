function scanPageContent() {
  const pageText = document.body.innerText;
  chrome.runtime.sendMessage({
    type: 'ANALYZE_TEXT',
    payload: pageText.substring(0, 5000)
  }, (response) => {
    if (response && response.is_threat) {
      console.warn('AegisX detected a potential threat on this page:', response.message);
      injectWarningBanner(response.message);
    }
  });
}
function injectWarningBanner(message) {
  const banner = document.createElement('div');
  banner.style.position = 'fixed';
  banner.style.top = '0';
  banner.style.left = '0';
  banner.style.width = '100%';
  banner.style.backgroundColor = '#ef4444';
  banner.style.color = '#ffffff';
  banner.style.padding = '12px';
  banner.style.textAlign = 'center';
  banner.style.zIndex = '999999';
  banner.style.fontFamily = 'sans-serif';
  banner.style.fontWeight = 'bold';
  banner.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
  banner.innerText = `🚨 AegisX Guardian Warning: ${message}`;
  const closeBtn = document.createElement('button');
  closeBtn.innerText = 'Dismiss';
  closeBtn.style.marginLeft = '16px';
  closeBtn.style.padding = '4px 8px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.onclick = () => banner.remove();
  banner.appendChild(closeBtn);
  document.body.appendChild(banner);
}
window.addEventListener('load', scanPageContent);