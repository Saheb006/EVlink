"use client";

import { ChargingFlow } from '@/components/charging/charging-flow';
import { useAuth, AuthProvider } from '@/lib/auth-context';
import { NavigationProvider, useNavigation } from '@/lib/navigation-context';
import { mockChargers } from '@/lib/mock-data';
import { useEffect } from 'react';

function ChargingFlowPageContent() {
  const { setChargingFlow } = useNavigation();
  const { user } = useAuth();

  const mockUser = {
    id: 'mock-user-123',
    email: 'test@example.com',
    vehicle: {
      make: 'Tesla',
      model: 'Model 3',
      batteryCapacity: 75,
    },
  };

  useEffect(() => {
    const mockCharger = mockChargers;
    setChargingFlow((prev) => {
      if (!prev.selectedCharger) {
        return { ...prev, selectedCharger: mockCharger };
      }
      return prev;
    });
  }, [setChargingFlow]);

  return <ChargingFlow mockUser={user || mockUser} />;
}

export default function ChargingFlowPage() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <ChargingFlowPageContent />
      </NavigationProvider>
    </AuthProvider>
  );
}
