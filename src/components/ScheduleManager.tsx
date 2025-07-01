
import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, Clock, CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useSchedules, Schedule } from '@/contexts/ScheduleContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const ScheduleManager = () => {
  const { toast } = useToast();
  const { schedules, addSchedule, updateSchedule, deleteSchedule } = useSchedules();
  const [showForm, setShowForm] = useState(false);
  const [services, setServices] = useState([]);
  useEffect(() => {
    const loadServices = () => {
      const savedServices = localStorage.getItem('services');
      if (savedServices) {
        try {
          setServices(JSON.parse(savedServices));
        } catch (error) {
          console.error('Error parsing stored services:', error);
          setServices([]);
        }
      }
    };
    
    loadServices();

    if (showForm) {
      loadServices();
    }
  }, [showForm]);
  const [clients, setClients] = useState([]);
  useEffect(() => {
    const loadClients = () => {
      const savedClients = localStorage.getItem('clients');
      if (savedClients) {
        try {
          setClients(JSON.parse(savedClients));
        } catch (error) {
          console.error('Error parsing stored clients: ', error);
          setClients([]);
        }
      }
    };

    loadClients()

    if (showForm) {
      loadClients();
    }
  }, [showForm])
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState({
    client: '',
    service: '',
    date: '',
    time: ''
  });

  
  const filteredSchedules = schedules.filter(schedule => 
    schedule.date === format(selectedDate, 'yyyy-MM-dd')
  );

  const handleDelete = (id: number) => {
    deleteSchedule(id);
    toast({
      title: "Appointment deleted",
      description: "The appointment has been successfully removed.",
    });
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      client: schedule.client,
      service: schedule.service,
      date: schedule.date,
      time: schedule.time
    });
    setShowForm(true);
  };

  const handleStatusChange = (id: number, newStatus: 'confirmed' | 'pending' | 'completed' | 'cancelled') => {
    updateSchedule(id, { status: newStatus });
    toast({
      title: "Status updated",
      description: `Appointment status changed to ${newStatus}.`,
    });
  };

  const handleSubmit = () => {
    if (!formData.client || !formData.service || !formData.date || !formData.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const appointmentData = {
      client: formData.client,
      service: formData.service,
      date: formData.date,
      time: formData.time,
      duration: 60, // Default duration
      status: 'pending' as const
    };

    if (editingSchedule) {
      updateSchedule(editingSchedule.id, appointmentData);
      toast({
        title: "Appointment updated",
        description: "The appointment has been successfully updated.",
      });
    } else {
      addSchedule(appointmentData);
      toast({
        title: "Appointment created",
        description: "The new appointment has been successfully created.",
      });
    }

    setShowForm(false);
    setEditingSchedule(null);
    setFormData({ client: '', service: '', date: '', time: '' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSchedule(null);
    setFormData({ client: '', service: '', date: '', time: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
          <p className="text-gray-600 mt-2">Manage appointments and bookings</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule for {format(selectedDate, "MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSchedules.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments scheduled for this date.</p>
                  </div>
                ) : (
                  filteredSchedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-center">
                          <Clock className="h-5 w-5 text-blue-500" />
                          <span className="text-sm font-medium">{schedule.time}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{schedule.client}</h3>
                          <p className="text-sm text-gray-500">{schedule.service} • {schedule.duration}min</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Select value={schedule.status} onValueChange={(value: any) => handleStatusChange(schedule.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(schedule)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(schedule.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats for {format(selectedDate, "MMM d")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total</span>
                <span className="font-semibold">{filteredSchedules.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Confirmed</span>
                <span className="font-semibold text-green-600">
                  {filteredSchedules.filter(s => s.status === 'confirmed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-yellow-600">
                  {filteredSchedules.filter(s => s.status === 'pending').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="font-semibold text-blue-600">
                  {filteredSchedules.filter(s => s.status === 'completed').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingSchedule ? 'Edit Appointment' : 'New Appointment'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Client</label>
                <Select value={formData.client} onValueChange={(value) => setFormData({...formData, client: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients && clients.length > 0 ? (
                      clients.map(client => (
                        <SelectItem key={client.id} value={client.name}>
                          {client.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value={null} disabled>
                        No client available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Service</label>
                <Select value={formData.service} onValueChange={(value) => setFormData({...formData, service: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
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
                <label className="block text-sm font-medium mb-2">Date</label>
                <Input 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <Input 
                  type="time" 
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
                {editingSchedule ? 'Update' : 'Create'} Appointment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
