"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // Added useRouter
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Header } from "@/components/ui/header"
import { useNavigation } from "@/lib/navigation-context"
import { BackButton } from "@/components/ui/back-button"
import { useAuth } from "@/lib/auth-context"
import { Battery, Clock, DollarSign, Zap, MapPin, Star } from "lucide-react"

export function ChargingFlow({ mockUser }) {
  const { chargingFlow, setChargingFlow, navigateTo } = useNavigation()
  const { user: actualUser } = useAuth()
  const router = useRouter() // Initialize useRouter
  const user = actualUser || mockUser;
  const [selectedQuantity, setSelectedQuantity] = useState(50)
  const [customQuantity, setCustomQuantity] = useState("")
  const [useCustom, setUseCustom] = useState(false)

  const charger = chargingFlow.selectedCharger
  const vehicleBattery = user?.vehicle?.batteryCapacity || 75

  // Calculate estimates based on selected quantity
  const calculateEstimates = (quantity) => {
    const energyNeeded = (quantity / 100) * vehicleBattery
    const chargingPower = Number.parseFloat(charger?.power?.replace("kW", "")) || 50
    const estimatedTime = (energyNeeded / chargingPower) * 60 // in minutes
    const estimatedCost = energyNeeded * charger?.pricePerKwh || 0

    return {
      energyNeeded: energyNeeded.toFixed(1),
      estimatedTime: Math.ceil(estimatedTime),
      estimatedCost: estimatedCost.toFixed(2),
    }
  }

  const currentQuantity = useCustom ? Number.parseInt(customQuantity) || 0 : selectedQuantity
  const estimates = calculateEstimates(currentQuantity)

  const handleStartCharging = () => {
    const updatedChargingFlow = {
      ...chargingFlow,
      quantity: currentQuantity,
      estimatedTime: estimates.estimatedTime,
      estimatedCost: estimates.estimatedCost,
      step: "active-charging",
    };
    setChargingFlow(updatedChargingFlow);
    localStorage.setItem("chargingFlow", JSON.stringify(updatedChargingFlow));
    router.push('/payment');
  };

  if (!charger) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Charging Session" />
        <div className="container max-w-md mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">No charger selected</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Header title="Start Charging" />
      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Charger Info */}
      <BackButton className="absolute left-4 top-4" />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{charger.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  {charger.address}
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{charger.rating}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {charger.power} • ${charger.pricePerKwh}/kWh
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Battery className="h-5 w-5" />
              Your Vehicle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Vehicle</p>
                <p className="font-medium">
                  {user?.vehicle?.make} {user?.vehicle?.model}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Battery Capacity</p>
                <p className="font-medium">{vehicleBattery} kWh</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charging Amount Selection */}
        <Card>
          <CardHeader>
            <CardTitle>How much do you want to charge?</CardTitle>
            <CardDescription>Select the battery percentage you'd like to reach</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Select Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 75, 100].map((percentage) => (
                <Button
                  key={percentage}
                  variant={selectedQuantity === percentage && !useCustom ? "default" : "outline"}
                  onClick={() => {
                    setSelectedQuantity(percentage)
                    setUseCustom(false)
                  }}
                  className="h-12"
                >
                  {percentage}%
                </Button>
              ))}
            </div>

            {/* Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Battery Level</Label>
                <span className="text-sm font-medium">{currentQuantity}%</span>
              </div>
              <Slider
                value={[useCustom ? Number.parseInt(customQuantity) || 0 : selectedQuantity]}
                onValueChange={(value) => {
                  if (useCustom) {
                    setCustomQuantity(value[0].toString())
                  } else {
                    setSelectedQuantity(value[0])
                  }
                }}
                max={100}
                min={10}
                step={5}
                className="w-full"
              />
            </div>

            {/* Custom Input */}
            <div className="space-y-2">
              <Label htmlFor="custom">Or enter custom percentage</Label>
              <Input
                id="custom"
                type="number"
                placeholder="Enter percentage (10-100)"
                value={customQuantity}
                onChange={(e) => {
                  setCustomQuantity(e.target.value)
                  setUseCustom(true)
                }}
                min="10"
                max="100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Estimates */}
        <Card>
          <CardHeader>
            <CardTitle>Charging Estimates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Battery className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{estimates.energyNeeded}</p>
                <p className="text-sm text-muted-foreground">kWh needed</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{estimates.estimatedTime}</p>
                <p className="text-sm text-muted-foreground">minutes</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">${estimates.estimatedCost}</p>
                <p className="text-sm text-muted-foreground">estimated cost</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <Button
          onClick={handleStartCharging}
          className="w-full h-12 text-lg"
          disabled={currentQuantity < 10 || currentQuantity > 100}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  )
}
