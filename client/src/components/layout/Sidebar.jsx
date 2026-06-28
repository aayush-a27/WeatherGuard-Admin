import { NavLink } from 'react-router-dom';
import {
  HiOutlineSquares2X2,
  HiOutlineShieldCheck,
  HiOutlineXMark,
  HiOutlineBolt,
} from 'react-icons/hi2';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../constants';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: HiOutlineSquares2X2 },
];

const adminItems = [
  { label: 'Admin Panel', path: '/admin/dashboard', icon: HiOutlineShieldCheck },
];

/**
 * Sidebar navigation with responsive behavior.
 * Always visible on desktop (lg+), slides in from left on mobile.
 */
export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
      isActive
        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800 hover:text-gray-900 dark:hover:text-white'
    }`;

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-surface-900 border-r border-gray-200 dark:border-gray-800
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-md shadow-brand-500/30">
            <HiOutlineBolt className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
              WeatherGuard
            </h1>
            <p className="text-[10px] font-medium text-brand-500 uppercase tracking-wider">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Close button (mobile) */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors"
          aria-label="Close sidebar"
        >
          <HiOutlineXMark className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1.5">
        <p className="px-4 py-2 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Main
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={linkClass}
            onClick={onClose}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <p className="px-4 py-2 mt-4 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Administration
            </p>
            {adminItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={linkClass}
                onClick={onClose}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="px-4 py-2">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            WeatherGuard v1.0.0
          </p>
        </div>
      </div>
    </aside>
  );
}
