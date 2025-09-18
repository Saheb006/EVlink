"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Navigation, MapPin, Clock, Car, ExternalLink } from "lucide-react"

export function DirectionsModal({ isOpen, onClose, charger, userLocation, onArrived }) {
  const [selectedRoute, setSelectedRoute] = useState(0)

  // Mock route data - in real app this would come from Google Maps/Apple Maps API
  const routes = [
    {
      id: 0,
      name: "Fastest Route",
      duration: "12 min",
      distance: "3.2 miles",
      traffic: "Light traffic",
      steps: [
        "Head north on Main St toward 1st Ave",
        "Turn right onto Highway 101 N",
        "Take exit 15 for Downtown",
        "Turn left onto Market St",
        "Destination will be on your right",
      ],
    },
    {
      id: 1,
      name: "Avoid Highways",
      duration: "18 min",
      distance: "4.1 miles",
      traffic: "Moderate traffic",
      steps: [
        "Head east on Oak St",
        "Continue straight for 2.1 miles",
        "Turn right onto Pine St",
        "Turn left onto Market St",
        "Destination will be on your right",
      ],
    },
  ]

  const currentRoute = routes[selectedRoute]

  const openInMaps = (app) => {
    const destination = encodeURIComponent(charger.address)
    let url = ""

    switch (app) {
      case "google":
        url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`
        break
      case "apple":
        url = `http://maps.apple.com/?daddr=${destination}`
        break
      case "waze":
        url = `https://waze.com/ul?q=${destination}`
        break
    }

    window.open(url, "_blank")
  }

  if (!charger) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Directions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Destination Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{charger.name}</h3>
                  <p className="text-sm text-muted-foreground">{charger.address}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={charger.available ? "default" : "secondary"} className="text-xs">
                      {charger.available ? "Available" : "Occupied"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {charger.type} • {charger.power}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Route Options */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Route Options</h4>
            {routes.map((route) => (
              <Card
                key={route.id}
                className={`cursor-pointer transition-colors ${
                  selectedRoute === route.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedRoute(route.id)}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{route.name}</p>
                      <p className="text-xs text-muted-foreground">{route.traffic}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{route.duration}</p>
                      <p className="text-xs text-muted-foreground">{route.distance}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Turn-by-turn directions */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Car className="h-4 w-4" />
              Turn-by-turn Directions
            </h4>
            <Card>
              <CardContent className="p-3 space-y-3">
                {currentRoute.steps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">{index + 1}</span>
                    </div>
                    <p className="text-sm">{step}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Open in Maps Apps */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Open in Navigation App</h4>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" onClick={() => openInMaps("google")} className="justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                Google Maps
              </Button>
              <Button variant="outline" onClick={() => openInMaps("apple")} className="justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                Apple Maps
              </Button>
              <Button variant="outline" onClick={() => openInMaps("waze")} className="justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                Waze
              </Button>
            </div>
          </div>

          {/* ETA and Info */}
          <Card className="bg-muted/50">
            <CardContent className="p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Estimated arrival</span>
                </div>
                <span className="font-medium">
                  {new Date(Date.now() + Number.parseInt(currentRoute.duration) * 60000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
          <div className="pt-4">
            <Button size="lg" className="w-full" onClick={() => {
              onArrived()
              onClose()
            }}>
              Mark as reached
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
