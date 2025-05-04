
import { Button } from "@/components/ui/button";
import { ServiceItem } from "../types";

interface ServiceActionsProps {
  service: ServiceItem;
  onEdit: (service: ServiceItem) => void;
  onComplete: (id: string) => void;
}

export const ServiceActions = ({ service, onEdit, onComplete }: ServiceActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(service)}
      >
        Edit
      </Button>
      {service.status !== "Completed" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onComplete(service.id)}
        >
          Complete
        </Button>
      )}
    </div>
  );
};
