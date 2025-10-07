"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Header } from "@/components/ui/header"
import { useNavigation } from "@/lib/navigation-context"
import { Upload, MapPin, Zap, Camera, X } from "lucide-react"

export function StationRegistration() {
  const { goBack } = useNavigation()
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    type: "",
    power: "",
    pricePerKwh: "",
    description: "",
    amenities: [],
    photos: [],
    locationPhoto: null,
    operatingHours: {
      monday: { open: "00:00", close: "23:59", is24h: true },
      tuesday: { open: "00:00", close: "23:59", is24h: true },
      wednesday: { open: "00:00", close: "23:59", is24h: true },
      thursday: { open: "00:00", close: "23:59", is24h: true },
      friday: { open: "00:00", close: "23:59", is24h: true },
      saturday: { open: "00:00", close: "23:59", is24h: true },
      sunday: { open: "00:00", close: "23:59", is24h: true },
    },
  })

  const amenityOptions = [
    "WiFi",
    "Restroom",
    "Coffee Shop",
    "Restaurant",
    "Shopping",
    "Food Court",
    "Parking",
    "Covered Parking",
    "Security",
    "Lounge Area",
    "Vending Machines",
    "ATM",
  ]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || [])
    
    // Filter for image files only
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      alert('Please upload only image files (JPEG, PNG, etc.)')
      return
    }
    
    // Limit number of photos
    if (formData.photos.length + imageFiles.length > 10) {
      alert('You can upload a maximum of 10 photos')
      return
    }
    
    imageFiles.forEach((file) => {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`)
        return
      }
      
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          photos: [
            ...prev.photos, 
            { 
              id: Date.now() + Math.random(), 
              url: event.target.result, 
              name: file.name,
              size: file.size,
              type: file.type
            }
          ],
        }))
      }
      reader.onerror = () => {
        console.error('Error reading file:', file.name)
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (photoId) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((photo) => photo.id !== photoId),
    }))
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }))
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Station registration data:", formData)
    // For now, just go back to dashboard
    goBack()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Add Charging Station" />

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Register Your Charging Station</h2>
          <p className="text-muted-foreground">Share your charger with the EV community and start earning</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Provide essential details about your charging station</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Station Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Downtown Fast Charger"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Charger Photo *</Label>
                    <span className="text-xs text-muted-foreground">
                      {formData.photos.length > 0 ? '1/1 photo' : 'Required'}
                    </span>
                  </div>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${formData.photos.length > 0 ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-primary'}`}>
                    <input
                      type="file"
                      id="charger-photo"
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoUpload}
                      disabled={formData.photos.length > 0}
                    />
                    <label 
                      htmlFor="charger-photo" 
                      className={`cursor-pointer ${formData.photos.length > 0 ? 'pointer-events-none' : ''}`}
                    >
                      {formData.photos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Camera className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Upload a photo of your charger</p>
                            <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, or WebP (Max 5MB)</p>
                          </div>
                          <Button type="button" variant="outline" size="sm" className="mt-2">
                            Select File
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="relative w-full h-40 rounded-md overflow-hidden">
                            <img
                              src={formData.photos[0].url}
                              alt="Uploaded charger preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Button 
                                type="button"
                                variant="destructive" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFormData(prev => ({ ...prev, photos: [] }));
                                }}
                                className="rounded-full w-10 h-10 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-gray-500 truncate">
                            {formData.photos[0].name}
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label htmlFor="type">Charger Type *</Label>
                  <Select onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select charger type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Level 1">Level 1 (120V)</SelectItem>
                      <SelectItem value="Level 2">Level 2 (240V)</SelectItem>
                      <SelectItem value="DC Fast">DC Fast Charging</SelectItem>
                      <SelectItem value="Tesla Supercharger">Tesla Supercharger</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="power">Power Output *</Label>
                  <Select onValueChange={(value) => handleInputChange("power", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select power output" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3.7kW">3.7kW</SelectItem>
                      <SelectItem value="7kW">7kW</SelectItem>
                      <SelectItem value="11kW">11kW</SelectItem>
                      <SelectItem value="22kW">22kW</SelectItem>
                      <SelectItem value="50kW">50kW</SelectItem>
                      <SelectItem value="150kW">150kW</SelectItem>
                      <SelectItem value="250kW">250kW</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricePerKwh">Price per kWh ($) *</Label>
                  <Input
                    id="pricePerKwh"
                    type="number"
                    step="0.01"
                    placeholder="0.35"
                    value={formData.pricePerKwh}
                    onChange={(e) => handleInputChange("pricePerKwh", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your charging station, accessibility, special instructions..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
              <CardDescription>Specify the exact location of your charging station</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, City, State, ZIP"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>

                {/* Location Photo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Location Photo</Label>
                    <span className="text-xs text-muted-foreground">
                      {formData.locationPhoto ? '1/1 photo' : 'Optional'}
                    </span>
                  </div>
                  <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                    formData.locationPhoto ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-primary'
                  }`}>
                    <input
                      type="file"
                      id="location-photo"
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setFormData(prev => ({
                              ...prev,
                              locationPhoto: {
                                url: event.target.result,
                                name: file.name,
                                type: file.type,
                                size: file.size
                              }
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      disabled={!!formData.locationPhoto}
                    />
                    <label 
                      htmlFor="location-photo" 
                      className={`cursor-pointer ${formData.locationPhoto ? 'pointer-events-none' : ''}`}
                    >
                      {!formData.locationPhoto ? (
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Camera className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-sm text-gray-600">Add a photo of the location</p>
                          <p className="text-xs text-gray-400">Show the surrounding area</p>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="relative w-full h-40 rounded-md overflow-hidden">
                            <img
                              src={formData.locationPhoto.url}
                              alt="Location preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Button 
                                type="button"
                                variant="destructive" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFormData(prev => ({
                                    ...prev,
                                    locationPhoto: null
                                  }));
                                }}
                                className="rounded-full w-9 h-9 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-gray-500 truncate">
                            {formData.locationPhoto.name}
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    placeholder="37.7749"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange("latitude", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    placeholder="-122.4194"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange("longitude", e.target.value)}
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    className="w-full bg-transparent"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Use Current Location
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Camera className="h-5 w-5 text-primary" />
                Upload Photos
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                Add clear photos of your charging station from different angles (recommended)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Station Photos</Label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formData.photos.length}/10 photos
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {/* Upload Button */}
                  <div>
                    <input
                      type="file"
                      id="photo-upload"
                      className="hidden"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoUpload}
                      disabled={formData.photos.length >= 10}
                    />
                    <label
                      htmlFor="photo-upload"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        formData.photos.length >= 10
                          ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20 cursor-not-allowed opacity-70'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <Camera className="h-6 w-6 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium text-primary">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          JPEG, PNG (max 5MB)
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Uploaded Photos */}
                  {formData.photos.map((photo) => (
                    <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img
                        src={photo.url}
                        alt={`Preview ${photo.name}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removePhoto(photo.id);
                          }}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          aria-label={`Remove ${photo.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 px-2 truncate">
                        {photo.name.length > 15 ? `${photo.name.substring(0, 12)}...` : photo.name}
                      </div>
                    </div>
                  ))}
                </div>

                {formData.photos.length === 0 && (
                  <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No photos added yet. Upload at least one photo of your charging station.
                    </p>
                  </div>
                )}

                {formData.photos.length > 0 && formData.photos.length < 3 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    Tip: Adding 3 or more photos can increase visibility by up to 40%
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
              <CardDescription>Select available amenities near your charging station</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {amenityOptions.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityToggle(amenity)}
                    />
                    <Label htmlFor={amenity} className="text-sm font-normal">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={goBack} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Register Station
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
