import { useState } from 'react';
import { Search, Loader, AlertTriangle, ShieldCheck, Link2, FileText } from 'lucide-react';

const ManualScanner = () => {
  const [inputType, setInputType] = useState('url'); // 'url' or 'text'
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const endpoint = inputType === 'url' ? '/api/analyze/url' : '/api/analyze/text';
      const payload = inputType === 'url' ? { url: inputValue } : { text: inputValue };
      
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Failed to analyze input');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ marginBottom: '2rem' }}>
      <div className="card-header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={20} color="var(--accent-blue)" /> Manual Threat Scanner
        </div>
        
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', padding: '0.25rem' }}>
          <button 
            type="button"
            onClick={() => { setInputType('url'); setResult(null); }}
            style={{ padding: '0.25rem 0.75rem', border: 'none', background: inputType === 'url' ? 'var(--accent-blue)' : 'transparent', color: inputType === 'url' ? 'white' : 'var(--text-secondary)', borderRadius: '0.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}
          >
            <Link2 size={14} /> URL
          </button>
          <button 
            type="button"
            onClick={() => { setInputType('text'); setResult(null); }}
            style={{ padding: '0.25rem 0.75rem', border: 'none', background: inputType === 'text' ? 'var(--accent-blue)' : 'transparent', color: inputType === 'text' ? 'white' : 'var(--text-secondary)', borderRadius: '0.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}
          >
            <FileText size={14} /> Text
          </button>
        </div>
      </div>

      <form onSubmit={handleScan} style={{ display: 'flex', gap: '1rem' }}>
        {inputType === 'url' ? (
          <input 
            type="url" 
            placeholder="Paste a suspicious URL here (e.g. https://secure-login-update.com)" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{ flex: 1, padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'var(--text-primary)', outline: 'none' }}
            required
          />
        ) : (
          <textarea 
            placeholder="Paste suspicious email text or SMS message here..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{ flex: 1, padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'var(--text-primary)', outline: 'none', minHeight: '50px', resize: 'vertical' }}
            required
          />
        )}
        <button 
          type="submit" 
          disabled={loading}
          style={{ background: 'var(--accent-blue)', color: 'white', border: 'none', padding: '0 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {loading ? <Loader className="spinner" size={18} /> : 'Scan'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '1rem', color: 'var(--status-danger)', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          background: result.is_threat ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          border: `1px solid ${result.is_threat ? 'var(--status-danger)' : 'var(--status-safe)'}`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem'
        }}>
          {result.is_threat ? (
            <AlertTriangle size={24} color="var(--status-danger)" style={{ flexShrink: 0 }} />
          ) : (
            <ShieldCheck size={24} color="var(--status-safe)" style={{ flexShrink: 0 }} />
          )}
          <div>
            <h4 style={{ color: result.is_threat ? 'var(--status-danger)' : 'var(--status-safe)', marginBottom: '0.25rem' }}>
              {result.is_threat ? 'Threat Detected!' : 'Safe Content'}
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{result.message}</p>
            
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
              <div><span style={{ color: 'var(--text-secondary)' }}>Risk Score:</span> <strong>{result.risk_score}/100</strong></div>
              <div><span style={{ color: 'var(--text-secondary)' }}>Type:</span> <span style={{ textTransform: 'capitalize' }}>{result.threat_type}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualScanner;
