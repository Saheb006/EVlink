import { EVOwnerDashboard } from "../../components/dashboards/ev-owner-dashboard"
import { AuthProvider } from "../../lib/auth-context"
import { NavigationProvider } from "../../lib/navigation-context"

export default function Page() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <EVOwnerDashboard />
      </NavigationProvider>
    </AuthProvider>
  )
}
