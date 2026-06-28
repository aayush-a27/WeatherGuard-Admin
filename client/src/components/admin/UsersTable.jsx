import { HiOutlineUserGroup } from 'react-icons/hi2';
import StatusBadge from '../ui/StatusBadge';
import EmptyState from '../ui/EmptyState';
import { getInitials, formatDate, capitalize } from '../../utils/helpers';

/**
 * Full users table for admin view. Can be filtered by status.
 */
export default function UsersTable({ users, emptyTitle, emptyDescription }) {
  if (!users || users.length === 0) {
    return (
      <EmptyState
        icon={HiOutlineUserGroup}
        title={emptyTitle || 'No users found'}
        description={emptyDescription || 'No users match the current filter.'}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              User
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
              Provider
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
              Role
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
              Telegram
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
              Joined
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {users.map((user) => (
            <tr
              key={user._id}
              className="hover:bg-gray-50 dark:hover:bg-surface-800/50 transition-colors"
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 hidden sm:table-cell">
                <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                  {user.provider}
                </span>
              </td>
              <td className="px-4 py-4 hidden md:table-cell">
                <span
                  className={`text-sm font-medium ${
                    user.role === 'admin'
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {capitalize(user.role)}
                </span>
              </td>
              <td className="px-4 py-4 hidden md:table-cell">
                {user.telegramChatId ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                    Connected
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    Not connected
                  </span>
                )}
              </td>
              <td className="px-4 py-4 hidden lg:table-cell">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(user.createdAt)}
                </span>
              </td>
              <td className="px-4 py-4">
                <StatusBadge status={user.accessStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
