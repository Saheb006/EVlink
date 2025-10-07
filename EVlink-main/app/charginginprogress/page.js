import { ActiveCharging } from "@/components/charging/active-charging";
import { AuthProvider } from "@/lib/auth-context";
import { NavigationProvider } from "@/lib/navigation-context";

export default function ChargingProgressPage() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <ActiveCharging />
      </NavigationProvider>
    </AuthProvider>
  );
}