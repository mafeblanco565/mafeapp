
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Flame, Plus, Target, Trash2, Loader2, Check } from "lucide-react";
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

const daysOfWeek = ["L", "M", "X", "J", "V", "S", "D"];

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
      name: newName,
      description: "",
      streak: 0,
      startDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      days: [false, false, false, false, false, false, false]
    });
    setNewName("");
  };

  const toggleDay = (habit: any, dayIndex: number) => {
    if (!user || !firestore) return;
    const currentDays = habit.days || [false, false, false, false, false, false, false];
    const newDays = [...currentDays];
    newDays[dayIndex] = !newDays[dayIndex];
    
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

  if (!mounted) return (
    <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>
  );

  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-500 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold text-primary">Hábitos</h1>
        <p className="text-muted-foreground text-sm">Sigue tu progreso semanal paso a paso.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center p-6 gap-4 border-l-4 border-l-orange-500 bg-orange-50/30">
          <div className="p-3 bg-orange-100 rounded-full text-orange-600"><Flame className="w-6 h-6" /></div>
          <div><p className="text-xs text-muted-foreground font-bold uppercase">Hábitos</p><p className="text-2xl font-bold">{habits?.length || 0}</p></div>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold">Nuevo Hábito</CardTitle></CardHeader>
          <CardContent className="flex gap-2">
            <Input 
              placeholder="Ej. Leer 20 min" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addHabit()}
            />
            <Button onClick={addHabit} size="icon" className="shrink-0"><Plus className="w-4 h-4" /></Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>
        ) : !habits || habits.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground bg-muted/10 rounded-lg border-2 border-dashed">
            <p className="text-sm">Añade tu primer hábito para empezar.</p>
          </div>
        ) : (
          habits.map((habit: any) => (
            <Card key={habit.id} className="overflow-hidden group hover:shadow-md transition-all">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-md">{habit.name}</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-orange-600 text-xs font-bold">
                        <Flame className="w-4 h-4" /> {habit.streak || 0}
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => removeHabit(habit.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between gap-1 sm:gap-4">
                    {daysOfWeek.map((day, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 flex-1">
                        <span className="text-[10px] text-muted-foreground font-bold">{day}</span>
                        <button 
                          onClick={() => toggleDay(habit, i)}
                          className={cn(
                            "w-full max-w-[40px] aspect-square rounded-lg border-2 transition-all flex items-center justify-center",
                            habit.days?.[i] 
                              ? "bg-primary border-primary text-white shadow-sm" 
                              : "bg-muted/10 border-muted-foreground/10 hover:border-primary/50 text-transparent"
                          )}
                        >
                          <Check className="w-4 h-4" />
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
  );
}
