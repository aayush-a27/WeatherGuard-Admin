import { HiOutlineBars3, HiOutlineMoon, HiOutlineSun, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { getInitials } from '../../utils/helpers';

/**
 * Top navigation bar with hamburger menu, dark mode toggle, and user profile.
 */
export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 glass border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left: hamburger (mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          <HiOutlineBars3 className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Center spacer */}
        <div className="flex-1" />

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-surface-800 transition-all duration-200 group"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <HiOutlineSun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
            ) : (
              <HiOutlineMoon className="w-5 h-5 text-gray-600 group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* User profile */}
          <div className="flex items-center gap-3 pl-2 ml-2 border-l border-gray-200 dark:border-gray-700">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full ring-2 ring-brand-500/20"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold">
                {getInitials(user?.name)}
              </div>
            )}
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role === 'admin' ? 'Administrator' : 'User'}
              </p>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-200"
              aria-label="Logout"
              title="Logout"
            >
              <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
