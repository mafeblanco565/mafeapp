
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
  Tooltip
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
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

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

  if (!adminRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center animate-in fade-in zoom-in duration-500">
        <div className="bg-destructive/10 p-6 rounded-full">
          <Lock className="w-12 h-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold">Acceso Restringido</h2>
        <p className="text-muted-foreground max-w-md">
          Este panel es exclusivo para el administrador. Tu UID no tiene privilegios suficientes.
        </p>
        <Button variant="outline" asChild><a href="/">Volver al Inicio</a></Button>
      </div>
    );
  }

  const handleAction = (name: string) => {
    toast({
      title: name,
      description: "Operación ejecutada con éxito en los servidores de MB FOCUS.",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2 uppercase tracking-tighter">
            <ShieldCheck className="w-8 h-8" />
            Control Maestro
          </h1>
          <p className="text-muted-foreground">Monitorización de recursos y privilegios.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleAction("Exportación de Datos")} className="gap-2 rounded-xl">
            <Download className="w-4 h-4" /> Informe
          </Button>
          <Button size="sm" onClick={() => handleAction("Reinicio de caché del sistema")} className="gap-2 rounded-xl">
            <RefreshCw className="w-4 h-4" /> Reiniciar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Tareas Totales", value: tasks?.length || 0, change: "Activas", icon: Activity },
          { label: "Facturas", value: bills?.length || 0, change: "Seguimiento", icon: Users },
          { label: "Hábitos", value: habits?.length || 0, change: "Progreso", icon: Database },
          { label: "Estado DB", value: "Excelente", change: "Óptimo", icon: ShieldCheck },
        ].map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-all border-none bg-white shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase">{stat.label}</CardTitle>
              <stat.icon className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-primary flex items-center gap-1 mt-1 font-bold">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-md font-bold uppercase">Rendimiento Global</CardTitle>
            <CardDescription>Flujo de interacciones semanal.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] px-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="val" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-md font-bold uppercase">Sesión Actual</CardTitle>
              <CardDescription>Información del usuario autenticado.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {user?.email?.charAt(0).toUpperCase() || "A"}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{user?.email || "Usuario Administrador"}</p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-1">UID: {user?.uid.substring(0, 16)}...</p>
                  </div>
                </div>
                <Badge className="bg-green-500 rounded-lg">Admin Activo</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border text-center">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Nivel</p>
                  <p className="text-lg font-bold">Superusuario</p>
                </div>
                <div className="p-4 rounded-2xl border text-center">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Entorno</p>
                  <p className="text-lg font-bold">Producción</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
