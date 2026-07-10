import { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import RiskScoreCard from './components/RiskScoreCard';
import DarkWebAlerts from './components/DarkWebAlerts';
import ThreatFeed from './components/ThreatFeed';

function App() {
  const [stats, setStats] = useState({
    digital_twin_risk_score: 25,
    threats_blocked_today: 12,
    dark_web_leaks_found: 1,
    active_protections: 4
  });

  const [threats, setThreats] = useState([
    { id: 1, type: 'danger', title: 'Deepfake Video Blocked', desc: 'Attempted voice clone scam on WhatsApp web.', time: '2m ago' },
    { id: 2, type: 'warning', title: 'Suspicious Login', desc: 'Unrecognized device in Lisbon, PT.', time: '14m ago' },
    { id: 3, type: 'safe', title: 'Phishing Email Neutralized', desc: 'Fake PayPal invoice moved to spam.', time: '1h ago' }
  ]);

  // Try to fetch real stats from backend, fallback to mock if backend is down
  useEffect(() => {
    fetch('http://localhost:8000/api/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.log('Using mock data (backend offline)', err));
  }, []);

  const getRiskColor = (score) => {
    if (score > 75) return 'var(--status-danger)';
    if (score > 40) return 'var(--status-warning)';
    return 'var(--status-safe)';
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo">
          <ShieldAlert size={32} />
          AegisX
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Status: Active Monitoring</span>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--status-safe)', boxShadow: '0 0 10px var(--status-safe)' }}></div>
        </div>
      </header>

      <main className="dashboard-grid">
        {/* Left Column: Risk Score */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <RiskScoreCard riskScore={stats.digital_twin_risk_score} />
          <DarkWebAlerts 
            leaksFound={stats.dark_web_leaks_found} 
            activeProtections={stats.active_protections} 
          />
        </div>

        {/* Right Column: Threat Feed */}
        <ThreatFeed 
          threatsBlockedToday={stats.threats_blocked_today} 
          threats={threats} 
        />
      </main>
    </div>
  );
}

export default App;
