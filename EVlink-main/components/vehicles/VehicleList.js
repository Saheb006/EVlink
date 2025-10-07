import { useVehicles } from '@/lib/vehicle-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Check, Zap, Battery, Car, Hash, Clock, BatteryCharging } from 'lucide-react';

const connectorIcons = {
  'CCS': '🔌',
  'CHAdeMO': '🔋',
  'Type2': '⚡',
  'GB/T': '🇨🇳',
  'Tesla': '🚗'
};

const getConnectorLabel = (type) => {
  const labels = {
    'CCS': 'CCS (Combo)',
    'CHAdeMO': 'CHAdeMO',
    'Type2': 'Type 2',
    'GB/T': 'GB/T',
    'Tesla': 'Tesla'
  };
  return labels[type] || type;
};

export function VehicleList({ onEdit }) {
  const { vehicles = [], selectedVehicle, setSelectedVehicle, deleteVehicle } = useVehicles();

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No vehicles added yet. Add your first vehicle to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vehicles.map((vehicle) => {
        const connectorIcon = connectorIcons[vehicle.connectorType] || '🔌';
        const connectorLabel = getConnectorLabel(vehicle.connectorType);
        
        return (
          <Card 
            key={vehicle.id} 
            className={`relative overflow-hidden transition-all hover:shadow-md ${
              selectedVehicle?.id === vehicle.id 
                ? 'ring-2 ring-primary border-primary/20' 
                : 'hover:border-primary/30'
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {vehicle.nickname ? (
                      <>
                        <Car className="h-5 w-5 text-primary" />
                        <span>{vehicle.nickname}</span>
                        <span className="text-muted-foreground text-sm font-normal ml-2">
                          {vehicle.make} {vehicle.model}
                        </span>
                      </>
                    ) : (
                      <>
                        <Car className="h-5 w-5 text-primary" />
                        {vehicle.make} {vehicle.model}
                      </>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {vehicle.year}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Hash className="h-3.5 w-3.5" />
                      {vehicle.licensePlate}
                    </span>
                  </CardDescription>
                </div>
                {selectedVehicle?.id === vehicle.id && (
                  <Badge className="flex items-center gap-1 bg-primary/10 text-primary hover:bg-primary/20">
                    <Check className="h-3 w-3" /> Selected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Battery className="h-3.5 w-3.5" />
                    Battery
                  </p>
                  <p className="font-medium">{vehicle.batteryCapacity} kWh</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Zap className="h-3.5 w-3.5" />
                    Max Power
                  </p>
                  <p className="font-medium">{vehicle.maxPower} kW</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1 text-xs">
                    <span className="text-base">{connectorIcon}</span>
                    Connector
                  </p>
                  <p className="font-medium">{connectorLabel}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">
                    Estimated Charge Time
                  </p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {vehicle.batteryCapacity && vehicle.maxPower 
                      ? `${Math.ceil(vehicle.batteryCapacity / (vehicle.maxPower * 0.8) * 60)} min`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-2 pb-4">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1"
                onClick={() => onEdit(vehicle)}
              >
                <Edit className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/5"
                onClick={() => deleteVehicle(vehicle.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
