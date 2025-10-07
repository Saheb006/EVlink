"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // Added useRouter
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/ui/header"
import { useNavigation } from "@/lib/navigation-context"
import { BackButton } from "@/components/ui/back-button"
import { Clock, CreditCard, Shield, Zap } from "lucide-react"

export function PaymentDashboard() {
  const { chargingFlow: realChargingFlow, navigateTo, setChargingFlow } = useNavigation()
  const router = useRouter() // Initialize useRouter

  const chargingFlow = {
    selectedCharger: {
      id: 'mock-charger-1',
      name: 'Mock Charger Station',
      pricePerKwh: 0.35,
      location: 'Mock Location',
    },
    quantity: 80,
    estimatedTime: 45,
    estimatedCost: 15.75,
    estimatedTravelTime: '10',
  };
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  const charger = chargingFlow.selectedCharger
  const { quantity, estimatedTime, estimatedCost } = chargingFlow

  const handlePayment = () => {
    // Simulate payment processing
    router.push('/getdirection');
  }

  if (!charger) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Payment" />
        <div className="container max-w-md mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">No charging session found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Header title="Payment" />
      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Charging Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Station</span>
              <span className="font-medium">{charger.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Charge to</span>
              <span className="font-medium">{quantity}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Estimated time</span>
              <span className="font-medium">{estimatedTime} minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Rate</span>
              <span className="font-medium">${charger.pricePerKwh}/kWh</span>
            </div>

            <Separator />

            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total</span>
              <span>${estimatedCost}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="apple">Apple Pay</SelectItem>
                <SelectItem value="google">Google Pay</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>

            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails((prev) => ({ ...prev, number: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails((prev) => ({ ...prev, expiry: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails((prev) => ({ ...prev, cvv: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "cash" && (
              <div className="space-y-4 text-center py-8">
                <p className="text-lg font-medium">Please pay in cash at the charging station.</p>
                <p className="text-muted-foreground">Ensure you have the exact amount ready.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div className="text-sm">
                <p className="font-medium">Secure Payment</p>
                <p className="text-muted-foreground">Your payment information is encrypted and secure</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estimated Travel Time */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-200">Estimated time to reach</p>
                <p className="font-medium text-blue-900 dark:text-white">
                  {chargingFlow.estimatedTravelTime || '5-10'} minutes
                </p>
              </div>
            </div>
            <Button onClick={handlePayment} className="bg-blue-600 hover:bg-blue-700">
              Get Direction
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
