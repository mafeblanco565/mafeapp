"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
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
  Mail,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const data = [
  { name: "Lun", users: 4000, interactions: 2400 },
  { name: "Mar", users: 3000, interactions: 1398 },
  { name: "Mié", users: 2000, interactions: 9800 },
  { name: "Jue", users: 2780, interactions: 3908 },
  { name: "Vie", users: 1890, interactions: 4800 },
  { name: "Sáb", users: 2390, interactions: 3800 },
  { name: "Dom", users: 3490, interactions: 4300 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="w-8 h-8" />
            Panel de Administración
          </h1>
          <p className="text-muted-foreground">Estado del sistema y analíticas de usuario.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Descargar Informe</Button>
          <Button size="sm">Reiniciar Sistema</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Usuarios Totales", value: "12,842", change: "+12%", icon: Users },
          { label: "Activos Ahora", value: "1,402", change: "+5%", icon: Activity },
          { label: "Almacenamiento", value: "42.8 GB", change: "24%", icon: Database },
          { label: "Llamadas API", value: "245k", change: "+18%", icon: MoreHorizontal },
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase">{stat.label}</CardTitle>
              <stat.icon className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change} <span className="text-muted-foreground ml-1">vs mes anterior</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Tendencias de Interacción</CardTitle>
            <CardDescription>Sesiones e interacciones diarias activas.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelFormatter={(label) => `Día: ${label}`}
                />
                <Area type="monotone" dataKey="interactions" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Usuarios Recientes</CardTitle>
              <CardDescription>Monitoriza registros y estado.</CardDescription>
            </div>
            <div className="relative w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar usuarios..." className="pl-9 h-8 text-xs" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Juan Pérez", email: "juan@example.com", status: "Activo", time: "hace 2m" },
                { name: "Ana García", email: "ana@gmail.com", status: "Desconectado", time: "hace 15m" },
                { name: "Roberto Fox", email: "robert@outlook.com", status: "Activo", time: "hace 1h" },
                { name: "Emily Brown", email: "emily@focus.ai", status: "Baneado", time: "hace 3h" },
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={user.status === "Activo" ? "default" : user.status === "Baneado" ? "destructive" : "secondary"}>
                      {user.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-bold">{user.time}</span>
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
