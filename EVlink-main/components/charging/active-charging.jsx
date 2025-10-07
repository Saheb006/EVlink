"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Header } from "@/components/ui/header"
import { useNavigation } from "@/lib/navigation-context"
import { BackButton } from "@/components/ui/back-button"
import { Battery, Clock, DollarSign, Zap, CheckCircle, StopCircle } from "lucide-react"

export function ActiveCharging() {
  const { chargingFlow: contextChargingFlow, resetNavigation, setChargingFlow } = useNavigation()
  const router = useRouter()
  const [currentProgress, setCurrentProgress] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [currentCost, setCurrentCost] = useState(0)
  const [isCharging, setIsCharging] = useState(true)
  const [startTime, setStartTime] = useState(Date.now())

  // Load chargingFlow from localStorage if not available in context
  const [chargingFlow, setLocalChargingFlow] = useState(contextChargingFlow);

  useEffect(() => {
    if (!contextChargingFlow.selectedCharger) {
      const storedChargingFlow = localStorage.getItem("chargingFlow");
      if (storedChargingFlow) {
        const parsedFlow = JSON.parse(storedChargingFlow);
        setLocalChargingFlow(parsedFlow);
        setChargingFlow(parsedFlow); // Also update the context with the loaded data
      }
    }
  }, [contextChargingFlow.selectedCharger, setChargingFlow]);

  const charger = chargingFlow.selectedCharger
  const { quantity, estimatedTime, estimatedCost } = chargingFlow

  // Update elapsed time every second
  useEffect(() => {
    if (!isCharging) return

    const timer = setInterval(() => {
      const secondsElapsed = Math.floor((Date.now() - startTime) / 1000)
      setElapsedTime(secondsElapsed)
    }, 1000)

    return () => clearInterval(timer)
  }, [isCharging, startTime])

  // Handle charging progress
  useEffect(() => {
    if (!isCharging) return

    const interval = setInterval(() => {
      // Calculate progress based on time elapsed vs estimated time
      // Scale the progress to the user's desired charge level (quantity)
      const progressPercentage = (elapsedTime / (estimatedTime * 60)) * 100
      const newProgress = Math.min(progressPercentage, 100)
      
      setCurrentProgress(newProgress)
      
      // Calculate the actual battery percentage based on the target
      const actualBatteryPercentage = (newProgress / 100) * quantity
      
      // Update cost based on progress
      const newCost = (newProgress / 100) * Number.parseFloat(estimatedCost)
      setCurrentCost(newCost)

      // Check if charging is complete
      if (newProgress >= 100) {
        setIsCharging(false)
      }
    }, 100) // Update more frequently for smoother animation

    return () => clearInterval(interval)
  }, [isCharging, elapsedTime, estimatedTime, estimatedCost, quantity])

  const handleStopCharging = () => {
    setIsCharging(false)
    // Calculate final progress based on time elapsed
    const finalProgress = (elapsedTime / (estimatedTime * 60)) * 100
    setCurrentProgress(Math.min(finalProgress, 100))
  }

  const handleComplete = () => {
    resetNavigation()
    router.push('evownerdashboard#')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!charger) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Charging Session" />
        <div className="container max-w-md mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">No active charging session</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Header title={isCharging ? "Charging..." : "Charging Complete"} />
      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Status Card */}
        <Card className={isCharging ? "border-primary bg-primary/5" : "border-green-500 bg-green-50 dark:bg-green-950"}>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isCharging ? "bg-primary/20" : "bg-green-100 dark:bg-green-900"
              }`}>
                {isCharging ? (
                  <Zap className="h-8 w-8 text-primary animate-pulse" />
                ) : (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                )}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {isCharging ? 'Charging in Progress' : 'Charging Complete'}
              </h2>
              <p className="text-muted-foreground">
                {isCharging 
                  ? `Charging at ${charger.name}`
                  : 'Charging complete'}
              </p>
            </div>

            {/* Battery Level */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Battery className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Battery Level</span>
                </div>
                <span className="text-sm font-medium">
                  {Math.round((currentProgress / 100) * 100)}%
                </span>
              </div>
              <div className="relative">
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300 ease-out"
                    style={{
                      width: `${Math.min(100, (currentProgress / 100) * 100)}%`
                    }}
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1 text-center">
                Target: {quantity}% of total battery
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                <Clock className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-sm font-medium">{formatTime(elapsedTime)}</span>
                <span className="text-xs text-muted-foreground">
                  {isCharging ? 'Elapsed' : 'Total Time'}
                </span>
              </div>
              <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                <Clock className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-sm font-medium">
                  {isCharging 
                    ? formatTime(Math.max(0, (estimatedTime * 60) - elapsedTime))
                    : '--:--'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {isCharging ? 'Remaining' : 'Time'}
                </span>
              </div>
              <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                <DollarSign className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-sm font-medium">
                  ${currentCost.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">Cost</span>
              </div>
            </div>

            {/* Charger Info */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle>Charging Station</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Station</span>
                    <span className="font-medium">{charger.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium text-right">{charger.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rate</span>
                    <span className="font-medium">${charger.pricePerKwh}/kWh</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              {isCharging ? (
                <Button onClick={handleStopCharging} variant="destructive" className="w-full h-12">
                  <StopCircle className="h-5 w-5 mr-2" />
                  Stop Charging
                </Button>
              ) : (
                <Button onClick={handleComplete} className="w-full h-12">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Complete Session
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
