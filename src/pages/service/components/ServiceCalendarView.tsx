
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServiceItem } from '../ServiceManagement';
import { format, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon } from 'lucide-react';

interface ServiceCalendarViewProps {
  serviceItems: ServiceItem[];
  onServiceClick: (id: number) => void;
}

export function ServiceCalendarView({ serviceItems, onServiceClick }: ServiceCalendarViewProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());

  // Convert all scheduled dates to Date objects
  const serviceItemsWithDates = serviceItems.map(item => ({
    ...item,
    dateObject: new Date(item.scheduledDate)
  }));

  // Get services for the selected day
  const selectedDayServices = serviceItemsWithDates.filter(item => 
    isSameDay(item.dateObject, date)
  );

  // Function to handle month navigation
  const handleMonthChange = (increment: boolean) => {
    const newMonth = new Date(month);
    if (increment) {
      newMonth.setMonth(newMonth.getMonth() + 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() - 1);
    }
    setMonth(newMonth);
  };

  // Function to highlight days with services
  const isDayHighlighted = (day: Date) => {
    return serviceItemsWithDates.some(item => 
      isSameDay(item.dateObject, day)
    );
  };

  // Generate a class for the day based on status
  const getDayClassNames = (day: Date) => {
    const servicesOnDay = serviceItemsWithDates.filter(item => 
      isSameDay(item.dateObject, day)
    );
    
    if (servicesOnDay.length === 0) return "";
    
    if (servicesOnDay.some(item => item.status === "Overdue")) {
      return "bg-red-100 text-red-900 font-semibold";
    } else if (servicesOnDay.some(item => item.status === "Scheduled")) {
      return "bg-blue-100 text-blue-900 font-semibold";
    } else if (servicesOnDay.some(item => item.status === "Completed")) {
      return "bg-green-100 text-green-900 font-semibold";
    }
    
    return "bg-gray-100 text-gray-900 font-semibold";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-card p-4 rounded-md border">
        <div className="flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-muted-foreground" />
          <h3 className="text-lg font-medium">Service Calendar</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => handleMonthChange(false)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(month, 'MMMM yyyy')}
          </span>
          <Button size="sm" variant="outline" onClick={() => handleMonthChange(true)}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            month={month}
            onMonthChange={setMonth}
            className="rounded-md border bg-white"
            modifiers={{
              highlighted: isDayHighlighted
            }}
            modifiersClassNames={{
              highlighted: "p-0"
            }}
            components={{
              Day: ({ day, ...props }) => {
                const customClass = getDayClassNames(day);
                return (
                  <button
                    {...props}
                    className={`${props.className} ${customClass}`}
                  />
                );
              }
            }}
          />
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-blue-100 rounded-full mr-2"></span>
              <span className="text-xs">Scheduled</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-red-100 rounded-full mr-2"></span>
              <span className="text-xs">Overdue</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-green-100 rounded-full mr-2"></span>
              <span className="text-xs">Completed</span>
            </div>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">
                {format(date, 'MMMM d, yyyy')}
              </h4>
              <Badge>{selectedDayServices.length} Services</Badge>
            </div>
            
            {selectedDayServices.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No services scheduled for this day
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDayServices.map((service) => (
                  <div 
                    key={service.id} 
                    className="border rounded-md p-3 cursor-pointer hover:bg-accent"
                    onClick={() => onServiceClick(service.id)}
                  >
                    <div className="flex justify-between">
                      <div className="font-medium">{service.client}</div>
                      <Badge 
                        variant="outline" 
                        className={
                          service.status === "Completed" ? "bg-green-100 text-green-800" :
                          service.status === "Overdue" ? "bg-red-100 text-red-800" :
                          "bg-blue-100 text-blue-800"
                        }
                      >
                        {service.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{service.product}</div>
                    <div className="text-xs mt-1">Technician: {service.technician}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
