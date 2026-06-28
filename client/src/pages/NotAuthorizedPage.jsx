import { Link } from 'react-router-dom';
import { HiOutlineShieldExclamation } from 'react-icons/hi2';
import Button from '../components/ui/Button';

/**
 * 403 Not Authorized page.
 */
export default function NotAuthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 p-4">
      <div className="text-center animate-slide-up max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-rose-100 dark:bg-rose-900/30 mb-6">
          <HiOutlineShieldExclamation className="w-10 h-10 text-rose-600 dark:text-rose-400" />
        </div>

        <h1 className="text-6xl font-extrabold gradient-text mb-3">403</h1>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          You don't have permission to access this page.
          <br />
          Please contact an administrator if you believe this is a mistake.
        </p>

        <Link to="/dashboard">
          <Button variant="primary" size="lg">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
