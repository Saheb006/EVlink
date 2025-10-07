"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNavigation } from '../../lib/navigation-context';
import { useAuth } from '../../lib/auth-context';

export default function ChargingPage() {
  const router = useRouter();
  const { chargingFlow, setChargingFlow } = useNavigation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if we have the necessary data to start charging
    if (!chargingFlow?.selectedCharger) {
      setError('No charger selected. Please go back and select a charger.');
      setIsLoading(false);
      return;
    }

    // Check if user is authenticated
    if (!user) {
      setError('You need to be logged in to start charging.');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }, [chargingFlow, user]);

  const handleStartCharging = async () => {
    try {
      // Here you would typically make an API call to start the charging session
      // For now, we'll just simulate a successful start
      console.log('Starting charging session for charger:', chargingFlow.selectedCharger.id);
      
      // Update the charging flow state
      setChargingFlow(prev => ({
        ...prev,
        step: 'charging',
        startedAt: new Date().toISOString(),
      }));
      
      // Navigate to the charging in progress page
      router.push('/charging/in-progress');
      
    } catch (error) {
      console.error('Error starting charging session:', error);
      setError('Failed to start charging. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Preparing charging session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Start Charging
          </div>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
            {chargingFlow.selectedCharger.name || 'Charging Station'}
          </h1>
          
          <div className="mt-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="text-gray-900">{chargingFlow.selectedCharger.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="text-gray-900">{chargingFlow.selectedCharger.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Power:</span>
              <span className="text-gray-900">{chargingFlow.selectedCharger.power}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price per kWh:</span>
              <span className="text-gray-900">${chargingFlow.selectedCharger.pricePerKwh}</span>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              onClick={handleStartCharging}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              Start Charging
            </button>
            
            <button
              onClick={() => router.back()}
              className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
