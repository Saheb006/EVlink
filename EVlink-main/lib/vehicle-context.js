import { createContext, useContext, useState, useEffect } from 'react';

const VehicleContext = createContext({
  vehicles: [],
  selectedVehicle: null,
  setSelectedVehicle: () => {},
  addVehicle: () => {},
  updateVehicle: () => {},
  deleteVehicle: () => {}
});

export function VehicleProvider({ children }) {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load vehicles from localStorage on initial render (non-blocking)
  useEffect(() => {
    // Use requestIdleCallback to avoid blocking the main thread
    const loadData = () => {
      try {
        const savedVehicles = localStorage.getItem('userVehicles');
        const savedSelectedVehicle = localStorage.getItem('selectedVehicle');
        
        // Use a timeout to prevent blocking the main thread
        setTimeout(() => {
          if (savedVehicles) {
            setVehicles(JSON.parse(savedVehicles));
          }
          
          if (savedSelectedVehicle) {
            setSelectedVehicle(JSON.parse(savedSelectedVehicle));
          }
          setIsInitialized(true);
        }, 0);
      } catch (error) {
        console.error('Error loading vehicles from localStorage:', error);
        setIsInitialized(true);
      }
    };
    
    loadData();
  }, []);

  // Save to localStorage whenever vehicles or selectedVehicle changes
  useEffect(() => {
    localStorage.setItem('userVehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    if (selectedVehicle) {
      localStorage.setItem('selectedVehicle', JSON.stringify(selectedVehicle));
    }
  }, [selectedVehicle]);

  const addVehicle = (vehicle) => {
    const newVehicle = { ...vehicle, id: Date.now().toString() };
    setVehicles(prev => [...prev, newVehicle]);
    // Automatically select the newly added vehicle
    setSelectedVehicle(newVehicle);
    return newVehicle;
  };

  const updateVehicle = (id, updates) => {
    setVehicles(prev => 
      prev.map(vehicle => 
        vehicle.id === id ? { ...vehicle, ...updates } : vehicle
      )
    );
    
    if (selectedVehicle && selectedVehicle.id === id) {
      setSelectedVehicle(prev => ({ ...prev, ...updates }));
    }
  };

  const deleteVehicle = (id) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
    if (selectedVehicle && selectedVehicle.id === id) {
      setSelectedVehicle(null);
    }
  };

  // Only render children once the context is initialized
  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <VehicleContext.Provider 
      value={{
        vehicles,
        selectedVehicle,
        setSelectedVehicle,
        addVehicle,
        updateVehicle,
        deleteVehicle
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export const useVehicles = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicles must be used within a VehicleProvider');
  }
  return context;
};
