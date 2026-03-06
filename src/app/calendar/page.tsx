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
  ChevronLeft,
  ChevronRight,
  MapPin,
  Tag
} from "lucide-react";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Datos de ejemplo para visualizar
const demoEvents = [
  { id: "1", date: new Date(), title: "Entrega de Proyecto", type: "Trabajo", priority: "Alta", time: "09:00 AM", location: "Oficina" },
  { id: "2", date: new Date(), title: "Pago de Alquiler", type: "Finanzas", priority: "Media", time: "12:00 PM", location: "App Banco" },
  { id: "3", date: new Date(Date.now() + 86400000), title: "Cena con Equipo", type: "Social", priority: "Baja", time: "08:30 PM", location: "Restaurante Central" },
  { id: "4", date: new Date(Date.now() + 86400000 * 2), title: "Gimnasio", type: "Salud", priority: "Media", time: "07:00 AM", location: "Smart Fit" },
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const dayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return demoEvents.filter(event => isSameDay(event.date, selectedDate));
  }, [selectedDate]);

  return (
    <div className="flex flex-col gap-4 pb-20 lg:pb-8 animate-in fade-in slide-in-from-bottom-2 duration-500 h-full">
      {/* Encabezado optimizado para móvil */}
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
            <CalendarIcon className="w-6 h-6" />
            Agenda Personal
          </h1>
          <p className="text-sm text-muted-foreground">Gestiona tu tiempo hoy.</p>
        </div>
        <Button size="icon" className="rounded-full shadow-lg bg-primary">
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 h-full">
        {/* Vista del Calendario - Protagonista en móvil */}
        <Card className="border-none shadow-sm bg-card overflow-hidden">
          <CardContent className="p-2 sm:p-4 flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={es}
              className="w-full max-w-md border-none"
              classNames={{
                months: "w-full",
                month: "w-full space-y-4",
                table: "w-full border-collapse space-y-1",
                head_cell: "text-muted-foreground rounded-md w-full font-bold text-[0.8rem] uppercase",
                cell: "w-full text-center text-sm p-0 relative focus-within:z-20",
                day: cn(
                  "h-12 w-full p-0 font-medium aria-selected:opacity-100 hover:bg-secondary rounded-lg transition-colors flex items-center justify-center"
                ),
                day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary",
                day_today: "bg-accent/20 text-accent font-bold border border-accent/30",
              }}
            />
          </CardContent>
        </Card>

        {/* Detalle del día seleccionado */}
        <div className="space-y-4 px-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              {selectedDate ? format(selectedDate, "EEEE, d 'de' MMMM", { locale: es }) : "Selecciona un día"}
            </h2>
            <Badge variant="secondary" className="font-bold">
              {dayEvents.length} {dayEvents.length === 1 ? 'evento' : 'eventos'}
            </Badge>
          </div>

          <div className="space-y-3">
            {dayEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-muted/20 rounded-2xl border-2 border-dashed border-muted/50 text-muted-foreground text-center px-6">
                <CalendarIcon className="w-12 h-12 mb-3 opacity-20" />
                <p className="font-semibold">Día libre de compromisos</p>
                <p className="text-xs mt-1">Usa este tiempo para descansar o planificar tu semana.</p>
              </div>
            ) : (
              dayEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                  <div className={cn(
                    "flex items-stretch gap-4 p-4",
                    event.priority === "Alta" ? "bg-red-50/50" : event.priority === "Media" ? "bg-orange-50/50" : "bg-blue-50/50"
                  )}>
                    <div className={cn(
                      "w-1.5 rounded-full",
                      event.priority === "Alta" ? "bg-red-500" : event.priority === "Media" ? "bg-orange-500" : "bg-blue-500"
                    )} />
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-base text-foreground">{event.title}</p>
                        <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {event.type}
                        </span>
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
