
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Circle
} from "lucide-react";
import { format } from "date-fns";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const events = [
    { date: new Date(), title: "Project Deadline", type: "Task", priority: "High" },
    { date: new Date(), title: "Rent Due", type: "Bill", priority: "Medium" },
    { date: new Date(Date.now() + 86400000 * 2), title: "Team Lunch", type: "Task", priority: "Low" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold text-primary">Calendar: Integrated View</h1>
        <p className="text-muted-foreground">Unified view of your tasks, bills, and commitments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 shadow-md border-primary/10">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md w-full"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between bg-primary/5 border-b">
            <CardTitle className="text-lg">
              Agenda: {date ? format(date, "MMMM d, yyyy") : "Select a date"}
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1 bg-white">
                <Circle className="w-2 h-2 fill-primary text-primary" /> Tasks
              </Badge>
              <Badge variant="outline" className="gap-1 bg-white">
                <Circle className="w-2 h-2 fill-accent text-accent" /> Bills
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {events.filter(e => date && format(e.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center">
                  <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium">No events scheduled for this day.</p>
                  <p className="text-sm">Enjoy your focused free time!</p>
                </div>
              ) : (
                events
                  .filter(e => date && format(e.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
                  .map((event, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border-l-4 transition-all hover:scale-[1.01] hover:shadow-sm cursor-pointer",
                        event.type === "Task" ? "border-l-primary bg-primary/5" : "border-l-accent bg-accent/5"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-lg text-white shadow-sm",
                        event.type === "Task" ? "bg-primary" : "bg-accent"
                      )}>
                        {event.type === "Task" ? <Clock className="w-5 h-5" /> : <CalendarIcon className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{event.title}</p>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{event.type}</p>
                      </div>
                      <Badge variant={event.priority === "High" ? "destructive" : "secondary"}>
                        {event.priority}
                      </Badge>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
