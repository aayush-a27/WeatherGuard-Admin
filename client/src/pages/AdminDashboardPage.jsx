import { useState, useMemo } from 'react';
import { HiOutlineUserGroup, HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';
import { useAdmin } from '../hooks/useAdmin';
import PendingRequestsTable from '../components/admin/PendingRequestsTable';
import UsersTable from '../components/admin/UsersTable';
import Loader from '../components/ui/Loader';
import Card from '../components/ui/Card';

const tabs = [
  { id: 'pending', label: 'Pending', icon: HiOutlineClock },
  { id: 'approved', label: 'Approved', icon: HiOutlineCheckCircle },
  { id: 'rejected', label: 'Rejected', icon: HiOutlineXCircle },
  { id: 'all', label: 'All Users', icon: HiOutlineUserGroup },
];

/**
 * Admin dashboard with tabbed user management.
 */
export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const {
    allUsers,
    pendingUsers,
    loading,
    error,
    actionLoading,
    handleApprove,
    handleReject,
  } = useAdmin();

  const approvedUsers = useMemo(
    () => allUsers.filter((u) => u.accessStatus === 'approved'),
    [allUsers]
  );

  const rejectedUsers = useMemo(
    () => allUsers.filter((u) => u.accessStatus === 'rejected'),
    [allUsers]
  );

  const stats = [
    { label: 'Total Users', value: allUsers.length, icon: HiOutlineUserGroup, color: 'brand' },
    { label: 'Pending', value: pendingUsers.length, icon: HiOutlineClock, color: 'amber' },
    { label: 'Approved', value: approvedUsers.length, icon: HiOutlineCheckCircle, color: 'emerald' },
    { label: 'Rejected', value: rejectedUsers.length, icon: HiOutlineXCircle, color: 'rose' },
  ];

  const colorMap = {
    brand: {
      bg: 'bg-brand-100 dark:bg-brand-900/30',
      text: 'text-brand-600 dark:text-brand-400',
    },
    amber: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-600 dark:text-amber-400',
    },
    emerald: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    rose: {
      bg: 'bg-rose-100 dark:bg-rose-900/30',
      text: 'text-rose-600 dark:text-rose-400',
    },
  };

  if (loading) {
    return <Loader text="Loading admin data..." />;
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-center">
        <p className="text-rose-600 dark:text-rose-400 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage user access requests and monitor platform activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const colors = colorMap[stat.color];
          return (
            <Card
              key={stat.label}
              className={`animate-slide-up ${i > 0 ? `animate-delay-${i}00` : ''}`}
              hover={false}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg}`}
                >
                  <stat.icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-surface-800 rounded-xl mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-surface-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.id === 'pending' && pendingUsers.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full">
                {pendingUsers.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <Card hover={false} className="!p-0 overflow-hidden">
        <div className="p-1">
          {activeTab === 'pending' && (
            <PendingRequestsTable
              users={pendingUsers}
              onApprove={handleApprove}
              onReject={handleReject}
              actionLoading={actionLoading}
            />
          )}
          {activeTab === 'approved' && (
            <UsersTable
              users={approvedUsers}
              emptyTitle="No approved users"
              emptyDescription="No users have been approved yet."
            />
          )}
          {activeTab === 'rejected' && (
            <UsersTable
              users={rejectedUsers}
              emptyTitle="No rejected users"
              emptyDescription="No users have been rejected."
            />
          )}
          {activeTab === 'all' && (
            <UsersTable
              users={allUsers}
              emptyTitle="No users registered"
              emptyDescription="No users have signed up yet."
            />
          )}
        </div>
      </Card>
    </div>
  );
}
