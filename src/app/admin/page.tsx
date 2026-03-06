
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area
} from "recharts";
import { 
  Users, 
  Activity, 
  Database, 
  ShieldCheck, 
  ArrowUpRight, 
  MoreHorizontal,
  Search,
  Loader2,
  Lock,
  Download,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

const data = [
  { name: "Lun", users: 120, interactions: 450 },
  { name: "Mar", users: 150, interactions: 520 },
  { name: "Mié", users: 180, interactions: 800 },
  { name: "Jue", users: 170, interactions: 600 },
  { name: "Vie", users: 210, interactions: 950 },
  { name: "Sáb", users: 250, interactions: 1200 },
  { name: "Dom", users: 280, interactions: 1100 },
];

export default function AdminDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Verificar si el usuario actual es administrador
  const adminDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, "adminRoles", user.uid);
  }, [firestore, user]);

  const { data: adminRole, isLoading: isAdminLoading } = useDoc(adminDocRef);

  if (!mounted || isAdminLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si no es admin, mostrar pantalla de bloqueo
  if (!adminRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center animate-in fade-in zoom-in duration-500">
        <div className="bg-destructive/10 p-6 rounded-full">
          <Lock className="w-12 h-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold">Acceso Restringido</h2>
        <p className="text-muted-foreground max-w-md">
          Este panel es exclusivo para el superusuario de MB FOCUS. Tu ID de usuario ({user?.uid.substring(0, 8)}...) no tiene privilegios administrativos.
        </p>
        <Button variant="outline" asChild><a href="/">Volver al Inicio</a></Button>
      </div>
    );
  }

  const handleAction = (actionName: string) => {
    toast({
      title: actionName,
      description: "Esta función estará disponible en la próxima actualización del sistema.",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="w-8 h-8" />
            Panel Maestro
          </h1>
          <p className="text-muted-foreground">Monitorización global y gestión de recursos.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleAction("Exportar Datos")} className="gap-2">
            <Download className="w-4 h-4" /> Informe
          </Button>
          <Button size="sm" onClick={() => handleAction("Reinicio de caché")} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Reiniciar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Usuarios Totales", value: "1", change: "+0%", icon: Users },
          { label: "Activos Ahora", value: "1", change: "+100%", icon: Activity },
          { label: "BBDD", value: "2.4 MB", change: "Bajo", icon: Database },
          { label: "Sincronización", value: "Ok", change: "100%", icon: MoreHorizontal },
        ].map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase">{stat.label}</CardTitle>
              <stat.icon className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change} <span className="text-muted-foreground ml-1">estado real</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Actividad del Sistema</CardTitle>
            <CardDescription>Interacciones de usuario en tiempo real.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="interactions" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorInteractions)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sesiones Activas</CardTitle>
              <CardDescription>Usuarios conectados actualmente.</CardDescription>
            </div>
            <div className="relative w-40">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Filtrar..." className="pl-9 h-8 text-xs rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: user?.displayName || "Tú (Admin)", email: user?.email || "Superusuario", status: "Activo", time: "Ahora" },
              ].map((userItem, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border bg-card hover:bg-secondary/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {userItem.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-none">{userItem.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{userItem.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                      {userItem.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-bold">{userItem.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
