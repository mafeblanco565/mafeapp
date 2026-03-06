"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Plus, Flame, Award, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const habits = [
  { id: "1", name: "Leer 30 min", streak: 5, days: [true, true, true, true, true, false, false] },
  { id: "2", name: "Ejercicio Temprano", streak: 12, days: [true, true, true, true, true, true, true] },
  { id: "3", name: "Sin Azúcar", streak: 3, days: [false, false, true, true, true, false, false] },
  { id: "4", name: "Meditación", streak: 0, days: [false, false, false, false, false, false, false] },
];

const daysOfWeek = ["L", "M", "X", "J", "V", "S", "D"];

export default function HabitsPage() {
  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold text-primary">Hábitos: Progreso Diario</h1>
          <p className="text-muted-foreground">Pequeños pasos llevan a grandes cambios.</p>
        </div>
        <Button className="gap-2 bg-primary">
          <Plus className="w-4 h-4" /> Nuevo Hábito
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center p-6 gap-4 border-l-4 border-l-orange-500">
          <div className="p-3 bg-orange-100 rounded-full text-orange-600">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-tight">Mejor Racha</p>
            <p className="text-2xl font-bold">12 Días</p>
          </div>
        </Card>
        <Card className="flex items-center p-6 gap-4 border-l-4 border-l-primary">
          <div className="p-3 bg-primary/10 rounded-full text-primary">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-tight">Logros</p>
            <p className="text-2xl font-bold">8 Medallas</p>
          </div>
        </Card>
        <Card className="flex items-center p-6 gap-4 border-l-4 border-l-accent">
          <div className="p-3 bg-accent/10 rounded-full text-accent">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-tight">Enfoque de Hoy</p>
            <p className="text-2xl font-bold">2/4 Hechos</p>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {habits.map((habit) => (
          <Card key={habit.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-stretch md:items-center">
                <div className="flex-1 p-6 border-b md:border-b-0 md:border-r">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">{habit.name}</h3>
                    <div className="flex items-center gap-1 text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded text-sm">
                      <Flame className="w-4 h-4" />
                      {habit.streak}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {daysOfWeek.map((day, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 flex-1">
                        <span className="text-[10px] text-muted-foreground font-bold">{day}</span>
                        <div 
                          className={cn(
                            "w-full aspect-square rounded-md border-2 transition-all flex items-center justify-center cursor-pointer",
                            habit.days[i] 
                              ? "bg-primary border-primary text-white shadow-sm" 
                              : "border-muted bg-muted/20 hover:border-muted-foreground/30"
                          )}
                        >
                          {habit.days[i] && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 bg-secondary/30 flex flex-col justify-center items-center gap-3">
                  <Button size="sm" className="w-full font-bold">Registrar Sesión</Button>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Último registro: hace 2h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
