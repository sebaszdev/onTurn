
import { Calendar, Users, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSchedules } from '@/contexts/ScheduleContext';

export const Dashboard = () => {
  const { schedules } = useSchedules();
  const stats = [
    {
      title: 'Today\'s Appointments',
      value: '12',
      icon: Calendar,
      change: '+2 from yesterday',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Clients',
      value: '156',
      icon: Users,
      change: '+8 this week',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Hours Scheduled',
      value: '32',
      icon: Clock,
      change: 'This week',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Revenue',
      value: '$2,450',
      icon: TrendingUp,
      change: '+12% from last month',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Today's Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div>
                    <h3 className="font-medium text-gray-900">{appointment.client}</h3>
                    <p className="text-sm text-gray-500">{appointment.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{appointment.time}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    appointment.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
