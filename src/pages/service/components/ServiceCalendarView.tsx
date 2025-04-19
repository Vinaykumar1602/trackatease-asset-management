import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isSameDay, parseISO } from 'date-fns';
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  assetId: string;
  scheduledDate: string;
  description: string;
  status: 'scheduled' | 'in progress' | 'completed' | 'cancelled';
}

interface ServiceCalendarViewProps {
  services: Service[];
}

export function ServiceCalendarView({ services }: ServiceCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Modify the day cell renderer for the calendar
  const renderDay = (day: Date, selectedDay: Date, dayProps: React.HTMLAttributes<HTMLDivElement>) => {
    const formattedDate = format(day, 'yyyy-MM-dd');
    const servicesOnDay = services.filter(service => {
      const serviceDate = parseISO(service.scheduledDate);
      return isSameDay(serviceDate, day);
    });
    
    const hasServices = servicesOnDay.length > 0;
    
    return (
      <div
        {...dayProps}
        className={cn(
          dayProps.className,
          "relative",
          hasServices && "bg-primary/10"
        )}
      >
        {dayProps.children}
        {hasServices && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <div className="h-1 w-1 rounded-full bg-primary" />
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Calendar</CardTitle>
        <CardDescription>View scheduled services on a calendar</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          renderDay={renderDay}
          className="rounded-md border"
        />
        {selectedDate && (
          <div>
            <h3>Services on {format(selectedDate, 'PPP')}</h3>
            {services.filter(service => isSameDay(parseISO(service.scheduledDate), selectedDate)).length > 0 ? (
              <ul>
                {services.filter(service => isSameDay(parseISO(service.scheduledDate), selectedDate)).map(service => (
                  <li key={service.id}>{service.description}</li>
                ))}
              </ul>
            ) : (
              <p>No services scheduled for this day.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
