"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2,
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isFuture, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { 
  useFirestore, 
  useUser, 
  useCollection, 
  useMemoFirebase,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking 
} from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TasksPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [newTitle, setNewTitle] = useState("");
  const [priority, setPriority] = useState("Media");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const tasksQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, "users", user.uid, "tasks");
  }, [firestore, user]);

  const { data: tasks, isLoading } = useCollection(tasksQuery);

  const addTask = () => {
    if (!newTitle.trim() || !user || !firestore || !date) return;
    const colRef = collection(firestore, "users", user.uid, "tasks");
    
    // Forzamos el almacenamiento como string ISO para consistencia
    addDocumentNonBlocking(colRef, {
      userId: user.uid,
      title: newTitle.trim(),
      description: "",
      dueDate: date.toISOString(),
      priority,
      status: "Pendiente",
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setNewTitle("");
    setDate(new Date());
  };

  const toggleTask = (id: string, currentStatus: boolean) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, "users", user.uid, "tasks", id);
    updateDocumentNonBlocking(docRef, { 
      isCompleted: !currentStatus,
      status: !currentStatus ? "Completada" : "Pendiente",
      updatedAt: new Date().toISOString()
    });
  };

  const removeTask = (id: string) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, "users", user.uid, "tasks", id);
    deleteDocumentNonBlocking(docRef);
  };

  const priorityColors = {
    Alta: "text-red-600 bg-red-50 border-red-100",
    Media: "text-orange-600 bg-orange-50 border-orange-100",
    Baja: "text-blue-600 bg-blue-50 border-blue-100",
  };

  const safeParseDate = (dateVal: any) => {
    if (!dateVal) return new Date();
    if (typeof dateVal === 'string') {
      const d = parseISO(dateVal);
      return isValid(d) ? d : new Date();
    }
    if (dateVal && typeof dateVal === 'object' && 'seconds' in dateVal) {
      return new Date(dateVal.seconds * 1000);
    }
    return new Date();
  };

  const filteredTasks = (filter: string) => {
    if (!tasks) return [];
    switch(filter) {
      case "today": return tasks.filter((t: any) => isToday(safeParseDate(t.dueDate)));
      case "upcoming": return tasks.filter((t: any) => isFuture(safeParseDate(t.dueDate)) && !t.isCompleted);
      case "completed": return tasks.filter((t: any) => t.isCompleted);
      default: return tasks;
    }
  };

  if (!mounted) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold text-primary">Tareas</h1>
        <p className="text-muted-foreground">Gestiona tus objetivos diarios y mantén el enfoque.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-primary">Añadir Nueva</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input 
                  placeholder="¿Qué tienes que hacer?" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                />
              </div>
              
              <div className="space-y-2">
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alta">Prioridad Alta</SelectItem>
                    <SelectItem value="Media">Prioridad Media</SelectItem>
                    <SelectItem value="Baja">Prioridad Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal h-10 border-input bg-background">
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                      {date ? format(date, "d 'de' MMM, yyyy", { locale: es }) : "Elegir fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button className="w-full gap-2 font-bold shadow-sm" onClick={addTask} disabled={!newTitle.trim()}>
                <Plus className="w-4 h-4" /> Crear Tarea
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg">Todas</TabsTrigger>
              <TabsTrigger value="today" className="rounded-lg">Hoy</TabsTrigger>
              <TabsTrigger value="upcoming" className="rounded-lg">Próximas</TabsTrigger>
              <TabsTrigger value="completed" className="rounded-lg">Hechas</TabsTrigger>
            </TabsList>

            {["all", "today", "upcoming", "completed"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0 space-y-3">
                {isLoading ? (
                  <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm font-medium">Buscando tus tareas...</p>
                  </div>
                ) : filteredTasks(tab).length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-16 text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed">
                    <AlertCircle className="w-10 h-10 mb-3 opacity-20" />
                    <p className="font-medium text-sm">No hay tareas en esta sección.</p>
                  </div>
                ) : (
                  filteredTasks(tab).map((task: any) => (
                    <Card key={task.id} className={cn(
                      "group transition-all hover:shadow-md cursor-pointer border-l-4",
                      task.isCompleted ? "opacity-60 border-l-muted" : 
                      task.priority === 'Alta' ? "border-l-red-500" :
                      task.priority === 'Media' ? "border-l-orange-400" : "border-l-blue-400"
                    )}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <button 
                          onClick={() => toggleTask(task.id, task.isCompleted)}
                          className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                            task.isCompleted ? "bg-green-500 border-green-500 text-white" : "border-muted-foreground hover:border-primary"
                          )}
                        >
                          {task.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <h3 className={cn("font-bold text-sm truncate", task.isCompleted && "line-through text-muted-foreground")}>
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-bold">
                              <CalendarIcon className="w-3 h-3" />
                              {format(safeParseDate(task.dueDate), "d 'de' MMM", { locale: es })}
                            </span>
                            <Badge variant="outline" className={cn(
                              "text-[9px] px-2 py-0 h-4 border font-bold uppercase tracking-wider",
                              priorityColors[task.priority as keyof typeof priorityColors]
                            )}>
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="opacity-0 group-hover:opacity-100 text-destructive h-8 w-8 transition-opacity"
                          onClick={() => removeTask(task.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
