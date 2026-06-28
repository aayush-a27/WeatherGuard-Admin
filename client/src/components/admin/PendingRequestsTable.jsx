import { useState } from 'react';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineUserGroup } from 'react-icons/hi2';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import EmptyState from '../ui/EmptyState';
import Modal from '../ui/Modal';
import { getInitials, formatDate } from '../../utils/helpers';

/**
 * Table showing pending user requests with approve/reject actions.
 */
export default function PendingRequestsTable({
  users,
  onApprove,
  onReject,
  actionLoading,
}) {
  const [modal, setModal] = useState({ open: false, action: null, user: null });

  if (!users || users.length === 0) {
    return (
      <EmptyState
        icon={HiOutlineUserGroup}
        title="No pending requests"
        description="All user access requests have been processed."
      />
    );
  }

  const openModal = (action, user) => {
    setModal({ open: true, action, user });
  };

  const closeModal = () => {
    setModal({ open: false, action: null, user: null });
  };

  const handleConfirm = async () => {
    if (modal.action === 'approve') {
      await onApprove(modal.user._id);
    } else {
      await onReject(modal.user._id);
    }
    closeModal();
  };

  return (
    <>
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
                Joined
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                Actions
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
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(user.createdAt)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={user.accessStatus} />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      icon={HiOutlineCheckCircle}
                      loading={actionLoading === user._id}
                      onClick={() => openModal('approve', user)}
                    >
                      <span className="hidden sm:inline">Approve</span>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={HiOutlineXCircle}
                      loading={actionLoading === user._id}
                      onClick={() => openModal('reject', user)}
                    >
                      <span className="hidden sm:inline">Reject</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={modal.action === 'approve' ? 'Approve User' : 'Reject User'}
        message={`Are you sure you want to ${modal.action} ${modal.user?.name || 'this user'}?`}
        confirmText={modal.action === 'approve' ? 'Approve' : 'Reject'}
        confirmVariant={modal.action === 'approve' ? 'success' : 'danger'}
        loading={!!actionLoading}
      />
    </>
  );
}
