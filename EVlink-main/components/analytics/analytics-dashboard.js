"use client"

import { useState } from "react"
import { useAuth } from "../../lib/auth-context"
import { mockAnalyticsData } from "../../lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { TrendingUp, TrendingDown, DollarSign, Zap, Clock, Target, ArrowLeft } from "lucide-react"
import { BackButton } from "../ui/back-button"

export const AnalyticsDashboard = () => {
  const { user, isEVOwner, isChargerOwner } = useAuth()
  const [timeRange, setTimeRange] = useState("3months")

  const analytics = isEVOwner ? mockAnalyticsData.evOwner : mockAnalyticsData.chargerOwner

  // Derived averages
  const avgCostPerSession = analytics.totalCostSpent / analytics.totalSessions
  const avgEnergyPerSession =
    (isEVOwner ? analytics.totalEnergyConsumed : analytics.totalEnergySold) / analytics.totalSessions
  const avgSessionDuration = analytics.averageSessionDuration

  return (
    <div className="relative">
      <div className="absolute left-6 top-6 z-10">
        <BackButton variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </BackButton>
      </div>
      <div className="container mx-auto px-4 py-6 space-y-6 pt-20">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
            <p className="text-muted-foreground">
              {isEVOwner
                ? "Track your charging patterns and costs"
                : "Monitor your charging station performance"}
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch">
        {isEVOwner ? (
          <>
            <Card className="h-full flex flex-col justify-between">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalSessions}</div>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col justify-between">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Energy Consumed</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalEnergyConsumed} kWh</div>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col justify-between">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analytics.totalCostSpent}</div>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col justify-between">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Energy per Session</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgEnergyPerSession.toFixed(1)} kWh</div>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col justify-between">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Cost per Session</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${avgCostPerSession.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col justify-between">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgSessionDuration}h</div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="h-full flex flex-col justify-between">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${analytics.totalRevenue.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col justify-between">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Energy Sold</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics.totalEnergySold.toLocaleString()} kWh
                </div>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col justify-between">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalSessions}</div>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col justify-between">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Revenue per Session</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${analytics.averageSessionValue.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col justify-between">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Energy per Session</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgEnergyPerSession.toFixed(1)} kWh</div>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col justify-between">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgSessionDuration}h</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Performance Insights */}
      <Card className="h-full flex flex-col justify-between">
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>
            {isEVOwner
              ? "Optimize your charging habits"
              : "Improve your station performance"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isEVOwner ? (
              <>
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <h4 className="font-medium">Cost Efficiency</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You're saving 15% by using Level 2 chargers during off-peak hours
                  </p>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <h4 className="font-medium">Usage Pattern</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Most of your charging happens on weekdays. Consider weekend
                    charging for better rates
                  </p>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h4 className="font-medium">Energy Trend</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your energy consumption is increasing. Consider route optimization
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <h4 className="font-medium">Peak Performance</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your stations are performing 18% above market average
                  </p>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <h4 className="font-medium">Utilization Rate</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Consider dynamic pricing during peak hours to maximize revenue
                  </p>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h4 className="font-medium">Growth Opportunity</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Adding amenities could increase session duration by 25%
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
