
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { ScheduleManager } from '@/components/ScheduleManager';
import { ClientManager } from '@/components/ClientManager';
import { ServiceManager } from '@/components/ServiceManager';
import { ReminderManager } from '@/components/ReminderManager';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'schedules':
        return <ScheduleManager />;
      case 'clients':
        return <ClientManager />;
      case 'services':
        return <ServiceManager />;
      case 'reminders':
        return <ReminderManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
