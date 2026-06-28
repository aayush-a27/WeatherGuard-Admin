import { Navigate } from 'react-router-dom';
import { HiOutlineBolt } from 'react-icons/hi2';
import LoginButtons from '../components/auth/LoginButtons';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/ui/Loader';

/**
 * Login page with OAuth buttons and branding.
 * Redirects to dashboard if already authenticated.
 */
export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader text="Loading..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="w-full animate-slide-up">
      {/* Card */}
      <div className="bg-white/90 dark:bg-surface-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 md:p-10">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-brand shadow-lg shadow-brand-500/30 mb-5">
            <HiOutlineBolt className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to{' '}
            <span className="gradient-text">WeatherGuard</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Sign in to manage weather alerts and monitor your dashboard
          </p>
        </div>

        {/* OAuth Buttons */}
        <LoginButtons />

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            <br />
            Your account will require admin approval before full access.
          </p>
        </div>
      </div>

      {/* Below card */}
      <p className="text-center text-xs text-white/60 mt-6">
        WeatherGuard Admin Panel v1.0.0
      </p>
    </div>
  );
}
