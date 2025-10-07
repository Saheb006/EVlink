// Utility functions for search and filtering functionality

export const searchChargers = (chargers, query) => {
  if (!query.trim()) return chargers

  const searchTerm = query.toLowerCase().trim()

  return chargers.filter((charger) => {
    return (
      charger.name.toLowerCase().includes(searchTerm) ||
      charger.address.toLowerCase().includes(searchTerm) ||
      charger.type.toLowerCase().includes(searchTerm) ||
      charger.ownerName.toLowerCase().includes(searchTerm) ||
      charger.amenities.some((amenity) => amenity.toLowerCase().includes(searchTerm))
    )
  })
}

export const filterChargers = (chargers, filters) => {
  return chargers.filter((charger) => {
    // Type filter
    if (filters.type && filters.type !== "all" && charger.type !== filters.type) {
      return false
    }

    // Availability filter
    if (filters.availability && filters.availability !== "all") {
      if (filters.availability === "available" && !charger.available) return false
      if (filters.availability === "occupied" && charger.available) return false
    }

    // Price range filter
    if (filters.priceRange) {
      const price = Number.parseFloat(charger.pricePerKwh)
      if (filters.priceRange === "low" && price > 0.25) return false
      if (filters.priceRange === "medium" && (price <= 0.25 || price > 0.35)) return false
      if (filters.priceRange === "high" && price <= 0.35) return false
    }

    // Power level filter
    if (filters.powerLevel) {
      const power = Number.parseInt(charger.power)
      if (filters.powerLevel === "low" && power > 22) return false
      if (filters.powerLevel === "medium" && (power <= 22 || power > 50)) return false
      if (filters.powerLevel === "high" && power <= 50) return false
    }

    // Rating filter
    if (filters.minRating && charger.rating < filters.minRating) {
      return false
    }

    // Amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      const hasRequiredAmenities = filters.amenities.every((amenity) => charger.amenities.includes(amenity))
      if (!hasRequiredAmenities) return false
    }

    return true
  })
}

export const sortChargers = (chargers, sortBy, userLocation = null) => {
  const sorted = [...chargers]

  switch (sortBy) {
    case "distance":
      if (userLocation) {
        return sorted.sort((a, b) => {
          const distanceA = calculateDistance(userLocation, a.location)
          const distanceB = calculateDistance(userLocation, b.location)
          return distanceA - distanceB
        })
      }
      return sorted

    case "price-low":
      return sorted.sort((a, b) => Number.parseFloat(a.pricePerKwh) - Number.parseFloat(b.pricePerKwh))

    case "price-high":
      return sorted.sort((a, b) => Number.parseFloat(b.pricePerKwh) - Number.parseFloat(a.pricePerKwh))

    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating)

    case "power":
      return sorted.sort((a, b) => Number.parseInt(b.power) - Number.parseInt(a.power))

    case "availability":
      return sorted.sort((a, b) => {
        if (a.available && !b.available) return -1
        if (!a.available && b.available) return 1
        return 0
      })

    default:
      return sorted
  }
}

// Calculate distance between two coordinates (simplified)
const calculateDistance = (pos1, pos2) => {
  const R = 3959 // Earth's radius in miles
  const dLat = ((pos2.lat - pos1.lat) * Math.PI) / 180
  const dLng = ((pos2.lng - pos1.lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pos1.lat * Math.PI) / 180) *
      Math.cos((pos2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const getAvailableAmenities = (chargers) => {
  const amenitiesSet = new Set()
  chargers.forEach((charger) => {
    charger.amenities.forEach((amenity) => amenitiesSet.add(amenity))
  })
  return Array.from(amenitiesSet).sort()
}
