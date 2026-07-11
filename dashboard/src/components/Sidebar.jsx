
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, History, Settings, ShieldAlert, Sun, Moon } from 'lucide-react';

const Sidebar = ({ theme, toggleTheme, onLogout }) => {
  return (
    <div className="sidebar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo">
          <ShieldAlert size={32} />
          AegisX
        </div>
        <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      
      <div className="nav-links" style={{ marginTop: '2rem' }}>
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          end
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        
        <NavLink 
          to="/history" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          <History size={20} />
          Threat History
        </NavLink>
        
        <NavLink 
          to="/settings" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          <Settings size={20} />
          Settings
        </NavLink>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button 
          onClick={onLogout}
          style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: 'var(--status-danger)', 
            border: '1px solid rgba(239, 68, 68, 0.2)',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
        >
          Logout
        </button>

        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.75rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--status-safe)', boxShadow: '0 0 10px var(--status-safe)' }}></div>
            <span style={{ fontSize: '0.875rem', color: 'var(--status-safe)', fontWeight: 600 }}>Active Monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
