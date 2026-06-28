import { Link } from 'react-router-dom';
import { HiOutlineMapPin } from 'react-icons/hi2';
import Button from '../components/ui/Button';

/**
 * 404 Not Found page.
 */
export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 p-4">
      <div className="text-center animate-slide-up max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-100 dark:bg-brand-900/30 mb-6">
          <HiOutlineMapPin className="w-10 h-10 text-brand-600 dark:text-brand-400" />
        </div>

        <h1 className="text-6xl font-extrabold gradient-text mb-3">404</h1>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          <br />
          Let's get you back on track.
        </p>

        <Link to="/dashboard">
          <Button variant="primary" size="lg">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
