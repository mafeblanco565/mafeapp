
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Flame, Plus, Target, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
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

const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function HabitsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const habitsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, "users", user.uid, "habits");
  }, [firestore, user]);

  const { data: habits, isLoading } = useCollection(habitsQuery);

  const addHabit = () => {
    if (!newName.trim() || !user || !firestore) return;
    const colRef = collection(firestore, "users", user.uid, "habits");
    addDocumentNonBlocking(colRef, {
      userId: user.uid,
      name: newName.trim(),
      streak: 0,
      days: [false, false, false, false, false, false, false],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setNewName("");
  };

  const toggleDay = (habit: any, index: number) => {
    if (!user || !firestore) return;
    const currentDays = habit.days || [false, false, false, false, false, false, false];
    const newDays = [...currentDays];
    newDays[index] = !newDays[index];
    
    // Calcular racha simple (conteo de días marcados)
    const streak = newDays.filter(d => d).length;
    
    const docRef = doc(firestore, "users", user.uid, "habits", habit.id);
    updateDocumentNonBlocking(docRef, { 
      days: newDays, 
      streak,
      updatedAt: new Date().toISOString() 
    });
  };

  const removeHabit = (id: string) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, "users", user.uid, "habits", id);
    deleteDocumentNonBlocking(docRef);
  };

  if (!mounted) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2 uppercase tracking-tighter">
          <Target className="w-8 h-8" />
          Constructor de Hábitos
        </h1>
        <p className="text-muted-foreground text-sm font-bold opacity-60">Pequeños pasos, grandes resultados cada semana.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-primary/10 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-xs font-bold uppercase text-primary">Nuevo Desafío</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              placeholder="Ej. Leer, Gimnasio, Agua..." 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addHabit()}
              className="rounded-xl border-primary/20"
            />
            <Button onClick={addHabit} className="w-full rounded-xl gap-2 font-bold uppercase text-xs" disabled={!newName.trim()}>
              <Plus className="w-4 h-4" /> Empezar
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
          ) : !habits || habits.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground bg-white rounded-3xl border-2 border-dashed flex flex-col items-center gap-4">
              <Target className="w-12 h-12 opacity-10" />
              <p className="font-bold uppercase text-xs">No tienes hábitos activos</p>
            </div>
          ) : (
            habits.map((habit: any) => (
              <Card key={habit.id} className="overflow-hidden group hover:shadow-md transition-all rounded-[2rem] border-none shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Target className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg uppercase tracking-tight">{habit.name}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 rounded-full text-orange-600 text-xs font-bold shadow-sm">
                          <Flame className="w-4 h-4" /> {habit.streak || 0}
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive h-8 w-8 hover:bg-destructive/10 rounded-full" onClick={() => removeHabit(habit.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2">
                      {daysOfWeek.map((day, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                          <span className="text-[10px] text-muted-foreground font-bold uppercase">{day}</span>
                          <button 
                            onClick={() => toggleDay(habit, i)}
                            className={cn(
                              "w-full aspect-square rounded-2xl border-2 transition-all flex items-center justify-center shadow-sm",
                              habit.days?.[i] 
                                ? "bg-primary border-primary text-white scale-105" 
                                : "bg-muted/5 border-muted-foreground/10 hover:border-primary/40 text-transparent"
                            )}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
