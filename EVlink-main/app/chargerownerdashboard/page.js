import { ChargerOwnerDashboard } from "../../components/dashboards/charger-owner-dashboard"
import { AuthProvider } from "../../lib/auth-context"
import { NavigationProvider } from "../../lib/navigation-context"

export default function Page() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <ChargerOwnerDashboard />
      </NavigationProvider>
    </AuthProvider>
  )
}
