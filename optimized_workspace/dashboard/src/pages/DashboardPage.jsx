import { useState, useEffect } from 'react';
import RiskScoreCard from '../components/RiskScoreCard';
import DarkWebAlerts from '../components/DarkWebAlerts';
import ThreatFeed from '../components/ThreatFeed';
import ManualScanner from '../components/ManualScanner';
import { AlertCircle, Loader } from 'lucide-react';
const DashboardPage = () => {
  const [stats, setStats] = useState({
    digital_twin_risk_score: 0,
    threats_blocked_today: 0,
    dark_web_leaks_found: 0,
    active_protections: 0
  });
  const [threats, setThreats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        const statsRes = await fetch('http://localhost:8000/api/dashboard/stats', { headers });
        if (!statsRes.ok) throw new Error('Failed to fetch stats');
        const statsData = await statsRes.json();
        setStats(statsData);
        const historyRes = await fetch('http://localhost:8000/api/history', { headers });
        if (!historyRes.ok) throw new Error('Failed to fetch history');
        const historyData = await historyRes.json();
        if (historyData) setThreats(historyData);
        setError(null);
      } catch (err) {
        console.error('Backend connection error:', err);
        setError('Unable to connect to the AegisX backend. Ensure FastAPI is running on port 8000.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard Overview</h2>
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Loader size={16} className="spinner" />
            <span style={{ fontSize: '0.875rem' }}>Syncing with backend...</span>
          </div>
        )}
      </header>
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--status-danger)',
          padding: '1rem',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          color: 'var(--status-danger)',
          marginTop: '1rem',
          marginBottom: '1rem'
        }}>
          <AlertCircle size={24} />
          <p>{error}</p>
        </div>
      )}
      <div style={{ marginTop: '1.5rem' }}>
        <ManualScanner />
      </div>
      <div className="dashboard-grid">
        {}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <RiskScoreCard riskScore={stats.digital_twin_risk_score} />
          <DarkWebAlerts
            leaksFound={stats.dark_web_leaks_found}
            activeProtections={stats.active_protections}
          />
        </div>
        {}
        <ThreatFeed
          threatsBlockedToday={stats.threats_blocked_today}
          threats={threats}
        />
      </div>
    </>
  );
};
export default DashboardPage;