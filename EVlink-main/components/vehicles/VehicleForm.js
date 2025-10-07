import { useState, useEffect } from 'react';
import { useVehicles } from '@/lib/vehicle-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Battery, Car, Calendar, Hash, AlertCircle } from 'lucide-react';

export function VehicleForm({ onSuccess, onCancel, initialData }) {
  const { addVehicle, updateVehicle } = useVehicles();
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    batteryCapacity: '',
    maxPower: '',
    connectorType: 'CCS',
    licensePlate: '',
    nickname: ''
  });

  const connectorTypes = [
    { value: 'CCS', label: 'CCS (Combo)', icon: '🔌' },
    { value: 'CHAdeMO', label: 'CHAdeMO', icon: '🔋' },
    { value: 'Type2', label: 'Type 2 (Mennekes)', icon: '⚡' },
    { value: 'GB/T', label: 'GB/T', icon: '🇨🇳' },
    { value: 'Tesla', label: 'Tesla', icon: '🚗' },
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'batteryCapacity' || name === 'maxPower' 
        ? Number(value) 
        : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      if (initialData) {
        updateVehicle(initialData.id, formData);
      } else {
        addVehicle(formData);
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving vehicle:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="make" className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground" />
              Make
            </Label>
            <Input
              id="make"
              name="make"
              value={formData.make}
              onChange={handleChange}
              placeholder="e.g., Tesla"
              required
              className="pl-9"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model" className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground" />
              Model
            </Label>
            <Input
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g., Model 3"
              required
              className="pl-9"
            />
          </div>
        
        <div className="space-y-2">
          <Label htmlFor="year" className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Year
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="year"
              name="year"
              type="number"
              min="1990"
              max={new Date().getFullYear() + 1}
              value={formData.year}
              onChange={handleChange}
              className="pl-9"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="licensePlate" className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            License Plate
          </Label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="licensePlate"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleChange}
              placeholder="e.g., ABC 1234"
              className="pl-9"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="batteryCapacity" className="flex items-center gap-2">
            <Battery className="h-4 w-4 text-muted-foreground" />
            Battery Capacity (kWh)
          </Label>
          <div className="relative">
            <Battery className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="batteryCapacity"
              name="batteryCapacity"
              type="number"
              min="0"
              step="0.1"
              value={formData.batteryCapacity}
              onChange={handleChange}
              placeholder="e.g., 75.0"
              className="pl-9"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="maxPower" className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            Max Charging Power (kW)
          </Label>
          <div className="relative">
            <Zap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="maxPower"
              name="maxPower"
              type="number"
              min="0"
              step="0.1"
              value={formData.maxPower}
              onChange={handleChange}
              placeholder="e.g., 150.0"
              className="pl-9"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="connectorType" className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            Charging Connector Type
          </Label>
          <Select
            value={formData.connectorType}
            onValueChange={(value) => handleSelectChange('connectorType', value)}
          >
            <SelectTrigger className="pl-9">
              <Zap className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select connector type" />
            </SelectTrigger>
            <SelectContent>
              {connectorTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{type.icon}</span>
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="nickname" className="flex items-center gap-2">
            <span className="text-muted-foreground">🏷️</span>
            Vehicle Nickname (Optional)
          </Label>
          <div className="relative">
            <Input
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="e.g., My Daily Commuter"
              className="pl-9"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🏷️</span>
          </div>
        </div>
      </div>
      </div>
      
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between pt-6 gap-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <p>We'll use this information to find the best charging options for your vehicle.</p>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Saving...' : 'Save Vehicle'}
          </Button>
        </div>
      </div>
    </form>
  );
}
