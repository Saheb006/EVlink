"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from 'next/navigation';
import { useAuth } from "../../lib/auth-context"
import { useNavigation } from "../../lib/navigation-context"
import { useVehicles, VehicleProvider } from "../../lib/vehicle-context"
import { mockChargers, mockChargingSessions } from "../../lib/mock-data"
import { searchChargers, filterChargers, sortChargers } from "../../lib/search-utils"
import { Header } from "../ui/header"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { MapPin, Zap, DollarSign, Search, Map, ArrowUpDown, Car, Plus, Check, Pencil, ArrowLeft } from "lucide-react"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { AnalyticsDashboard } from "../analytics/analytics-dashboard"
import { ChargerMap } from "../map/charger-map"
import { AdvancedFilters } from "../search/advanced-filters"
import { BackButton } from "../ui/back-button"
import Link from "next/link"

// Main Dashboard Content Component
const DashboardContent = () => {
  // Get navigation and auth context
  const { user } = useAuth()
  const { currentPage, navigateTo, setChargingFlow } = useNavigation()
  const [location, setLocation] = useState(null)
  const [locationPermission, setLocationPermission] = useState("prompt")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    type: "all",
    availability: "all",
    priceRange: null,
    powerLevel: null,
    minRating: 0,
    amenities: [],
  })
  const [sortBy, setSortBy] = useState("distance")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [viewMode, setViewMode] = useState("list")
  const [selectedCharger, setSelectedCharger] = useState(null)
  
  // Demo vehicles state - will be replaced with real data when connected to DB
  const [demoVehicles] = useState([
    {
      id: 'demo-1',
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      batteryCapacity: 75,
      maxPower: 250,
      connectorType: 'Tesla',
      licensePlate: 'TESLA 123',
      nickname: 'My Tesla'
    },
    {
      id: 'demo-2',
      make: 'Hyundai',
      model: 'Kona Electric',
      year: 2022,
      batteryCapacity: 64,
      maxPower: 150,
      connectorType: 'CCS',
      licensePlate: 'HYUN 456',
      nickname: 'Family Car'
    },
    {
      id: 'demo-3',
      make: 'Tata',
      model: 'Nexon EV',
      year: 2023,
      batteryCapacity: 40.5,
      maxPower: 120,
      connectorType: 'CCS',
      licensePlate: 'TATA 789',
      nickname: 'City Commuter'
    }
  ]);
  
  // Use demo vehicles for now - will be replaced with real data from context when connected to DB
  const [vehicles] = useState(demoVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState(demoVehicles[0]);

  useEffect(() => {
    requestLocationPermission()
  }, [])

  const requestLocationPermission = async () => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocationPermission("granted")
      } catch (error) {
        console.error("Error getting location:", error)
        setLocationPermission("denied")
      }
    } else {
      setLocationPermission("unsupported")
    }
  }

  const filteredAndSortedChargers = useMemo(() => {
    let result = mockChargers
    if (searchQuery.trim()) {
      result = searchChargers(result, searchQuery)
    }
    result = filterChargers(result, filters)
    return sortChargers(result, sortBy, location)
  }, [searchQuery, filters, sortBy, location])

  const handleClearFilters = () => {
    setSearchQuery("")
    setFilters({
      type: "all",
      availability: "all",
      priceRange: null,
      powerLevel: null,
      minRating: 0,
      amenities: [],
    })
    setSortBy("distance")
  }

  const router = useRouter();

  const handleStartCharging = async (charger) => {
    try {
      console.log("Starting charging with charger:", charger);
      
      if (!charger) {
        throw new Error("No charger selected");
      }
      
      if (charger.available !== true) {
        throw new Error(`Charger ${charger.name || charger.id} is not available`);
      }
      
      // Create a clean charger object with only the necessary properties
      const selectedCharger = {
        id: charger.id,
        name: charger.name,
        location: charger.location,
        address: charger.address,
        type: charger.type,
        power: charger.power,
        pricePerKwh: charger.pricePerKwh,
        ownerId: charger.ownerId,
        ownerName: charger.ownerName,
        amenities: [...(charger.amenities || [])]
      };
      
      // Update the charging flow state
      setChargingFlow({
        selectedCharger,
        step: "quantity",
        quantity: 0,
        estimatedTime: 0,
        estimatedCost: 0
      });
      
      console.log("Navigating to charging flow...");
      
      // Use the router to navigate to the charging flow page
      router.push('/chargingflow');
      
    } catch (error) {
      console.error("Error starting charging:", error);
      // Show error to the user
      alert(`Could not start charging: ${error.message}`);
    }
  }

  const userSessions = user ? mockChargingSessions.filter((session) => session.userId === user.id) : [];
  const totalEnergyUsed = userSessions.reduce((sum, session) => sum + session.energyDelivered, 0);
  const totalCostSpent = userSessions.reduce((sum, session) => sum + session.cost, 0);

  // Render the selected vehicle card
  const SelectedVehicleCard = () => {
    if (!selectedVehicle) {
      return (
        <Card className="mb-6 border-dashed">
          <CardContent className="pt-6 text-center">
            <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No vehicle selected</h3>
            <p className="text-muted-foreground mb-4">Please select a vehicle to get started</p>
            <Link href="/vehicles">
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Vehicle
              </Button>
            </Link>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                <span>Current Vehicle</span>
                <Badge variant="secondary" className="ml-2">
                  Selected
                </Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                {selectedVehicle.make} {selectedVehicle.model} • {selectedVehicle.year}
                {selectedVehicle.licensePlate && ` • ${selectedVehicle.licensePlate}`}
              </CardDescription>
            </div>
            <Link href="/vehicles">
              <Button variant="ghost" size="sm" className="text-primary">
                Change <ArrowUpDown className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Battery</p>
              <p className="font-medium">{selectedVehicle.batteryCapacity} kWh</p>
            </div>
            <div>
              <p className="text-muted-foreground">Max Power</p>
              <p className="font-medium">{selectedVehicle.maxPower} kW</p>
            </div>
            <div>
              <p className="text-muted-foreground">Connector</p>
              <p className="font-medium capitalize">{selectedVehicle.connectorType}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Range</p>
              <p className="font-medium">
                {Math.round(selectedVehicle.batteryCapacity * 6.5)} km
                <span className="text-xs text-muted-foreground ml-1">(est.)</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render the vehicles list
  const VehiclesList = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Car className="h-5 w-5" />
          <span>My Vehicles</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <Card 
              key={vehicle.id} 
              className={`hover:shadow-md transition-shadow cursor-pointer ${
                selectedVehicle?.id === vehicle.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedVehicle(vehicle)}
            >
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.year} • {vehicle.licensePlate}
                    </p>
                  </div>
                  {selectedVehicle?.id === vehicle.id && (
                    <Badge variant="secondary">Selected</Badge>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Battery</p>
                    <p>{vehicle.batteryCapacity} kWh</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Power</p>
                    <p>{vehicle.maxPower} kW</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Connector</p>
                    <p className="capitalize">{vehicle.connectorType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Render the main dashboard content
  const DashboardContent = () => (
    <>
      <SelectedVehicleCard />
      <VehiclesList />

      {/* Location Permission Banner */}
      {locationPermission === "denied" && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <MapPin className="h-5 w-5" />
              <p className="font-medium">Location access denied</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Enable location access to find nearby charging stations
            </p>
            <Button variant="outline" size="sm" className="mt-3 bg-transparent" onClick={requestLocationPermission}>
              Enable Location
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userSessions.length}</div>
            <p className="text-xs text-muted-foreground">Charging sessions completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Used</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnergyUsed.toFixed(1)} kWh</div>
            <p className="text-xs text-muted-foreground">Total energy consumed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCostSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total charging costs</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Find Charging Stations</CardTitle>
              <CardDescription>
                {filteredAndSortedChargers.length} stations found
                {searchQuery && ` for "${searchQuery}"`}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
              >
                <Map className="h-4 w-4 mr-1" />
                Map
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, location, type, or amenities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <AdvancedFilters filters={filters} onFiltersChange={setFilters} onClearFilters={handleClearFilters} />

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="power">Highest Power</SelectItem>
                    <SelectItem value="availability">Available First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map or List View */}
      {viewMode === "map" ? (
        <div className="mb-8">
          <ChargerMap
            userLocation={location}
            selectedCharger={selectedCharger}
            onChargerSelect={setSelectedCharger}
            chargers={filteredAndSortedChargers}
          />
        </div>
      ) : (
        /* Charging Stations List */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredAndSortedChargers.length > 0 ? (
            filteredAndSortedChargers.map((charger) => (
              <Card key={charger.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{charger.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {charger.address}
                      </CardDescription>
                    </div>
                    <Badge variant={charger.available ? "default" : "secondary"}>
                      {charger.available ? "Available" : "Occupied"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">Type</p>
                      <p className="text-sm text-muted-foreground">{charger.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Power</p>
                      <p className="text-sm text-muted-foreground">{charger.power}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Price</p>
                      <p className="text-sm text-muted-foreground">${charger.pricePerKwh}/kWh</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Rating</p>
                      <p className="text-sm text-muted-foreground">⭐ {charger.rating}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-1">
                      {charger.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      className="flex-1"
                      disabled={!charger.available}
                      onClick={() => handleStartCharging(charger)}
                    >
                      {charger.available ? "Start Charging" : "Currently Occupied"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCharger(charger)
                        setViewMode("map")
                      }}
                    >
                      <Map className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No charging stations found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Try adjusting your search terms or filters to find more results
                </p>
                <Button onClick={handleClearFilters} variant="outline">
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Recent Charging History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Charging Sessions</CardTitle>
          <CardDescription>Your latest charging activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userSessions.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{session.chargerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.startTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{session.energyDelivered} kWh</p>
                  <p className="text-sm text-muted-foreground">${session.cost.toFixed(2)}</p>
                </div>
              </div>
            ))}

            {userSessions.length === 0 && (
              <div className="text-center py-8">
                <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No charging sessions yet</p>
                <p className="text-sm text-muted-foreground">Start your first charging session to see history here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )

  // Render the vehicles tab content
  const VehiclesContent = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Vehicles</h2>
          <Link href="/vehicles">
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Vehicle
            </Button>
          </Link>
        </div>
        
        {vehicles.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No vehicles added yet</h3>
              <p className="text-muted-foreground mb-4">Add your first vehicle to get started</p>
              <Link href="/vehicles">
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Add Vehicle
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className={selectedVehicle?.id === vehicle.id ? 'ring-2 ring-primary' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {vehicle.make} {vehicle.model}
                      </CardTitle>
                      <CardDescription>
                        {vehicle.year} • {vehicle.licensePlate}
                      </CardDescription>
                    </div>
                    {selectedVehicle?.id === vehicle.id && (
                      <Badge>Selected</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Battery</p>
                      <p>{vehicle.batteryCapacity}kWh</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Max Power</p>
                      <p>{vehicle.maxPower}kW</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Connector</p>
                      <p className="capitalize">{vehicle.connectorType}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button 
                      variant={selectedVehicle?.id === vehicle.id ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setSelectedVehicle(vehicle)}
                      className="flex-1"
                    >
                      {selectedVehicle?.id === vehicle.id ? (
                        <>
                          <Check className="h-4 w-4 mr-1" /> Selected
                        </>
                      ) : (
                        'Select as Current'
                      )}
                    </Button>
                    <Link href={`/vehicles?edit=${vehicle.id}`}>
                      <Button variant="outline" size="sm" className="px-3">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="EV Owner Dashboard" />
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <DashboardContent />
          </TabsContent>
          
          <TabsContent value="vehicles" className="relative">
            <Button 
              variant="ghost" 
              onClick={() => setActiveTab("dashboard")} 
              className="mb-4 ml-[-8px]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
            <VehiclesContent />
          </TabsContent>
          
          <TabsContent value="analytics" className="relative">
            <Button 
              variant="ghost" 
              onClick={() => setActiveTab("dashboard")} 
              className="mb-4 ml-[-8px]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Main component
export const EVOwnerDashboard = () => {
  return <DashboardContent />;
}
