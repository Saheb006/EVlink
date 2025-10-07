"use client"

import { useState } from "react"
import { useAuth } from "../../lib/auth-context"
import { useNavigation } from "../../lib/navigation-context"
import { BackButton } from "../ui/back-button"
import { mockChargers, mockAnalyticsData } from "../../lib/mock-data"
import { Header } from "../ui/header"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Plus, DollarSign, Zap, TrendingUp, MapPin, Settings, Eye, Upload, X } from "lucide-react"

export const ChargerOwnerDashboard = () => {
  const { user } = useAuth()
  const { navigateTo } = useNavigation()
  const [showAddChargerDialog, setShowAddChargerDialog] = useState(false)
  const [newCharger, setNewCharger] = useState({
    name: "",
    address: "",
    type: "Level 2",
    power: "",
    pricePerKwh: "",
    amenities: [],
    available: true,
    image: null,
    imagePreview: null
  })

  // Filter chargers for the current owner, with null check for user
  const ownerChargers = user ? mockChargers.filter((charger) => charger.ownerId === user.id) : [];
  const analytics = mockAnalyticsData.chargerOwner;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCharger(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setNewCharger(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  const handleAddCharger = () => {
    // In a real app, this would make an API call with FormData
    const formData = new FormData();
    formData.append('name', newCharger.name);
    formData.append('address', newCharger.address);
    formData.append('type', newCharger.type);
    formData.append('power', newCharger.power);
    formData.append('pricePerKwh', newCharger.pricePerKwh);
    formData.append('available', newCharger.available);
    if (newCharger.image) {
      formData.append('image', newCharger.image);
    }
    
    console.log("Adding new charger:", Object.fromEntries(formData));
    
    // Reset form
    setShowAddChargerDialog(false);
    setNewCharger({
      name: "",
      address: "",
      type: "Level 2",
      power: "",
      pricePerKwh: "",
      amenities: [],
      available: true,
      image: null,
      imagePreview: null
    });
  }

  const toggleChargerAvailability = (chargerId) => {
    // In a real app, this would make an API call
    console.log("Toggling availability for charger:", chargerId)
  }

  return (
      <div className="min-h-screen bg-background">
        <BackButton className="m-4" />
      <Header title="Charger Owner Dashboard" />

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-6">
          <Button variant="default">Dashboard</Button>
          <Button variant="outline" onClick={() => navigateTo("analytics")}>
            Analytics
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All-time earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energy Sold</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalEnergySold.toLocaleString()} kWh</div>
              <p className="text-xs text-muted-foreground">Total energy delivered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalSessions}</div>
              <p className="text-xs text-muted-foreground">Charging sessions completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Session Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analytics.averageSessionValue}</div>
              <p className="text-xs text-muted-foreground">Per charging session</p>
            </CardContent>
          </Card>
        </div>

        {/* My Chargers Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">My Charging Stations</h2>
            <p className="text-muted-foreground">Manage your charging stations and monitor performance</p>
          </div>
          <Dialog open={showAddChargerDialog} onOpenChange={setShowAddChargerDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Charger
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Charging Station</DialogTitle>
                <DialogDescription>Fill in the details for your new charging station</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Charger Image</Label>
                  <label 
                    htmlFor="charger-image" 
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                  >
                    {newCharger.imagePreview ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={newCharger.imagePreview} 
                          alt="Charger preview" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button 
                          type="button" 
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-1.5 bg-destructive/80 text-white rounded-full hover:bg-destructive transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center">
                        <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-primary">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG (max. 5MB)</p>
                      </div>
                    )}
                    <input 
                      id="charger-image" 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="charger-name">Station Name</Label>
                  <Input
                    id="charger-name"
                    placeholder="e.g., Downtown Office Charger"
                    value={newCharger.name}
                    onChange={(e) => setNewCharger({ ...newCharger, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="charger-address">Address</Label>
                  <Textarea
                    id="charger-address"
                    placeholder="Full address of the charging station"
                    value={newCharger.address}
                    onChange={(e) => setNewCharger({ ...newCharger, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="charger-type">Charger Type</Label>
                    <Select
                      value={newCharger.type}
                      onValueChange={(value) => setNewCharger({ ...newCharger, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Level 1">Level 1</SelectItem>
                        <SelectItem value="Level 2">Level 2</SelectItem>
                        <SelectItem value="DC Fast">DC Fast</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="charger-power">Power Output</Label>
                    <Input
                      id="charger-power"
                      placeholder="e.g., 22kW"
                      value={newCharger.power}
                      onChange={(e) => setNewCharger({ ...newCharger, power: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price-per-kwh">Price per kWh ($)</Label>
                  <Input
                    id="price-per-kwh"
                    type="number"
                    step="0.01"
                    placeholder="0.25"
                    value={newCharger.pricePerKwh}
                    onChange={(e) => setNewCharger({ ...newCharger, pricePerKwh: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={newCharger.available}
                    onCheckedChange={(checked) => setNewCharger({ ...newCharger, available: checked })}
                  />
                  <Label htmlFor="available">Available for use</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddChargerDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCharger}>Add Charger</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Chargers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {ownerChargers.map((charger) => (
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
                    <p className="text-sm font-medium">Sessions</p>
                    <p className="text-sm text-muted-foreground">{charger.totalSessions}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Rating</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">⭐</span>
                    <span className="font-medium">{charger.rating}</span>
                    <span className="text-sm text-muted-foreground">({charger.totalSessions} reviews)</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Settings className="h-4 w-4 mr-1" />
                    Settings
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Eye className="h-4 w-4 mr-1" />
                    Analytics
                  </Button>
                </div>

                <div className="mt-3">
                  <Button
                    variant={charger.available ? "secondary" : "default"}
                    size="sm"
                    className="w-full"
                    onClick={() => toggleChargerAvailability(charger.id)}
                  >
                    {charger.available ? "Mark as Occupied" : "Mark as Available"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {ownerChargers.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Zap className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No charging stations yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Add your first charging station to start earning revenue from EV owners
                </p>
                <Button onClick={() => setShowAddChargerDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Charger
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest charging sessions at your stations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.monthlyRevenue.slice(0, 5).map((month, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{month.month} Performance</p>
                      <p className="text-sm text-muted-foreground">{month.sessions} sessions completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${month.revenue.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{month.energy.toFixed(1)} kWh sold</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
