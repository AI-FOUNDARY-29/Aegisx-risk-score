import React from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ThreatFeed = ({ threatsBlockedToday, threats }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card"
    >
      <div className="card-header">
        <Shield className="accent-cyan" />
        Real-time Threat Interceptions
      </div>
      
      <div style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
        Blocked <strong style={{ color: 'var(--text-primary)' }}>{threatsBlockedToday}</strong> threats today.
      </div>

      <div className="feed-list">
        {threats.map((threat, idx) => (
          <motion.div 
            key={threat.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + (idx * 0.1) }}
            className={`feed-item ${threat.type}`}
          >
            <div className="feed-icon">
              {threat.type === 'danger' && <AlertTriangle color="var(--status-danger)" size={20} />}
              {threat.type === 'warning' && <AlertTriangle color="var(--status-warning)" size={20} />}
              {threat.type === 'safe' && <CheckCircle color="var(--status-safe)" size={20} />}
            </div>
            <div className="feed-content">
              <h4>{threat.title}</h4>
              <p>{threat.desc}</p>
            </div>
            <div className="feed-time">{threat.time}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ThreatFeed;
