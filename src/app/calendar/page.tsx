"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  Clock,
  Plus,
  MapPin,
  Tag,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday, startOfWeek, endOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Datos de ejemplo para visualizar
const demoEvents = [
  { id: "1", date: new Date(), title: "Entrega de Proyecto", type: "Trabajo", priority: "Alta", time: "09:00 AM", location: "Oficina" },
  { id: "2", date: new Date(), title: "Pago de Alquiler", type: "Finanzas", priority: "Media", time: "12:00 PM", location: "App Banco" },
  { id: "3", date: new Date(Date.now() + 86400000), title: "Cena con Equipo", type: "Social", priority: "Baja", time: "08:30 PM", location: "Restaurante Central" },
  { id: "4", date: new Date(Date.now() + 86400000 * 2), title: "Gimnasio", type: "Salud", priority: "Media", time: "07:00 AM", location: "Smart Fit" },
  { id: "5", date: new Date(Date.now() - 86400000), title: "Revisión Médica", type: "Salud", priority: "Alta", time: "10:30 AM", location: "Clínica San José" },
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const dayEvents = useMemo(() => {
    return demoEvents.filter(event => isSameDay(event.date, selectedDate));
  }, [selectedDate]);

  // Función para renderizar los indicadores de eventos en el calendario
  const renderDayWithEvents = (day: Date) => {
    const hasEvents = demoEvents.some(event => isSameDay(event.date, day));
    if (!hasEvents) return null;

    return (
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
        <div className="w-1 h-1 rounded-full bg-primary" />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] lg:h-full animate-in fade-in duration-500 overflow-hidden">
      {/* Encabezado estilo Google Calendar */}
      <div className="flex items-center justify-between p-4 bg-background border-b sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            {format(currentMonth, "MMMM yyyy", { locale: es }).toUpperCase()}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              const now = new Date();
              setCurrentMonth(now);
              setSelectedDate(now);
            }}
            className="hidden sm:flex"
          >
            Hoy
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
          <Button size="icon" className="rounded-full bg-primary ml-2 shadow-lg">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Vista del Calendario - Ocupa la parte superior en móvil */}
        <div className="w-full lg:w-3/5 p-4 border-b lg:border-b-0 lg:border-r bg-card/50 overflow-y-auto">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            locale={es}
            className="w-full p-0 flex justify-center"
            classNames={{
              months: "w-full",
              month: "w-full space-y-4",
              caption: "hidden", // Ocultamos el caption original porque tenemos el nuestro arriba
              table: "w-full border-collapse",
              head_row: "flex w-full mb-2",
              head_cell: "text-muted-foreground rounded-md w-full font-bold text-[0.7rem] uppercase text-center",
              row: "flex w-full mt-1",
              cell: "w-full text-center text-sm p-0 relative focus-within:z-20",
              day: cn(
                "h-14 w-full p-0 font-medium hover:bg-secondary rounded-xl transition-all flex flex-col items-center justify-center relative border-2 border-transparent"
              ),
              day_selected: "bg-primary/10 !border-primary text-primary font-bold !opacity-100",
              day_today: "text-primary ring-2 ring-primary/20",
              day_outside: "text-muted-foreground/30 opacity-50",
            }}
            components={{
              DayContent: ({ date }) => (
                <div className="relative w-full h-full flex flex-col items-center justify-center pt-1">
                  <span className={cn(
                    "text-sm",
                    isToday(date) && "w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center font-bold"
                  )}>
                    {date.getDate()}
                  </span>
                  {renderDayWithEvents(date)}
                </div>
              ),
            }}
          />
        </div>

        {/* Detalle del día seleccionado - Lista de eventos */}
        <div className="flex-1 flex flex-col bg-background/50 overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-10">
            <h2 className="font-bold text-lg flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-widest">
                {format(selectedDate, "EEEE", { locale: es })}
              </span>
              <span>{format(selectedDate, "d 'de' MMMM", { locale: es })}</span>
            </h2>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold">
              {dayEvents.length} Eventos
            </Badge>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
            {dayEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                  <CalendarIcon className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <p className="font-bold text-muted-foreground">No hay nada programado</p>
                <p className="text-sm text-muted-foreground/60 max-w-[200px] mt-1">
                  Toca el botón "+" para añadir tu primera tarea o evento hoy.
                </p>
              </div>
            ) : (
              dayEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all active:scale-[0.98] bg-white">
                  <div className="flex items-stretch gap-0 h-24">
                    <div className={cn(
                      "w-2",
                      event.priority === "Alta" ? "bg-red-500" : event.priority === "Media" ? "bg-orange-500" : "bg-blue-500"
                    )} />
                    
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-base leading-tight">{event.title}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 font-medium">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-auto">
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-5 border-muted-foreground/20 text-muted-foreground bg-muted/20">
                          {event.type}
                        </Badge>
                        <Badge variant="outline" className={cn(
                          "text-[10px] py-0 px-1.5 h-5 border-none font-bold",
                          event.priority === "Alta" ? "bg-red-100 text-red-600" : event.priority === "Media" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                        )}>
                          {event.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
