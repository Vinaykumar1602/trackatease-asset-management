
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
  status: 'scheduled' | 'in progress' | 'completed' | 'cancelled' | 'pending' | 'overdue';
}

interface ServiceCalendarViewProps {
  services: Service[];
  serviceItems?: any[];
  onServiceClick?: (id: string) => void;
}

export function ServiceCalendarView({ services, serviceItems, onServiceClick }: ServiceCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Map serviceItems to services format if provided
  const allServices = serviceItems ? 
    serviceItems.map(item => ({
      id: String(item.id),
      assetId: String(item.id),
      scheduledDate: item.scheduledDate,
      description: item.product,
      status: item.status.toLowerCase() as 'scheduled' | 'in progress' | 'completed' | 'cancelled' | 'pending' | 'overdue'
    })) : 
    services;

  // Custom day renderer for the calendar
  const renderDayContents = (day: Date) => {
    const formattedDate = format(day, 'yyyy-MM-dd');
    const servicesOnDay = allServices.filter(service => {
      // Try to handle different date formats
      let serviceDate;
      try {
        serviceDate = parseISO(service.scheduledDate);
      } catch (e) {
        // If parsing fails, try to create a date from the string
        serviceDate = new Date(service.scheduledDate);
      }
      return isSameDay(serviceDate, day);
    });
    
    const hasServices = servicesOnDay.length > 0;
    
    return hasServices ? (
      <div className="relative h-full w-full flex items-center justify-center">
        <div className="absolute bottom-1 left-0 right-0 flex justify-center">
          <div className="h-1 w-1 rounded-full bg-primary" />
        </div>
      </div>
    ) : null;
  };

  // Handle service click
  const handleServiceClick = (serviceId: string) => {
    if (onServiceClick) {
      onServiceClick(serviceId);
    }
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
          modifiers={{
            hasServices: (date) => {
              return allServices.some(service => {
                try {
                  const serviceDate = parseISO(service.scheduledDate);
                  return isSameDay(serviceDate, date);
                } catch (e) {
                  const serviceDate = new Date(service.scheduledDate);
                  return isSameDay(serviceDate, date);
                }
              });
            }
          }}
          modifiersClassNames={{
            hasServices: "bg-primary/10"
          }}
          components={{
            DayContent: ({ date }) => (
              <>
                <span>{date.getDate()}</span>
                {renderDayContents(date)}
              </>
            )
          }}
          className="rounded-md border"
        />
        {selectedDate && (
          <div>
            <h3>Services on {format(selectedDate, 'PPP')}</h3>
            {allServices.filter(service => {
              try {
                return isSameDay(parseISO(service.scheduledDate), selectedDate);
              } catch (e) {
                return isSameDay(new Date(service.scheduledDate), selectedDate);
              }
            }).length > 0 ? (
              <ul>
                {allServices
                  .filter(service => {
                    try {
                      return isSameDay(parseISO(service.scheduledDate), selectedDate);
                    } catch (e) {
                      return isSameDay(new Date(service.scheduledDate), selectedDate);
                    }
                  })
                  .map(service => (
                    <li 
                      key={service.id}
                      onClick={() => handleServiceClick(service.id)}
                      className="py-1 cursor-pointer hover:bg-accent px-2 rounded"
                    >
                      {service.description}
                    </li>
                  ))
                }
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
