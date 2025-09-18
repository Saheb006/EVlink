// Mock data for the EV marketplace app
export const mockChargers = [
  {
    id: 1,
    name: "Downtown Tesla Supercharger",
    location: { lat: 37.7749, lng: -122.4194 },
    address: "123 Market St, San Francisco, CA",
    type: "DC Fast",
    power: "150kW",
    pricePerKwh: 0.35,
    available: true,
    ownerId: 2,
    ownerName: "John Smith",
    amenities: ["WiFi", "Restroom", "Coffee Shop"],
    rating: 4.8,
    totalSessions: 1250,
    description: "A high-speed charging station located in the heart of the city.",
    photos: ["photo1.jpg", "photo2.jpg"],
  },
  {
    id: 2,
    name: "Mall Charging Station",
    location: { lat: 37.7849, lng: -122.4094 },
    address: "456 Shopping Center Dr, San Francisco, CA",
    type: "Level 2",
    power: "22kW",
    pricePerKwh: 0.25,
    available: false,
    ownerId: 3,
    ownerName: "Sarah Johnson",
    amenities: ["Shopping", "Food Court", "Parking"],
    rating: 4.5,
    totalSessions: 890,
    description: "A convenient charging station for mall visitors.",
    photos: ["photo3.jpg", "photo4.jpg"],
  },
  {
    id: 3,
    name: "Office Complex Charger",
    location: { lat: 37.7649, lng: -122.4294 },
    address: "789 Business Blvd, San Francisco, CA",
    type: "Level 2",
    power: "11kW",
    pricePerKwh: 0.2,
    available: true,
    ownerId: 4,
    ownerName: "Mike Wilson",
    amenities: ["Covered Parking", "Security"],
    rating: 4.2,
    totalSessions: 456,
    description: "A reliable charging station for office workers.",
    photos: ["photo5.jpg", "photo6.jpg"],
  },
]

export const mockChargingSessions = [
  {
    id: 1,
    chargerId: 1,
    chargerName: "Downtown Tesla Supercharger",
    userId: 1,
    startTime: "2024-01-15T10:30:00Z",
    endTime: "2024-01-15T11:15:00Z",
    energyDelivered: 45.5, // kWh
    cost: 15.93,
    status: "completed",
  },
  {
    id: 2,
    chargerId: 2,
    chargerName: "Mall Charging Station",
    userId: 1,
    startTime: "2024-01-12T14:20:00Z",
    endTime: "2024-01-12T16:45:00Z",
    energyDelivered: 32.8,
    cost: 8.2,
    status: "completed",
  },
  {
    id: 3,
    chargerId: 3,
    chargerName: "Office Complex Charger",
    userId: 1,
    startTime: "2024-01-10T09:00:00Z",
    endTime: "2024-01-10T12:30:00Z",
    energyDelivered: 28.2,
    cost: 5.64,
    status: "completed",
  },
]

export const mockAnalyticsData = {
  evOwner: {
    totalSessions: 15,
    totalEnergyConsumed: 456.7, // kWh
    totalCostSpent: 142.35,
    averageSessionDuration: 2.5, // hours
    monthlyUsage: [
      { month: "Jan", sessions: 5, energy: 156.2, cost: 48.75 },
      { month: "Feb", sessions: 4, energy: 128.4, cost: 38.2 },
      { month: "Mar", sessions: 6, energy: 172.1, cost: 55.4 },
    ],
  },
  chargerOwner: {
    totalRevenue: 2847.5,
    totalEnergySold: 8135.2, // kWh
    totalSessions: 342,
    averageSessionValue: 8.32,
    monthlyRevenue: [
      { month: "Jan", revenue: 945.2, sessions: 114, energy: 2701.5 },
      { month: "Feb", revenue: 876.4, sessions: 105, energy: 2505.8 },
      { month: "Mar", revenue: 1025.9, sessions: 123, energy: 2927.9 },
    ],
  },
}

export const addNewCharger = (stationData) => {
  const newCharger = {
    id: mockChargers.length + 1,
    name: stationData.name,
    location: {
      lat: Number.parseFloat(stationData.latitude),
      lng: Number.parseFloat(stationData.longitude),
    },
    address: stationData.address,
    type: stationData.type,
    power: stationData.power,
    pricePerKwh: Number.parseFloat(stationData.pricePerKwh),
    available: true,
    ownerId: 1, // Current user ID
    ownerName: "Current User",
    amenities: stationData.amenities,
    rating: 0,
    totalSessions: 0,
    description: stationData.description,
    photos: stationData.photos,
  }

  mockChargers.push(newCharger)
  return newCharger
}
