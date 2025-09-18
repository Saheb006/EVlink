"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Slider } from "../ui/slider"
import { Checkbox } from "../ui/checkbox"
import { Badge } from "../ui/badge"
import { X, Filter } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { getAvailableAmenities } from "../../lib/search-utils"
import { mockChargers } from "../../lib/mock-data"

export const AdvancedFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isOpen, setIsOpen] = useState(false)
  const availableAmenities = getAvailableAmenities(mockChargers)

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const handleAmenityToggle = (amenity) => {
    const currentAmenities = filters.amenities || []
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a) => a !== amenity)
      : [...currentAmenities, amenity]

    handleFilterChange("amenities", newAmenities)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.type && filters.type !== "all") count++
    if (filters.availability && filters.availability !== "all") count++
    if (filters.priceRange) count++
    if (filters.powerLevel) count++
    if (filters.minRating && filters.minRating > 0) count++
    if (filters.amenities && filters.amenities.length > 0) count++
    return count
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative bg-transparent">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
          <DialogDescription>Refine your search with detailed filtering options</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Charger Type</Label>
              <Select value={filters.type || "all"} onValueChange={(value) => handleFilterChange("type", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="DC Fast">DC Fast</SelectItem>
                  <SelectItem value="Level 2">Level 2</SelectItem>
                  <SelectItem value="Level 1">Level 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Availability</Label>
              <Select
                value={filters.availability || "all"}
                onValueChange={(value) => handleFilterChange("availability", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stations</SelectItem>
                  <SelectItem value="available">Available Only</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label>Price Range</Label>
            <Select
              value={filters.priceRange || "any"}
              onValueChange={(value) => handleFilterChange("priceRange", value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any price</SelectItem>
                <SelectItem value="low">Low ($0.00 - $0.25/kWh)</SelectItem>
                <SelectItem value="medium">Medium ($0.25 - $0.35/kWh)</SelectItem>
                <SelectItem value="high">High ($0.35+/kWh)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Power Level */}
          <div className="space-y-2">
            <Label>Power Level</Label>
            <Select
              value={filters.powerLevel || "any"}
              onValueChange={(value) => handleFilterChange("powerLevel", value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any power level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any power level</SelectItem>
                <SelectItem value="low">Low (up to 22kW)</SelectItem>
                <SelectItem value="medium">Medium (22-50kW)</SelectItem>
                <SelectItem value="high">High (50kW+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-3">
            <Label>Minimum Rating: {filters.minRating || 0} stars</Label>
            <Slider
              value={[filters.minRating || 0]}
              onValueChange={([value]) => handleFilterChange("minRating", value)}
              max={5}
              min={0}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Any rating</span>
              <span>5 stars</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <Label>Required Amenities</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={(filters.amenities || []).includes(amenity)}
                    onCheckedChange={() => handleAmenityToggle(amenity)}
                  />
                  <Label htmlFor={amenity} className="text-sm">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Active Filters Display */}
          {getActiveFiltersCount() > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Active Filters</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {filters.type && filters.type !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Type: {filters.type}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("type", "all")} />
                    </Badge>
                  )}
                  {filters.availability && filters.availability !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {filters.availability}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("availability", "all")} />
                    </Badge>
                  )}
                  {filters.priceRange && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {filters.priceRange} price
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("priceRange", null)} />
                    </Badge>
                  )}
                  {filters.powerLevel && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {filters.powerLevel} power
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("powerLevel", null)} />
                    </Badge>
                  )}
                  {filters.minRating && filters.minRating > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {filters.minRating}+ stars
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("minRating", 0)} />
                    </Badge>
                  )}
                  {filters.amenities &&
                    filters.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                        {amenity}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleAmenityToggle(amenity)} />
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onClearFilters} className="bg-transparent">
            Clear All Filters
          </Button>
          <Button onClick={() => setIsOpen(false)}>Apply Filters</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
