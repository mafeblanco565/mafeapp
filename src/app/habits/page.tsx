
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Plus, Flame, Award, Target, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  useFirestore, 
  useUser, 
  useCollection, 
  useMemoFirebase,
  addDocumentNonBlocking,
  deleteDocumentNonBlocking 
} from "@/firebase";
import { collection, doc } from "firebase/firestore";

const daysOfWeek = ["L", "M", "X", "J", "V", "S", "D"];

export default function HabitsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [newName, setNewName] = useState("");

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
      // Para simplificar el MVP, guardamos un array fijo de checks
      days: [false, false, false, false, false, false, false]
    });
    setNewName("");
  };

  const removeHabit = (id: string) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, "users", user.uid, "habits", id);
    deleteDocumentNonBlocking(docRef);
  };

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold text-primary">Hábitos: Progreso Diario</h1>
          <p className="text-muted-foreground">Pequeños pasos llevan a grandes cambios.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center p-6 gap-4 border-l-4 border-l-orange-500">
          <div className="p-3 bg-orange-100 rounded-full text-orange-600"><Flame className="w-6 h-6" /></div>
          <div><p className="text-xs text-muted-foreground font-bold uppercase">Hábitos Activos</p><p className="text-2xl font-bold">{habits?.length || 0}</p></div>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Nuevo Hábito</CardTitle></CardHeader>
          <CardContent className="flex gap-2">
            <Input 
              placeholder="Ej. Meditación, Leer, Agua..." 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addHabit()}
            />
            <Button onClick={addHabit} className="gap-2"><Plus className="w-4 h-4" /> Añadir</Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>
        ) : !habits || habits.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground bg-muted/10 rounded-lg border-2 border-dashed">
            <p>Empieza a construir tu mejor versión añadiendo un hábito.</p>
          </div>
        ) : (
          habits.map((habit: any) => (
            <Card key={habit.id} className="overflow-hidden group">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-stretch md:items-center">
                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg">{habit.name}</h3>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-destructive" onClick={() => removeHabit(habit.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      {daysOfWeek.map((day, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 flex-1">
                          <span className="text-[10px] text-muted-foreground font-bold">{day}</span>
                          <div className="w-full aspect-square rounded-md border-2 bg-muted/20 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                            {/* Simulación visual de interactividad */}
                          </div>
                        </div>
                      ))}
                    </div>
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
