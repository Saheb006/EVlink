import { PaymentDashboard } from "../../components/charging/payment-dashboard";
import { AuthProvider } from "@/lib/auth-context";
import { NavigationProvider } from "@/lib/navigation-context";

export default function PaymentDashboardPage() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <PaymentDashboard />
      </NavigationProvider>
    </AuthProvider>
  );
}