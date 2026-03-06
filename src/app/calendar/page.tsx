
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
  isValid
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

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // De 7 AM a 10 PM

export default function CalendarPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    setToday(new Date());
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
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate]);

  const calendarEvents = useMemo(() => {
    const events: any[] = [];
    tasks?.forEach(task => {
      let date = new Date();
      try {
        const parsed = task.dueDate ? (typeof task.dueDate === 'string' ? parseISO(task.dueDate) : new Date(task.dueDate.seconds * 1000)) : new Date();
        if (isValid(parsed)) date = parsed;
      } catch (e) {}
      
      events.push({
        ...task,
        type: 'task',
        date,
        color: task.priority === 'Alta' ? 'bg-red-500' : task.priority === 'Media' ? 'bg-orange-400' : 'bg-blue-400',
        title: task.title
      });
    });
    bills?.forEach(bill => {
      let date = new Date();
      try {
        const parsed = bill.dueDate ? (typeof bill.dueDate === 'string' ? parseISO(bill.dueDate) : new Date(bill.dueDate.seconds * 1000)) : new Date();
        if (isValid(parsed)) date = parsed;
      } catch (e) {}

      events.push({
        ...bill,
        type: 'bill',
        date,
        color: 'bg-emerald-500',
        title: `Factura: ${bill.name} ($${bill.amount})`
      });
    });
    return events;
  }, [tasks, bills]);

  const weekNumber = mounted ? format(currentDate, "I") : "";
  const monthName = mounted ? format(currentDate, "MMMM yyyy", { locale: es }) : "";

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsSheetOpen(true);
  };

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

  if (!mounted || !today) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] lg:h-screen bg-white overflow-hidden animate-in fade-in duration-500">
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
          
          <div className="text-gray-500 text-sm font-bold uppercase tracking-wider">
            {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400">
              <MoreVertical className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:text-red-600">
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <div className="flex items-center bg-[#F5F5F5] border-t border-b py-0.5 px-4 text-[10px] text-gray-400 uppercase font-bold">
          <div className="w-12 text-left">Sem {weekNumber}</div>
          <div className="flex-1 flex justify-around">
            {weekDays.map((day, i) => (
              <div key={i} className={cn(
                "flex flex-col items-center py-1 flex-1",
                format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') ? "text-blue-600" : (i === 0 ? "text-red-500" : "")
              )}>
                <span>{format(day, "eee d", { locale: es })}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto relative bg-[#fafafa]">
        <div className="flex min-w-[700px] h-full">
          <div className="w-12 border-r bg-[#F9F9F9] sticky left-0 z-20">
            {HOURS.map((hour) => (
              <div key={hour} className="h-20 border-b text-[10px] text-gray-400 flex items-start justify-center pt-1 font-bold">
                {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
            ))}
          </div>

          <div className="flex-1 grid grid-cols-7 relative">
            <div className="absolute inset-0 grid grid-rows-[repeat(16,minmax(0,1fr))] pointer-events-none">
              {HOURS.map((hour) => (
                <div key={hour} className="border-b border-gray-100 w-full h-20" />
              ))}
            </div>
            
            {weekDays.map((day, i) => (
              <div key={i} className="border-r border-gray-100 relative last:border-r-0">
                {calendarEvents
                  .filter(event => isSameDay(event.date, day))
                  .map((event) => {
                    const hour = getHours(event.date);
                    const minute = getMinutes(event.date);
                    if (hour < 7 || hour > 22 || isNaN(hour)) return null;
                    return (
                      <div
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        className={cn(
                          "absolute left-1 right-1 p-1.5 rounded-sm text-[10px] font-bold text-white shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] z-10",
                          event.color
                        )}
                        style={{
                          top: `${(hour - 7) * 5 + (minute / 60) * 5}rem`,
                          height: `3rem`,
                        }}
                      >
                        <div className="flex flex-col h-full justify-between">
                          <span className="truncate">{event.title}</span>
                          <span className="text-[8px] opacity-80">{format(event.date, 'HH:mm')}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-24 right-4 flex flex-col gap-2 z-30">
        <Button 
          size="icon" 
          className="rounded-full shadow-xl bg-white text-primary border h-12 w-12 hover:bg-secondary"
          onClick={() => setCurrentDate(addDays(currentDate, -7))}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button 
          size="icon" 
          className="rounded-full shadow-xl bg-white text-primary border h-12 w-12 hover:bg-secondary"
          onClick={() => setCurrentDate(addDays(currentDate, 7))}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl h-[60vh]">
          {selectedEvent ? (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", selectedEvent.color)} />
                  {selectedEvent.title}
                </SheetTitle>
                <SheetDescription>
                  Detalles de la {selectedEvent.type === 'task' ? 'tarea' : 'factura'} programada.
                </SheetDescription>
              </SheetHeader>

              <div className="py-6 space-y-6">
                <div className="flex items-center gap-4 text-sm">
                  <div className="p-2 bg-muted rounded-full">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Fecha y Hora</p>
                    <p className="text-muted-foreground">
                      {selectedEvent.date && isValid(selectedEvent.date) && format(selectedEvent.date, "PPPP 'a las' p", { locale: es })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full text-destructive hover:bg-destructive/10 border-destructive/20"
                    onClick={handleDeleteEvent}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                  </Button>
                  {selectedEvent.type === 'task' ? (
                    <Button 
                      className="w-full"
                      onClick={() => handleUpdateStatus('Completada')}
                      disabled={selectedEvent.status === 'Completada'}
                    >
                      Marcar como Hecha
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleUpdateStatus('Pagado')}
                      disabled={selectedEvent.paymentStatus === 'Pagado'}
                    >
                      Marcar como Pagada
                    </Button>
                  )}
                </div>
              </div>
            </>
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
