import { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, ShieldCheck, History, Loader, AlertCircle } from 'lucide-react';
const ThreatHistoryPage = () => {
  const [threats, setThreats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8000/api/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch history');
        const data = await res.json();
        if (data && data.length > 0) {
          setThreats(data);
        }
        setError(null);
      } catch (err) {
        console.error('Backend connection error:', err);
        setError('Unable to connect to the backend database. Ensure FastAPI is running.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const getIcon = (type) => {
    switch(type) {
      case 'danger': return <ShieldAlert size={24} color="var(--status-danger)" />;
      case 'warning': return <AlertTriangle size={24} color="var(--status-warning)" />;
      case 'safe': return <CheckCircle size={24} color="var(--status-safe)" />;
      default: return <ShieldCheck size={24} color="var(--text-secondary)" />;
    }
  };
  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Detailed Threat History</h2>
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Loader size={16} className="spinner" />
            <span style={{ fontSize: '0.875rem' }}>Loading logs...</span>
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
          marginTop: '1rem'
        }}>
          <AlertCircle size={24} />
          <p>{error}</p>
        </div>
      )}
      <div className="glass-card" style={{ marginTop: '1rem' }}>
        <div className="card-header">
          <History size={24} /> Logged Events
        </div>
        {!isLoading && !error && threats.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No history logs found in the database.</p>
        ) : (
          <div className="feed-list">
            {threats.map(threat => (
              <div key={threat.id} className={`feed-item ${threat.type}`}>
                <div className="feed-icon">
                  {getIcon(threat.type)}
                </div>
                <div className="feed-content">
                  <h4>{threat.title}</h4>
                  <p>{threat.desc}</p>
                </div>
                <div className="feed-time">{threat.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
export default ThreatHistoryPage;