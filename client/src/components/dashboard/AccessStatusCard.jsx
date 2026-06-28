import { HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';

const statusDetails = {
  pending: {
    icon: HiOutlineClock,
    title: 'Access Pending',
    description:
      'Your account is awaiting admin approval. You will be notified via Telegram once your access is reviewed.',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  approved: {
    icon: HiOutlineCheckCircle,
    title: 'Access Approved',
    description:
      'Your account is approved! You will receive hourly weather alerts via Telegram if connected.',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  rejected: {
    icon: HiOutlineXCircle,
    title: 'Access Rejected',
    description:
      'Your account access has been rejected. Please contact the administrator for more information.',
    iconBg: 'bg-rose-100 dark:bg-rose-900/30',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
};

/**
 * Card showing the user's current access status with details.
 */
export default function AccessStatusCard({ status }) {
  const details = statusDetails[status] || statusDetails.pending;
  const Icon = details.icon;

  return (
    <Card className="animate-slide-up animate-delay-100">
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${details.iconBg}`}
        >
          <Icon className={`w-6 h-6 ${details.iconColor}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {details.title}
            </h3>
            <StatusBadge status={status} />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
            {details.description}
          </p>
        </div>
      </div>
    </Card>
  );
}
