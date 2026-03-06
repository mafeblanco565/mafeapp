
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip
} from "recharts";
import { 
  Users, 
  Activity, 
  Database, 
  ShieldCheck, 
  ArrowUpRight, 
  Loader2,
  Lock,
  Download,
  RefreshCw,
  Search,
  HardDrive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const activityData = [
  { name: "Lun", val: 40 },
  { name: "Mar", val: 30 },
  { name: "Mié", val: 65 },
  { name: "Jue", val: 45 },
  { name: "Vie", val: 90 },
  { name: "Sáb", val: 70 },
  { name: "Dom", val: 85 },
];

export default function AdminDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Verificar admin
  const adminDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, "adminRoles", user.uid);
  }, [firestore, user]);

  const { data: adminRole, isLoading: isAdminLoading } = useDoc(adminDocRef);

  // Datos reales para el dashboard
  const tasksQuery = useMemoFirebase(() => (firestore && user) ? collection(firestore, "users", user.uid, "tasks") : null, [firestore, user]);
  const billsQuery = useMemoFirebase(() => (firestore && user) ? collection(firestore, "users", user.uid, "bills") : null, [firestore, user]);
  const habitsQuery = useMemoFirebase(() => (firestore && user) ? collection(firestore, "users", user.uid, "habits") : null, [firestore, user]);
  
  const { data: tasks } = useCollection(tasksQuery);
  const { data: bills } = useCollection(billsQuery);
  const { data: habits } = useCollection(habitsQuery);

  if (!mounted || isAdminLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si no hay adminRole en Firestore, denegamos acceso
  if (!adminRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center animate-in fade-in zoom-in duration-500 bg-[#FDFCF8]">
        <div className="bg-destructive/10 p-8 rounded-[2.5rem] shadow-inner">
          <Lock className="w-16 h-16 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold uppercase tracking-tighter">Acceso Restringido</h2>
          <p className="text-muted-foreground max-w-sm font-medium">
            Este panel es exclusivo para el administrador del sistema MB FOCUS. Tu UID no tiene privilegios.
          </p>
        </div>
        <Button variant="outline" className="rounded-full px-8 font-bold uppercase text-xs" asChild><a href="/">Volver al Inicio</a></Button>
      </div>
    );
  }

  const handleAction = (name: string) => {
    toast({
      title: name,
      description: "Operación solicitada con éxito. Los servidores de MB FOCUS están procesando los datos.",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-headline font-bold text-primary flex items-center gap-3 uppercase tracking-tighter">
            <ShieldCheck className="w-10 h-10" />
            Control Maestro
          </h1>
          <p className="text-muted-foreground font-bold text-sm opacity-60">Supervisión técnica de la plataforma MB FOCUS.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleAction("Exportación de Informe")} className="gap-2 rounded-2xl border-primary/20 font-bold uppercase text-[10px] h-10 px-4">
            <Download className="w-4 h-4" /> Descargar Log
          </Button>
          <Button size="sm" onClick={() => handleAction("Reinicio de caché global")} className="gap-2 rounded-2xl shadow-lg font-bold uppercase text-[10px] h-10 px-4">
            <RefreshCw className="w-4 h-4" /> Reiniciar DB
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Objetivos en Red", value: tasks?.length || 0, change: "Sincronizados", icon: Activity, color: "text-blue-500" },
          { label: "Transacciones", value: bills?.length || 0, change: "Verificadas", icon: Users, color: "text-emerald-500" },
          { label: "Procesos Hábitos", value: habits?.length || 0, change: "En curso", icon: Database, color: "text-orange-500" },
          { label: "Latencia DB", value: "34ms", change: "Óptimo", icon: HardDrive, color: "text-primary" },
        ].map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-all border-none bg-white shadow-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</CardTitle>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tighter">{stat.value}</div>
              <p className="text-[9px] text-muted-foreground flex items-center gap-1 mt-1 font-bold uppercase">
                <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest">Rendimiento de Cómputo</CardTitle>
            <CardDescription className="text-xs">Uso de recursos y peticiones al asistente IA.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] px-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                <ChartTooltip 
                  contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="val" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/5">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-widest">Estado Servidor</CardTitle>
              <CardDescription className="text-[10px]">Sesión de administrador activa.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-3xl bg-secondary/30 border border-secondary/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-primary/20">
                    {user?.email?.charAt(0).toUpperCase() || "A"}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-tighter truncate w-32">{user?.email || "Admin Principal"}</p>
                    <p className="text-[8px] text-muted-foreground font-mono mt-1 opacity-50">UID: {user?.uid.substring(0, 12)}...</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500 rounded-lg text-[8px] h-5 px-2 font-bold uppercase">En Línea</Badge>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="p-4 rounded-[1.5rem] border bg-card text-center">
                  <p className="text-[9px] text-muted-foreground uppercase font-bold mb-1 opacity-40">Privilegios</p>
                  <p className="text-md font-bold uppercase tracking-tighter">Superusuario Global</p>
                </div>
                <div className="p-4 rounded-[1.5rem] border bg-card text-center">
                  <p className="text-[9px] text-muted-foreground uppercase font-bold mb-1 opacity-40">Versión Sistema</p>
                  <p className="text-md font-bold uppercase tracking-tighter">MBFOCUS v2.4.0</p>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-[9px] font-bold uppercase mb-2">
                  <span>Carga CPU</span>
                  <span className="text-emerald-500">12%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[12%] transition-all duration-1000" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
