import { useAuth } from '../hooks/useAuth';
import UserCard from '../components/dashboard/UserCard';
import AccessStatusCard from '../components/dashboard/AccessStatusCard';
import TelegramStatusCard from '../components/dashboard/TelegramStatusCard';
import CityCard from '../components/dashboard/CityCard';

/**
 * User dashboard page showing profile, access status, and Telegram connection.
 */
export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}! Here&apos;s your account overview.
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card — full width */}
        <div className="lg:col-span-3">
          <UserCard user={user} />
        </div>

        {/* Access Status */}
        <AccessStatusCard status={user?.accessStatus} />

        {/* Telegram Connection */}
        <TelegramStatusCard user={user} />

        {/* Weather City */}
        <CityCard user={user} />
      </div>
    </div>
  );
}
