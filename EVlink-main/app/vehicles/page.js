'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import { VehicleForm } from '@/components/vehicles/VehicleForm';
import { VehicleList } from '@/components/vehicles/VehicleList';

export default function VehiclesPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const handleSuccess = () => {
    setIsAdding(false);
    setEditingVehicle(null);
  };

  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Vehicles</h1>
          <p className="text-muted-foreground">Manage your registered vehicles</p>
        </div>
        {!isAdding && !editingVehicle && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Vehicle
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Vehicle</h2>
          <VehicleForm 
            onSuccess={handleSuccess} 
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}

      {editingVehicle && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Edit Vehicle</h2>
          <VehicleForm 
            initialData={editingVehicle}
            onSuccess={handleSuccess}
            onCancel={() => setEditingVehicle(null)}
          />
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Vehicles</h2>
        <VehicleList 
          onEdit={setEditingVehicle}
        />
      </div>
    </div>
  );
}
