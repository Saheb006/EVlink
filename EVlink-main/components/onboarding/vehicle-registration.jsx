"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/ui/header"
import { Car, Battery, Zap } from "lucide-react"

export function VehicleRegistration() {
  const { updateUser } = useAuth()
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    batteryCapacity: "",
    chargingType: "",
    licensePlate: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    updateUser({
      hasVehicle: true,
      vehicle: formData,
    })
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Vehicle Registration" />

      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Car className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Register Your Vehicle</h2>
          <p className="text-muted-foreground">Help us find the perfect charging stations for your EV</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Vehicle Details
            </CardTitle>
            <CardDescription>
              Provide your vehicle information to get personalized charging recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Select onValueChange={(value) => handleInputChange("make", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select make" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tesla">Tesla</SelectItem>
                      <SelectItem value="bmw">BMW</SelectItem>
                      <SelectItem value="audi">Audi</SelectItem>
                      <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                      <SelectItem value="volkswagen">Volkswagen</SelectItem>
                      <SelectItem value="nissan">Nissan</SelectItem>
                      <SelectItem value="hyundai">Hyundai</SelectItem>
                      <SelectItem value="kia">Kia</SelectItem>
                      <SelectItem value="ford">Ford</SelectItem>
                      <SelectItem value="chevrolet">Chevrolet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    placeholder="e.g., Model 3, i4, e-tron"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select onValueChange={(value) => handleInputChange("year", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => 2024 - i).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licensePlate">License Plate</Label>
                  <Input
                    id="licensePlate"
                    placeholder="ABC-1234"
                    value={formData.licensePlate}
                    onChange={(e) => handleInputChange("licensePlate", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batteryCapacity">Battery Capacity (kWh)</Label>
                  <Input
                    id="batteryCapacity"
                    type="number"
                    placeholder="e.g., 75"
                    value={formData.batteryCapacity}
                    onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chargingType">Charging Type</Label>
                  <Select onValueChange={(value) => handleInputChange("chargingType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select charging type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ccs">CCS (Combined Charging System)</SelectItem>
                      <SelectItem value="chademo">CHAdeMO</SelectItem>
                      <SelectItem value="tesla">Tesla Supercharger</SelectItem>
                      <SelectItem value="type2">Type 2 (AC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                <Battery className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <p className="font-medium">Why do we need this information?</p>
                  <p className="text-muted-foreground">
                    Vehicle details help us show compatible charging stations and accurate charging times.
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Complete Registration
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
