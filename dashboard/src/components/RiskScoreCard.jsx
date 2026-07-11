
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const RiskScoreCard = ({ riskScore }) => {
  const getRiskColor = (score) => {
    if (score > 75) return 'var(--status-danger)';
    if (score > 40) return 'var(--status-warning)';
    return 'var(--status-safe)';
  };

  const data = [
    { name: 'Score', value: riskScore },
    { name: 'Remaining', value: 100 - riskScore }
  ];

  const color = getRiskColor(riskScore);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div className="card-header" style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>
        <Activity className="accent-blue" />
        Digital Twin Risk Score
      </div>
      
      <div style={{ width: '100%', height: 200, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              <Cell key="cell-0" fill={color} />
              <Cell key="cell-1" fill="rgba(255, 255, 255, 0.1)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Absolute positioned centered text */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '2rem',
          fontWeight: 700,
          color: color
        }}>
          {riskScore}
        </div>
      </div>
      
      <div className="risk-label" style={{ marginTop: '1rem', fontWeight: 600 }}>
        {riskScore > 75 ? 'Critical Risk' : riskScore > 40 ? 'Elevated Risk' : 'Secure'}
      </div>
    </motion.div>
  );
};

export default RiskScoreCard;
