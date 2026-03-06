
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
  CheckCircle2,
  Info
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
          color: task.priority === 'Alta' ? 'bg-primary' : task.priority === 'Media' ? 'bg-accent' : 'bg-blue-400',
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

  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const goToToday = () => setCurrentDate(new Date());

  if (!mounted) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-3 uppercase tracking-tighter">
          <CalendarIcon className="w-8 h-8" />
          Agenda Semanal
        </h1>
        <p className="text-muted-foreground text-sm font-bold uppercase opacity-60">Tus objetivos sin complicaciones.</p>
      </div>

      <div className="flex items-center justify-between bg-white p-5 rounded-[2.5rem] border shadow-sm">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday} className="font-bold rounded-2xl uppercase text-[10px] h-9 px-4">Hoy</Button>
          <div className="flex items-center ml-2">
            <Button variant="ghost" size="icon" onClick={prevWeek} className="h-9 w-9 rounded-full"><ChevronLeft className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" onClick={nextWeek} className="h-9 w-9 rounded-full"><ChevronRight className="h-5 w-5" /></Button>
          </div>
          <h2 className="text-sm font-bold text-primary ml-3 uppercase tracking-tight">
            {format(currentDate, "MMMM yyyy", { locale: es })}
          </h2>
        </div>
        <Link href="/tasks">
          <Button size="sm" className="rounded-full gap-2 font-bold uppercase text-[10px] h-9 px-5 shadow-lg shadow-primary/20">
            <Plus className="w-3.5 h-3.5" /> Nueva Tarea
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((day, i) => {
          const dayEvents = calendarEvents.filter(event => isSameDay(event.displayDate, day));
          const isToday = isSameDay(day, new Date());
          
          return (
            <div key={i} className={cn(
              "flex flex-col min-h-[180px] bg-white rounded-[2.5rem] border shadow-sm overflow-hidden transition-all",
              isToday ? "ring-2 ring-primary ring-inset border-transparent shadow-xl scale-[1.02] z-10" : "border-muted/30"
            )}>
              <div className={cn(
                "p-4 border-b text-center",
                isToday ? "bg-primary text-white" : "bg-muted/5"
              )}>
                <p className="text-[9px] font-bold uppercase opacity-80 mb-1">{format(day, "eeee", { locale: es })}</p>
                <p className="text-2xl font-bold tracking-tighter">{format(day, "d")}</p>
              </div>
              
              <div className="flex-1 p-3 space-y-2 overflow-y-auto max-h-[300px] scrollbar-hide">
                {dayEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-10 mt-2">
                    <Info className="w-5 h-5" />
                    <p className="text-[8px] font-bold uppercase mt-1">Vacío</p>
                  </div>
                ) : (
                  dayEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      className={cn(
                        "w-full text-left p-2.5 rounded-2xl text-[9px] font-bold text-white shadow-sm transition-all hover:brightness-110 active:scale-95",
                        event.color,
                        (event.isCompleted || event.isPaid) && "opacity-30 grayscale line-through"
                      )}
                    >
                      <p className="line-clamp-2 leading-tight uppercase tracking-tight">{event.title}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-[3.5rem] h-auto pb-12 border-none shadow-2xl">
          {selectedEvent ? (
            <div className="max-w-md mx-auto space-y-8 pt-8 px-4">
              <SheetHeader>
                <div className="flex items-center gap-4 mb-2">
                   <div className={cn("w-5 h-5 rounded-full shadow-inner ring-4 ring-offset-2", selectedEvent.color)} />
                   <Badge className="rounded-lg uppercase font-bold text-[9px] tracking-widest">{selectedEvent.type}</Badge>
                </div>
                <SheetTitle className="text-3xl font-bold uppercase tracking-tighter leading-none">
                  {selectedEvent.title}
                </SheetTitle>
                <SheetDescription className="font-bold text-primary uppercase text-xs tracking-widest mt-4 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  {selectedEvent.displayDate && format(selectedEvent.displayDate, "EEEE d 'de' MMMM", { locale: es })}
                </SheetDescription>
              </SheetHeader>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="w-full text-destructive border-destructive/20 hover:bg-destructive/5 rounded-3xl font-bold uppercase text-[10px] h-14"
                  onClick={() => {
                    const path = selectedEvent.type === 'task' ? 'tasks' : 'bills';
                    const docRef = doc(firestore!, "users", user!.uid, path, selectedEvent.id);
                    deleteDocumentNonBlocking(docRef);
                    setIsSheetOpen(false);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                </Button>
                <Button 
                  className="w-full rounded-3xl font-bold uppercase text-[10px] h-14 shadow-xl shadow-primary/20"
                  onClick={() => {
                    const path = selectedEvent.type === 'task' ? 'tasks' : 'bills';
                    const docRef = doc(firestore!, "users", user!.uid, path, selectedEvent.id);
                    updateDocumentNonBlocking(docRef, selectedEvent.type === 'task' 
                      ? { status: 'Completada', isCompleted: true, updatedAt: new Date().toISOString() } 
                      : { paymentStatus: 'Pagado', isPaid: true, updatedAt: new Date().toISOString() }
                    );
                    setIsSheetOpen(false);
                  }}
                  disabled={selectedEvent.isCompleted || selectedEvent.isPaid}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {selectedEvent.isCompleted || selectedEvent.isPaid ? "Hecho" : "Completar"}
                </Button>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
