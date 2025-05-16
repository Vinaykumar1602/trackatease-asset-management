
import { ServiceViewProvider } from "./context/ServiceViewContext";
import { ServiceManagementContent } from "./components/ServiceManagementContent";

// Main container component
export default function ServiceManagement() {
  return (
    <ServiceViewProvider>
      <ServiceManagementContent />
    </ServiceViewProvider>
  );
}
