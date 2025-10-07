import ChargingMapDashboard from "../../components/charging/charging-map-dashboard";
import { AuthProvider } from "@/lib/auth-context";
import { NavigationProvider } from "@/lib/navigation-context";

export default function DirectionPage() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <ChargingMapDashboard />
      </NavigationProvider>
    </AuthProvider>
  );
}