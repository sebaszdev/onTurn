
import { useEffect, useState } from 'react';
import { Bell, Plus, Edit, Trash2, Calendar, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns'


interface Reminder {
  id: number;
  client: string;
  message: string;
  service: string;
  status: 'pending' | 'sent';
  scheduledDate: string;
  scheduledTime: string;
}

export const ReminderManager = () => {
  const { toast } = useToast();
  
  const [showForm, setShowForm] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>( () => {
    const savedReminders = localStorage.getItem('reminders');
    return savedReminders ? JSON.parse(savedReminders) : []
  });
  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [formData, setFormData] = useState({
    client: '',
    date: '',
    time: '',
    service: '',
    message: ''
  });
  const [services, setServices] = useState([]);
  useEffect(() => {
    const loadServices = () => {
      const savedServices = localStorage.getItem('services');
      if (savedServices) {
        try {
          setServices(JSON.parse(savedServices));
        } catch (error) {
          console.error("Error parsing stored services: ", error);
          setServices([]);
        }
      }
    };

    loadServices();

    if (showForm) {
      loadServices();
    }
  }, [showForm]);
  const handleDelete = (id: number) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    toast({
      title: "Reminder deleted",
      description: "The reminder has been successfully removed.",
    });
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setFormData({
      client: reminder.client,
      date: reminder.scheduledDate,
      time: reminder.scheduledTime,
      service: reminder.service,
      message: reminder.message
    });
    setShowForm(true);
  };

  const handleMarkAsSent = (id: number) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, status: 'sent' } : reminder
    ));
    toast({
      title: "Reminder sent",
      description: "The reminder has been marked as sent.",
    });
  };

  const handleSubmit = () => {
    if (!formData.client || !formData.time || !formData.message || !formData.service) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const reminderData = {
      client: formData.client,
      scheduledDate: format(new Date(), 'yyyy-MM-dd'),
      scheduledTime: formData.time,
      service: formData.service,
      message: formData.message,
      status: 'pending' as const
    };

    if (editingReminder) {
      setReminders(reminders.map(reminder => 
        reminder.id === editingReminder.id 
          ? { ...reminder, ...reminderData }
          : reminder
      ));
      toast({
        title: "Reminder updated",
        description: "The reminder has been successfully updated.",
      });
    } else {
      const newReminder = {
        ...reminderData,
        id: Math.max(...reminders.map(r => r.id)) + 1
      };
      setReminders([...reminders, newReminder]);
      toast({
        title: "Reminder created",
        description: "The new reminder has been successfully created.",
      });
    }

    setShowForm(false);
    setEditingReminder(null);
    setFormData({ client: '', date: '', time: '', service: '', message: '' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingReminder(null);
    setFormData({ client: '', date: '', time: '', service:'', message: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reminder Management</h1>
          <p className="text-gray-600 mt-2">Manage client's fast reminders</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Reminder
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">
                  {reminders.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Bell className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-green-600">
                  {reminders.filter(r => r.status === 'sent').length}
                </p>
              </div>
              <Bell className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-blue-600">{reminders.length}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    reminder.status === 'sent' ? 'bg-green-500' : 'bg-orange-500'
                  }`}></div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{reminder.client}</span>
                    </div>
                    <p className="text-sm text-gray-600">{reminder.message}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{reminder.scheduledDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{reminder.scheduledTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {reminder.status === 'pending' && (
                    <Button size="sm" onClick={() => handleMarkAsSent(reminder.id)}>
                      Send Now
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(reminder)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(reminder.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingReminder ? 'Edit Reminder' : 'Create New Reminder'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Client</label>
                <Input 
                  placeholder="Select or enter client name" 
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>Service</label>
                <Select value={formData.service} onValueChange={(value) => setFormData({...formData, service: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service"/>
                  </SelectTrigger>
                  <SelectContent>
                    {services && services.length > 0 ? (
                      services.map(service => (
                        <SelectItem key={service.id} value={service.name}>
                          {service.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value={null} disabled>
                        No services available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <Input 
                  type="time" 
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Message</label>
                <Input 
                  placeholder="Enter reminder message" 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
                {editingReminder ? 'Update' : 'Create'} Reminder
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
