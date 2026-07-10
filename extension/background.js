// AegisX Background Service Worker

const API_BASE = 'http://localhost:8000/api';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ANALYZE_URL') {
    fetch(`${API_BASE}/analyze/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: message.payload })
    })
    .then(res => res.json())
    .then(data => sendResponse(data))
    .catch(err => {
      console.error('AegisX Backend Error:', err);
      sendResponse(null);
    });
    return true; // Keep message channel open for async response
  }
  
  if (message.type === 'ANALYZE_TEXT') {
    fetch(`${API_BASE}/analyze/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message.payload })
    })
    .then(res => res.json())
    .then(data => sendResponse(data))
    .catch(err => {
      console.error('AegisX Backend Error:', err);
      sendResponse(null);
    });
    return true; // Keep message channel open
  }
});
