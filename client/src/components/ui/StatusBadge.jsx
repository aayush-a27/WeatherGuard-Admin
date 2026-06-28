import { STATUS_CONFIG } from '../../constants';

/**
 * Colored status badge for pending/approved/rejected states.
 */
export default function StatusBadge({ status, className = '' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
        ${config.bgClass} ${config.textClass}
        ${className}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass} animate-pulse-slow`} />
      {config.label}
    </span>
  );
}
