
import { useEffect, useState } from 'react';
import { Settings, Plus, Edit, Trash2, DollarSign, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
  category: string;
  description: string;
}

export const ServiceManager = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>(() => {
    const savedServices = localStorage.getItem('services');
    return savedServices ? JSON.parse(savedServices) : [{
      id: "Peluqueada", 
      name: "Corte de pelo", 
      duration: 40, 
      price: 22000, 
      category: "Corte", 
      description: "Corte sencillo"}]
  });

  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(services));
  }, [services]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    duration: '',
    price: '',
    description: ''
  });

  const handleDelete = (id: number) => {
    setServices(services.filter(service => service.id !== id));
    toast({
      title: "Service deleted",
      description: "The service has been successfully removed.",
    });
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      category: service.category,
      duration: service.duration.toString(),
      price: service.price.toString(),
      description: service.description
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.duration || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const serviceData = {
      name: formData.name,
      category: formData.category,
      duration: parseInt(formData.duration),
      price: parseFloat(formData.price),
      description: formData.description
    };

    if (editingService) {
      setServices(services.map(service => 
        service.id === editingService.id 
          ? { ...serviceData, id: editingService.id }
          : service
      ));
      toast({
        title: "Service updated",
        description: "The service has been successfully updated.",
      });
    } else {
      const newService = {
        ...serviceData,
        id: Math.max(...services.map(s => s.id)) + 1
      };
      setServices([...services, newService]);
      toast({
        title: "Service added",
        description: "The new service has been successfully created.",
      });
    }

    setShowForm(false);
    setEditingService(null);
    setFormData({ name: '', category: '', duration: '', price: '', description: '' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
    setFormData({ name: '', category: '', duration: '', price: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
          <p className="text-gray-600 mt-2">Manage your business services and pricing</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Settings className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {service.category}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{service.description}</p>
                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration}min</span>
                  </div>
                  <div className="flex items-center space-x-1 text-lg font-semibold text-green-600">
                    <DollarSign className="h-4 w-4" />
                    <span>{service.price}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Service Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingService ? 'Edit Service' : 'Add New Service'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Service Name</label>
                <Input 
                  placeholder="Enter service name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Input 
                  placeholder="Enter category" 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                <Input 
                  type="number" 
                  placeholder="Enter duration" 
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price ($)</label>
                <Input 
                  type="number" 
                  placeholder="Enter price" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <Input 
                  placeholder="Enter service description" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
                {editingService ? 'Update Service' : 'Add Service'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
