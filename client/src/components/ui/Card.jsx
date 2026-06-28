/**
 * Reusable Card component with glassmorphism effect.
 */
export default function Card({ children, className = '', hover = true, ...props }) {
  return (
    <div
      className={`
        glass-card p-6
        ${hover ? 'hover:translate-y-[-2px]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
