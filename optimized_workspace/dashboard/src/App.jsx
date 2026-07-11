import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ThreatHistoryPage from './pages/ThreatHistoryPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
function App() {
  const [theme, setTheme] = useState('dark');
  const [token, setToken] = useState(localStorage.getItem('token'));
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };
  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };
  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/history" element={<ThreatHistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
export default App;