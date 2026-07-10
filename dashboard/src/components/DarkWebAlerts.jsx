import React from 'react';
import { Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const DarkWebAlerts = ({ leaksFound, activeProtections }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card"
    >
      <div className="card-header">
        <Eye className="accent-purple" />
        Dark Web Monitoring
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Leaks Found</span>
          <span style={{ fontWeight: 'bold', color: leaksFound > 0 ? 'var(--status-danger)' : 'var(--status-safe)' }}>
            {leaksFound}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Active Protections</span>
          <span style={{ fontWeight: 'bold', color: 'var(--status-safe)' }}>{activeProtections} / 4</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DarkWebAlerts;
