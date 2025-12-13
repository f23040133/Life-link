
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
    <div className="relative group bg-white dark:bg-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl border border-gray-100 dark:border-gray-700">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-full opacity-50 blur-xl transition-all group-hover:scale-150 duration-500"></div>
      
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} aria-hidden="true" />
          </div>
          {subtitle && (
             <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-lg">
               Stat
             </span>
          )}
        </div>
        
        <div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{value}</div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</div>
          {subtitle && <div className="text-xs text-gray-400 dark:text-gray-500 mt-2 border-t border-gray-100 dark:border-gray-700 pt-2">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
};
