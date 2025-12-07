
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-2xl hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-xl p-3 ${color} bg-opacity-10 dark:bg-opacity-20`}>
            <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
              <dd>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                {subtitle && <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</div>}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
