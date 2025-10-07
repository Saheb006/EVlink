"use client"

import { useState } from "react"
import { useAuth } from "../../lib/auth-context"
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

export const LoginForm = ({ onToggleMode }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("ev-owner")
  const [loading, setLoading] = useState(false)
  const { login, googleLogin } = useAuth()
  const router = useRouter()
  // No redirectedFrom support; we route explicitly to chosen dashboards

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password, userType)
      // Set a short-lived cookie to bypass middleware while session hydrates
      if (typeof document !== 'undefined') {
        document.cookie = `justLoggedIn=1; Max-Age=10; Path=/`
      }
      const target = userType === 'ev-owner' ? '/evownerdashboard' : '/chargerownerdashboard'
      router.push(target)
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Sign in to your EV marketplace account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Account Type</Label>
            <RadioGroup value={userType} onValueChange={setUserType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ev-owner" id="ev-owner" />
                <Label htmlFor="ev-owner">EV Owner</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="charger-owner" id="charger-owner" />
                <Label htmlFor="charger-owner">Charger Owner</Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              if (typeof document !== 'undefined') {
                document.cookie = `justLoggedIn=1; Max-Age=30; Path=/`
              }
              googleLogin(userType)
            }}
            disabled={loading}
          >
            Continue with Google
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button variant="link" onClick={onToggleMode}>
            Don't have an account? Sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
