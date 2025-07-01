
import { Calendar, Users, Settings, Bell, BarChart3, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'schedules', label: 'Schedules', icon: Calendar },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'services', label: 'Services', icon: Settings },
  { id: 'reminders', label: 'Reminders', icon: Bell },
];

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <Clock className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">onTurn</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Business Scheduling</p>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
