
import React from 'react';
import { User } from '../types';
import { StatCard } from './StatCard';
import { Users, Droplets, Activity, Shield } from 'lucide-react';

interface AdminDashboardProps {
  users: User[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ users }) => {
  const donors = users.filter(u => u.role === 'DONOR');
  const totalDonations = donors.reduce((acc, curr) => acc + curr.totalDonations, 0);
  const totalLivesSaved = donors.reduce((acc, curr) => acc + curr.livesSaved, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
            <p className="text-gray-500">Overview of system performance and user registry.</p>
        </div>
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-200">
            Admin Access
        </span>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={users.length} icon={Users} color="bg-blue-500" subtitle="Across all roles" />
        <StatCard title="Total Donors" value={donors.length} icon={Droplets} color="bg-red-500" subtitle="Registered donors" />
        <StatCard title="Total Donations" value={totalDonations} icon={Activity} color="bg-green-500" subtitle="Units collected" />
        <StatCard title="Lives Impacted" value={totalLivesSaved} icon={Shield} color="bg-purple-500" subtitle="Estimated impact" />
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">User Registry</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3">Blood Type</th>
                        <th className="px-6 py-3">Location</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Registered</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 mr-3">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{user.name}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                    ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                                      user.role === 'HOSPITAL' ? 'bg-blue-100 text-blue-800' : 
                                      'bg-green-100 text-green-800'}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-gray-600">
                                {user.bloodType || '-'}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                                {user.location || 'N/A'}
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                                {new Date().toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
