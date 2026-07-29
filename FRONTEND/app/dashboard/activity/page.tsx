'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, ClockIcon, UserIcon, ShoppingBagIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, CheckCircleIcon, XCircleIcon, MagnifyingGlassIcon, FunnelIcon, EyeIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Toaster } from 'react-hot-toast';
import { showErrorToast } from '@/lib/toast';

interface Activity {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  type: string;
  user: string;
  status: string;
}

export default function ActivityLogPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0, logins: 0 });

  useEffect(() => { fetchActivities(); }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/users/activity`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch activities');
      const data = await response.json();
      setActivities(data);
      setStats({
        total: data.length,
        success: data.filter((a: Activity) => a.status === 'success').length,
        failed: data.filter((a: Activity) => a.status === 'failed').length,
        logins: data.filter((a: Activity) => a.type === 'login').length,
      });
    } catch (err: any) {
      setError(err.message);
      showErrorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'login': return <UserIcon className="h-5 w-5 text-blue-500" />;
      case 'logout': return <ArrowRightOnRectangleIcon className="h-5 w-5 text-slate-500" />;
      case 'sale': return <ShoppingBagIcon className="h-5 w-5 text-emerald-500" />;
      case 'update': return <PencilIcon className="h-5 w-5 text-amber-500" />;
      case 'delete': return <TrashIcon className="h-5 w-5 text-red-500" />;
      case 'create': return <PlusIcon className="h-5 w-5 text-blue-500" />;
      case 'view': return <EyeIcon className="h-5 w-5 text-purple-500" />;
      default: return <ClockIcon className="h-5 w-5 text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => status === 'success' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50';

  const filteredActivities = activities.filter(a => {
    const matchesSearch = a.action.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase()) || a.user.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || a.type === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div><p className="mt-4 text-slate-500">Loading activities...</p></div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-lg outline-none hover:bg-slate-100 transition"><ArrowLeftIcon className="h-5 w-5 text-slate-600" /></button>
          <div><h1 className="text-2xl font-bold text-slate-900">Activity Log</h1><p className="text-slate-500 text-sm mt-0.5">Real-time user activity tracking</p></div>
          <button onClick={fetchActivities} className="ml-auto px-4 py-2 text-sm bg-blue-600 text-white rounded-lg outline-none hover:bg-blue-700 transition flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-lg outline-none shadow-sm border border-slate-200 p-3 text-center"><p className="text-2xl font-bold text-slate-900">{stats.total}</p><p className="text-xs text-slate-500">Total Activities</p></div>
          <div className="bg-white rounded-lg outline-none shadow-sm border border-slate-200 p-3 text-center"><p className="text-2xl font-bold text-emerald-600">{stats.success}</p><p className="text-xs text-slate-500">Successful</p></div>
          <div className="bg-white rounded-lg outline-none shadow-sm border border-slate-200 p-3 text-center"><p className="text-2xl font-bold text-red-600">{stats.failed}</p><p className="text-xs text-slate-500">Failed</p></div>
          <div className="bg-white rounded-lg outline-none shadow-sm border border-slate-200 p-3 text-center"><p className="text-2xl font-bold text-blue-600">{stats.logins}</p><p className="text-xs text-slate-500">Logins</p></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Search activities..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white" />
          </div>
          <div className="relative min-w-[150px]">
            <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white appearance-none">
              <option value="all">All Activities</option>
              <option value="login">Logins</option>
              <option value="logout">Logouts</option>
              <option value="sale">Sales</option>
              <option value="update">Updates</option>
              <option value="create">Creates</option>
              <option value="delete">Deletes</option>
              <option value="view">Views</option>
            </select>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-lg outline-none p-4 text-red-600 text-sm mb-4">{error}</div>}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredActivities.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2"><ClockIcon className="h-12 w-12 text-slate-300" /><p className="text-lg font-medium">No activities found</p><p className="text-sm">Activities will appear here as you use the system</p></div>
                  </td></tr>
                ) : (
                  filteredActivities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-50 rounded-lg">{getIcon(activity.type)}</div>
                          <div><p className="text-sm font-medium text-slate-900">{activity.action}</p><p className="text-xs text-slate-400 sm:hidden">{activity.user} • {activity.timestamp}</p></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 hidden sm:table-cell">{activity.user}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 hidden md:table-cell">{activity.description}</td>
                      <td className="px-6 py-4 text-sm text-slate-400 hidden lg:table-cell">{activity.timestamp}</td>
                      <td className="px-6 py-4"><span className={`inline-block text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>{activity.status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredActivities.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
              <span>Showing {filteredActivities.length} activities</span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border border-slate-200 rounded-lg outline-none hover:bg-white transition disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg outline-none hover:bg-blue-700 transition">1</button>
                <button className="px-3 py-1 border border-slate-200 rounded-lg outline-none hover:bg-white transition">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
