import { useState, useEffect } from 'react';
import { Shield, Bell, Save, Loader, AlertCircle, CheckCircle } from 'lucide-react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    strict_mode: false,
    auto_block: true,
    alert_threshold: 70
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://aegisx-risk-score-backend.onrender.com/api/settings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch settings');
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://aegisx-risk-score-backend.onrender.com/api/settings', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      
      if (!res.ok) throw new Error('Failed to save settings');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
        <Loader size={16} className="spinner" /> Loading configurations...
      </div>
    );
  }

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>System Configuration</h2>
        <button 
          onClick={handleSave} 
          disabled={saving}
          style={{ background: 'var(--accent-blue)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: saving ? 'not-allowed' : 'pointer' }}
        >
          {saving ? <Loader size={16} className="spinner" /> : <Save size={16} />}
          Save Changes
        </button>
      </header>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--status-danger)', padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--status-danger)', marginTop: '1rem' }}>
          <AlertCircle size={24} /> <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--status-safe)', padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--status-safe)', marginTop: '1rem' }}>
          <CheckCircle size={24} /> <p>Settings saved successfully!</p>
        </div>
      )}
      
      <div className="dashboard-grid" style={{ marginTop: '1rem', gridTemplateColumns: '1fr' }}>
        
        <div className="glass-card">
          <div className="card-header" style={{ marginBottom: '1.5rem' }}>
            <Shield size={24} color="var(--accent-purple)" /> Security Policies
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Strict Mode</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>When enabled, borderline threats are immediately classified as dangerous.</p>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={settings.strict_mode} 
                onChange={(e) => setSettings({...settings, strict_mode: e.target.checked})}
                style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--accent-purple)' }}
              />
            </label>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Auto-Block Active Intrusions</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Automatically sever connections when a critical threat is detected.</p>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={settings.auto_block} 
                onChange={(e) => setSettings({...settings, auto_block: e.target.checked})}
                style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--accent-purple)' }}
              />
            </label>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-header" style={{ marginBottom: '1.5rem' }}>
            <Bell size={24} color="var(--accent-cyan)" /> Notification Thresholds
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '1.1rem' }}>Alert Sensitivity Score</h4>
              <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{settings.alert_threshold} / 100</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>Alerts will only be triggered for threats with a risk score above this threshold.</p>
            <input 
              type="range" 
              min="0" max="100" 
              value={settings.alert_threshold}
              onChange={(e) => setSettings({...settings, alert_threshold: parseInt(e.target.value)})}
              style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
            />
          </div>
        </div>

      </div>
    </>
  );
};

export default SettingsPage;
