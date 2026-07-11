import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';
const RiskScoreCard = ({ riskScore }) => {
  const getRiskColor = (score) => {
    if (score > 75) return 'var(--status-danger)';
    if (score > 40) return 'var(--status-warning)';
    return 'var(--status-safe)';
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <div className="card-header">
        <Activity className="accent-blue" />
        Digital Twin Risk Score
      </div>
      <div className="risk-score-container">
        <div
          className="risk-circle"
          style={{ color: getRiskColor(riskScore) }}
        >
          {riskScore}
        </div>
        <div className="risk-label">
          {riskScore > 75 ? 'Critical Risk' : riskScore > 40 ? 'Elevated Risk' : 'Secure'}
        </div>
      </div>
    </motion.div>
  );
};
export default RiskScoreCard;