import { useState } from 'react';
import { ShieldAlert, Lock, User, LogIn, Loader } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isRegistering) {
        const res = await fetch('http://localhost:8000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || 'Registration failed');
        }
        
        setSuccessMsg("Registration successful! You can now log in.");
        setIsRegistering(false);
      } else {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        
        const res = await fetch('http://localhost:8000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || 'Login failed');
        }
        
        const data = await res.json();
        onLogin(data.access_token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100vw' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        
        <div className="logo" style={{ justifyContent: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
          <ShieldAlert size={40} />
          AegisX
        </div>
        
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          {isRegistering ? 'Create Account' : 'System Login'}
        </h2>
        
        {error && <div style={{ color: 'var(--status-danger)', textAlign: 'center', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem' }}>{error}</div>}
        {successMsg && <div style={{ color: 'var(--status-safe)', textAlign: 'center', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem' }}>{successMsg}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <User size={20} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <Lock size={20} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>
          
          <button type="submit" disabled={loading} style={{ background: 'var(--accent-blue)', color: 'white', border: 'none', padding: '1rem', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            {loading ? <Loader className="spinner" size={20} /> : <LogIn size={20} />}
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
          <span 
            onClick={() => { setIsRegistering(!isRegistering); setError(null); setSuccessMsg(null); }}
            style={{ color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 600 }}
          >
            {isRegistering ? 'Login here' : 'Register here'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
