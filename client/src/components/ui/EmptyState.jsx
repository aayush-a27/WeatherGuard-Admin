import { HiOutlineInbox } from 'react-icons/hi2';

/**
 * Empty state component shown when there's no data to display.
 */
export default function EmptyState({
  title = 'No data found',
  description = 'There is nothing to show here yet.',
  icon: Icon = HiOutlineInbox,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-surface-800 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-4">
        {description}
      </p>
      {action && action}
    </div>
  );
}
