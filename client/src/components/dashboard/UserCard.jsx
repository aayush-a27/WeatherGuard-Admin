import { HiOutlineEnvelope, HiOutlineShieldCheck, HiOutlineBolt } from 'react-icons/hi2';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';
import { getInitials, formatDate } from '../../utils/helpers';
import { capitalize } from '../../utils/helpers';

/**
 * Displays the current user's profile information.
 */
export default function UserCard({ user }) {
  if (!user) return null;

  const providerIcon =
    user.provider === 'google' ? (
      <FaGoogle className="w-3.5 h-3.5 text-red-500" />
    ) : (
      <FaGithub className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
    );

  return (
    <Card className="animate-slide-up">
      <div className="flex items-start gap-5">
        {/* Avatar */}
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-2xl ring-4 ring-brand-500/10 object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center text-white text-lg font-bold ring-4 ring-brand-500/10">
            {getInitials(user.name)}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
              {user.name}
            </h2>
            <StatusBadge status={user.accessStatus} />
          </div>

          <div className="mt-2 space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <HiOutlineEnvelope className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <HiOutlineShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>{capitalize(user.role)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              {providerIcon}
              <span>Signed in via {capitalize(user.provider)}</span>
            </div>
          </div>

          {user.createdAt && (
            <div className="flex items-center gap-2 mt-3 text-xs text-gray-400 dark:text-gray-500">
              <HiOutlineBolt className="w-3.5 h-3.5" />
              <span>Member since {formatDate(user.createdAt)}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
