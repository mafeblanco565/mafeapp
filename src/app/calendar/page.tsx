
"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Loader2,
  Trash2,
  CheckCircle2
} from "lucide-react";
import { 
  format, 
  startOfWeek, 
  addDays, 
  isSameDay,
  parseISO,
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
import Link from "next/link";

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
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate]);

  const safeParseDate = (dateVal: any) => {
    if (!dateVal) return null;
    if (typeof dateVal === 'string') {
      const parsed = parseISO(dateVal);
      return isValid(parsed) ? parsed : null;
    }
    if (dateVal && typeof dateVal === 'object' && 'seconds' in dateVal) {
      return new Date(dateVal.seconds * 1000);
    }
    if (dateVal instanceof Date) {
      return isValid(dateVal) ? dateVal : null;
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
          displayDate: date,
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
          displayDate: date,
          color: 'bg-emerald-500',
          title: `Factura: ${bill.name}`
        });
      }
    });
    return events;
  }, [tasks, bills]);

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
    updateDocumentNonBlocking(docRef, selectedEvent.type === 'task' 
      ? { status, isCompleted: status === 'Completada', updatedAt: new Date().toISOString() } 
      : { paymentStatus: status, isPaid: status === 'Pagado', updatedAt: new Date().toISOString() }
    );
    setIsSheetOpen(false);
  };

  if (!mounted) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2 uppercase">
          <CalendarIcon className="w-8 h-8" />
          Agenda Semanal
        </h1>
        <p className="text-muted-foreground text-sm font-bold">Tus compromisos diarios de un vistazo.</p>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-3xl border-none shadow-sm">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday} className="font-bold rounded-xl uppercase text-xs">Hoy</Button>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={prevWeek}><ChevronLeft className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" onClick={nextWeek}><ChevronRight className="h-5 w-5" /></Button>
          </div>
          <h2 className="text-md font-bold text-primary ml-2 uppercase tracking-tight">
            {format(currentDate, "MMMM yyyy", { locale: es })}
          </h2>
        </div>
        <Link href="/tasks">
          <Button size="sm" className="rounded-full gap-2 font-bold uppercase text-xs">
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Nueva Tarea</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((day, i) => {
          const dayEvents = calendarEvents.filter(event => isSameDay(event.displayDate, day));
          const isToday = isSameDay(day, new Date());
          
          return (
            <div key={i} className={cn(
              "flex flex-col min-h-[140px] bg-white rounded-2xl border-none shadow-sm overflow-hidden transition-all",
              isToday ? "ring-2 ring-primary ring-inset" : ""
            )}>
              <div className={cn(
                "p-2 border-b text-center",
                isToday ? "bg-primary text-white" : "bg-muted/10"
              )}>
                <p className="text-[10px] font-bold uppercase opacity-80">{format(day, "eee", { locale: es })}</p>
                <p className="text-lg font-bold">{format(day, "d")}</p>
              </div>
              
              <div className="flex-1 p-2 space-y-1.5 overflow-y-auto max-h-[220px]">
                {dayEvents.length === 0 ? (
                  <p className="text-[9px] text-center text-muted-foreground mt-4 italic opacity-40 font-bold uppercase">Sin planes</p>
                ) : (
                  dayEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      className={cn(
                        "p-2 rounded-xl text-[9px] font-bold text-white shadow-sm cursor-pointer transition-transform hover:scale-[1.03] active:scale-95",
                        event.color,
                        (event.isCompleted || event.isPaid) && "opacity-40 grayscale-[0.5] line-through"
                      )}
                    >
                      <p className="line-clamp-2 leading-tight uppercase">{event.title}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-[3rem] h-[45vh] border-none shadow-2xl">
          {selectedEvent ? (
            <div className="max-w-md mx-auto space-y-6 pt-4">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-xl font-bold uppercase">
                  <div className={cn("w-3 h-3 rounded-full", selectedEvent.color)} />
                  {selectedEvent.title}
                </SheetTitle>
                <SheetDescription className="font-bold text-primary uppercase text-xs">
                  {selectedEvent.displayDate && format(selectedEvent.displayDate, "EEEE d 'de' MMMM", { locale: es })}
                </SheetDescription>
              </SheetHeader>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="w-full text-destructive border-destructive/20 hover:bg-destructive/5 rounded-2xl font-bold uppercase text-xs h-12"
                  onClick={handleDeleteEvent}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                </Button>
                {selectedEvent.type === 'task' ? (
                  <Button 
                    className="w-full rounded-2xl font-bold uppercase text-xs h-12"
                    onClick={() => handleUpdateStatus('Completada')}
                    disabled={selectedEvent.isCompleted}
                  >
                    {selectedEvent.isCompleted ? <CheckCircle2 className="w-4 h-4 mr-2" /> : "Marcar Hecha"}
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-bold uppercase text-xs h-12"
                    onClick={() => handleUpdateStatus('Pagado')}
                    disabled={selectedEvent.isPaid}
                  >
                    {selectedEvent.isPaid ? <CheckCircle2 className="w-4 h-4 mr-2" /> : "Marcar Pagada"}
                  </Button>
                )}
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
