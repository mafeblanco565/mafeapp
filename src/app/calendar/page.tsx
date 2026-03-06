
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
  ChevronRight,
  Trash2,
  Clock,
  Loader2
} from "lucide-react";
import { 
  format, 
  startOfWeek, 
  addDays, 
  isSameDay,
  parseISO,
  getHours,
  getMinutes,
  isValid,
  startOfToday
} from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { 
  useFirestore, 
  useUser, 
  useCollection, 
  useMemoFirebase,
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking 
} from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription
} from "@/components/ui/sheet";
import Link from "next/link";

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // De 7 AM a 10 PM

export default function CalendarPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tasksQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, "users", user.uid, "tasks");
  }, [firestore, user]);

  const billsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, "users", user.uid, "bills");
  }, [firestore, user]);

  const { data: tasks } = useCollection(tasksQuery);
  const { data: bills } = useCollection(billsQuery);

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Empieza el lunes
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate]);

  const safeParseDate = (dateVal: any) => {
    if (!dateVal) return null;
    if (typeof dateVal === 'string') {
      const parsed = parseISO(dateVal);
      return isValid(parsed) ? parsed : null;
    }
    if (dateVal.seconds) {
      return new Date(dateVal.seconds * 1000);
    }
    return null;
  };

  const calendarEvents = useMemo(() => {
    const events: any[] = [];
    tasks?.forEach(task => {
      const date = safeParseDate(task.dueDate);
      if (date) {
        events.push({
          ...task,
          type: 'task',
          date,
          color: task.priority === 'Alta' ? 'bg-red-500' : task.priority === 'Media' ? 'bg-orange-400' : 'bg-blue-400',
          title: task.title
        });
      }
    });
    bills?.forEach(bill => {
      const date = safeParseDate(bill.dueDate);
      if (date) {
        events.push({
          ...bill,
          type: 'bill',
          date,
          color: 'bg-emerald-500',
          title: `Factura: ${bill.name}`
        });
      }
    });
    return events;
  }, [tasks, bills]);

  const monthName = mounted ? format(currentDate, "MMMM yyyy", { locale: es }) : "";

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsSheetOpen(true);
  };

  const goToToday = () => setCurrentDate(new Date());
  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));

  const handleDeleteEvent = () => {
    if (!selectedEvent || !user || !firestore) return;
    const path = selectedEvent.type === 'task' ? 'tasks' : 'bills';
    const docRef = doc(firestore, "users", user.uid, path, selectedEvent.id);
    deleteDocumentNonBlocking(docRef);
    setIsSheetOpen(false);
  };

  const handleUpdateStatus = (status: string) => {
    if (!selectedEvent || !user || !firestore) return;
    const path = selectedEvent.type === 'task' ? 'tasks' : 'bills';
    const docRef = doc(firestore, "users", user.uid, path, selectedEvent.id);
    updateDocumentNonBlocking(docRef, selectedEvent.type === 'task' ? { status, isCompleted: status === 'Completada' } : { paymentStatus: status, isPaid: status === 'Pagado' });
    setIsSheetOpen(false);
  };

  if (!mounted) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white overflow-hidden rounded-2xl shadow-xl border animate-in fade-in duration-500">
      <div className="flex flex-col border-b bg-muted/5">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday} className="font-bold">Hoy</Button>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={prevWeek}><ChevronLeft className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" onClick={nextWeek}><ChevronRight className="h-5 w-5" /></Button>
            </div>
            <h2 className="text-lg font-bold text-primary ml-2 uppercase tracking-tight">
              {monthName}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/tasks">
              <Button size="sm" className="rounded-full gap-2">
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Añadir Tarea</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-7 border-t border-b bg-background">
          <div className="w-12 border-r bg-muted/5" />
          {weekDays.map((day, i) => (
            <div key={i} className={cn(
              "flex flex-col items-center py-3 border-r last:border-r-0",
              isSameDay(day, new Date()) ? "bg-primary/5 text-primary" : ""
            )}>
              <span className="text-[10px] font-bold uppercase text-muted-foreground">{format(day, "eee", { locale: es })}</span>
              <span className={cn(
                "text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full mt-1",
                isSameDay(day, new Date()) ? "bg-primary text-white" : ""
              )}>{format(day, "d")}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto relative bg-white">
        <div className="flex min-w-[700px] h-full">
          <div className="w-12 border-r bg-muted/5 sticky left-0 z-20">
            {HOURS.map((hour) => (
              <div key={hour} className="h-20 border-b text-[9px] text-muted-foreground flex items-start justify-center pt-2 font-bold uppercase">
                {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
            ))}
          </div>

          <div className="flex-1 grid grid-cols-7 relative">
            <div className="absolute inset-0 grid grid-rows-[repeat(16,minmax(0,1fr))] pointer-events-none">
              {HOURS.map((hour) => (
                <div key={hour} className="border-b border-muted/20 w-full h-20" />
              ))}
            </div>
            
            {weekDays.map((day, i) => (
              <div key={i} className="border-r border-muted/10 relative last:border-r-0 h-full">
                {calendarEvents
                  .filter(event => isSameDay(event.date, day))
                  .map((event) => {
                    const hour = getHours(event.date);
                    const minute = getMinutes(event.date);
                    if (hour < 7 || hour > 22) return null;
                    return (
                      <div
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        className={cn(
                          "absolute left-1 right-1 p-2 rounded-lg text-[10px] font-bold text-white shadow-sm overflow-hidden cursor-pointer transition-all hover:scale-[1.03] z-10",
                          event.color
                        )}
                        style={{
                          top: `${(hour - 7) * 5 + (minute / 60) * 5}rem`,
                          height: `3rem`,
                        }}
                      >
                        <div className="flex flex-col h-full justify-between">
                          <span className="truncate leading-tight">{event.title}</span>
                          <span className="text-[8px] opacity-90">{format(event.date, 'HH:mm')}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl h-[50vh]">
          {selectedEvent ? (
            <div className="max-w-md mx-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-2xl font-bold">
                  <div className={cn("w-4 h-4 rounded-full", selectedEvent.color)} />
                  {selectedEvent.title}
                </SheetTitle>
                <SheetDescription>
                  Gestión de evento programado
                </SheetDescription>
              </SheetHeader>

              <div className="py-8 space-y-6">
                <div className="flex items-center gap-4 text-sm bg-muted/30 p-4 rounded-2xl">
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">Horario</p>
                    <p className="text-muted-foreground">
                      {selectedEvent.date && format(selectedEvent.date, "PPPP 'a las' p", { locale: es })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="w-full text-destructive border-destructive/20 hover:bg-destructive/5 rounded-xl h-12 font-bold"
                    onClick={handleDeleteEvent}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                  </Button>
                  {selectedEvent.type === 'task' ? (
                    <Button 
                      className="w-full rounded-xl h-12 font-bold"
                      onClick={() => handleUpdateStatus('Completada')}
                      disabled={selectedEvent.status === 'Completada'}
                    >
                      Completada
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl h-12 font-bold"
                      onClick={() => handleUpdateStatus('Pagado')}
                      disabled={selectedEvent.paymentStatus === 'Pagado'}
                    >
                      Pagada
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
