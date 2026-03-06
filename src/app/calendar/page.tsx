
"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  Calendar as CalendarIcon, 
  Target, 
  Search, 
  Plus, 
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { 
  format, 
  startOfWeek, 
  addDays, 
  startOfDay,
  addHours,
  isSameDay
} from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Datos de ejemplo con horas y duraciones
const demoEvents = [
  { id: "1", dayOffset: 0, startHour: 9, duration: 1.5, title: "Ice Hockey", color: "bg-[#B39DDB]" },
  { id: "2", dayOffset: 1, startHour: 7, duration: 1, title: "Holiday", color: "bg-[#FF8A80]" },
  { id: "3", dayOffset: 1, startHour: 15, duration: 2, title: "Presentation", color: "bg-[#64B5F6]" },
  { id: "4", dayOffset: 2, startHour: 10, duration: 1.5, title: "Report", color: "bg-[#B39DDB]" },
  { id: "5", dayOffset: 2, startHour: 14, duration: 1, title: "Lunch John", color: "bg-[#FF8A80]" },
  { id: "6", dayOffset: 2, startHour: 18, duration: 3, title: "Evening show", color: "bg-[#E57373]" },
  { id: "7", dayOffset: 3, startHour: 9, duration: 2, title: "Journal club", color: "bg-[#FF8A80]" },
  { id: "8", dayOffset: 3, startHour: 12, duration: 1.5, title: "Massage", color: "bg-[#E57373]" },
  { id: "9", dayOffset: 3, startHour: 18, duration: 1.5, title: "Football", color: "bg-[#81C784]" },
  { id: "10", dayOffset: 4, startHour: 7, duration: 1, title: "Elections", color: "bg-[#FF8A80]" },
  { id: "11", dayOffset: 4, startHour: 10, duration: 1, title: "Tournament prep", color: "bg-[#64B5F6]" },
  { id: "12", dayOffset: 4, startHour: 15, duration: 1, title: "Repair bicycle", color: "bg-[#FF8A80]" },
  { id: "13", dayOffset: 4, startHour: 17, duration: 2, title: "Basketball", color: "bg-[#FF8A80]" },
  { id: "14", dayOffset: 6, startHour: 9, duration: 2, title: "Brunch", color: "bg-[#E1BEE7]" },
  { id: "15", dayOffset: 6, startHour: 13, duration: 1.5, title: "Contest", color: "bg-[#BBDEFB]" },
];

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // De 7 AM a 10 PM

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 }); // Domingo
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate]);

  const weekNumber = format(currentDate, "I");
  const monthName = format(currentDate, "MMMM yyyy", { locale: es });

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] lg:h-screen bg-white overflow-hidden animate-in fade-in duration-500">
      {/* Header estilo imagen adjunta */}
      <div className="flex flex-col border-b">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-9 w-12 rounded-none border-gray-300">
              <Check className="w-5 h-5 text-gray-600" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-12 rounded-none border-gray-300 bg-blue-50 border-blue-400">
              <CalendarIcon className="w-5 h-5 text-blue-500" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-12 rounded-none border-gray-300">
              <Target className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
          
          <div className="text-gray-500 text-sm font-medium">
            {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400">
              <MoreVertical className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-red-400">
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Semana y Navegación */}
        <div className="flex items-center bg-[#F5F5F5] border-t border-b py-0.5 px-4 text-[10px] text-gray-400 uppercase font-bold">
          <div className="w-12 text-left">Week {weekNumber}</div>
          <div className="flex-1 flex justify-around">
            {weekDays.map((day, i) => (
              <div key={i} className={cn(
                "flex flex-col items-center py-1 flex-1",
                i === 0 && "text-red-500"
              )}>
                <span>{format(day, "eee d", { locale: es })}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid del Calendario */}
      <div className="flex-1 overflow-auto relative">
        <div className="flex min-w-[700px] h-full">
          {/* Columna de Horas */}
          <div className="w-12 border-r bg-[#F9F9F9] sticky left-0 z-10">
            {HOURS.map((hour) => (
              <div key={hour} className="h-16 border-b text-[10px] text-gray-400 flex items-start justify-center pt-1 font-bold">
                {hour > 12 ? hour - 12 : hour}
              </div>
            ))}
          </div>

          {/* Columnas de Días */}
          <div className="flex-1 grid grid-cols-7 relative">
            {/* Líneas de fondo */}
            <div className="absolute inset-0 grid grid-rows-[repeat(16,minmax(0,1fr))] pointer-events-none">
              {HOURS.map((hour) => (
                <div key={hour} className="border-b border-gray-100 w-full" />
              ))}
            </div>
            
            {/* Columnas verticales */}
            {weekDays.map((_, i) => (
              <div key={i} className="border-r border-gray-100 relative last:border-r-0">
                {/* Eventos de este día */}
                {demoEvents.filter(e => e.dayOffset === i).map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "absolute left-0.5 right-0.5 p-1 rounded-sm text-[10px] font-bold text-white shadow-sm overflow-hidden",
                      event.color
                    )}
                    style={{
                      top: `${(event.startHour - 7) * 4}rem`,
                      height: `${event.duration * 4}rem`,
                    }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selector de Mes (Flotante) */}
      <div className="fixed bottom-24 right-4 flex flex-col gap-2 lg:hidden">
        <Button 
          size="icon" 
          className="rounded-full shadow-xl bg-white text-primary border"
          onClick={() => setCurrentDate(addDays(currentDate, -7))}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button 
          size="icon" 
          className="rounded-full shadow-xl bg-white text-primary border"
          onClick={() => setCurrentDate(addDays(currentDate, 7))}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
