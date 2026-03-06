
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
    addDocumentNonBlocking(colRef, {
      userId: user.uid,
      title: newTitle,
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

  const safeParseDate = (dateStr: any) => {
    if (!dateStr) return new Date();
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr.seconds * 1000);
    return isValid(d) ? d : new Date();
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

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold text-primary">Tareas</h1>
          <p className="text-muted-foreground">Organiza tus metas y mantente productivo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-primary/5 border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-primary">Añadir Tarea</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input 
                placeholder="Nombre de la tarea..." 
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Baja">Baja</SelectItem>
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: es }) : "Elegir fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Button className="w-full gap-2" onClick={addTask}>
                <Plus className="w-4 h-4" /> Crear
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="today">Hoy</TabsTrigger>
              <TabsTrigger value="upcoming">Próximas</TabsTrigger>
              <TabsTrigger value="completed">Hechas</TabsTrigger>
            </TabsList>

            {["all", "today", "upcoming", "completed"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0 space-y-3">
                {isLoading && (
                  <div className="p-8 text-center text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Cargando...
                  </div>
                )}
                {!isLoading && filteredTasks(tab).length === 0 && (
                  <div className="flex flex-col items-center justify-center p-12 text-muted-foreground bg-muted/20 rounded-lg border-2 border-dashed">
                    <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                    <p>No hay tareas en esta categoría.</p>
                  </div>
                )}
                {filteredTasks(tab).map((task: any) => (
                  <Card key={task.id} className={cn(
                    "hover:shadow-md transition-shadow cursor-pointer group",
                    task.isCompleted && "opacity-60"
                  )}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <button 
                        onClick={() => toggleTask(task.id, task.isCompleted)}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                          task.isCompleted ? "bg-green-500 border-green-500 text-white" : "border-muted-foreground hover:border-primary"
                        )}
                      >
                        {task.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <div className="flex-1">
                        <h3 className={cn("font-medium", task.isCompleted && "line-through")}>
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {format(safeParseDate(task.dueDate), "d 'de' MMM", { locale: es })}
                          </span>
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase",
                            priorityColors[task.priority as keyof typeof priorityColors]
                          )}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 text-destructive"
                        onClick={() => removeTask(task.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
