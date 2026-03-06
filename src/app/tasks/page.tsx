
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  Clock, 
  Calendar as CalendarIcon, 
  Plus, 
  Flag,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type Task = {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  dueDate: Date;
  completed: boolean;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Complete project proposal", priority: "High", dueDate: new Date(), completed: false },
    { id: "2", title: "Monthly review meeting", priority: "Medium", dueDate: new Date(), completed: true },
    { id: "3", title: "Update documentation", priority: "Low", dueDate: new Date(Date.now() + 86400000), completed: false },
  ]);

  const priorityColors = {
    High: "text-red-600 bg-red-50 border-red-100",
    Medium: "text-orange-600 bg-orange-50 border-orange-100",
    Low: "text-blue-600 bg-blue-50 border-blue-100",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold text-primary">Tareas: Tasks</h1>
          <p className="text-muted-foreground">Organize your goals and stay productive.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-primary/5 border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-primary">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md bg-white border">
                <span className="text-sm">Today's Goals</span>
                <span className="font-bold text-primary">4</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md bg-white border">
                <span className="text-sm">Overdue</span>
                <span className="font-bold text-destructive">2</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md bg-white border">
                <span className="text-sm">Completed Week</span>
                <span className="font-bold text-green-600">24</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="today">Due Today</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0 space-y-3">
              {tasks.map((task) => (
                <Card key={task.id} className={cn(
                  "hover:shadow-md transition-shadow cursor-pointer group",
                  task.completed && "opacity-60"
                )}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <button className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      task.completed ? "bg-green-500 border-green-500 text-white" : "border-muted-foreground hover:border-primary"
                    )}>
                      {task.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div className="flex-1">
                      <h3 className={cn("font-medium", task.completed && "line-through")}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {format(task.dueDate, "MMM d, yyyy")}
                        </span>
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase",
                          priorityColors[task.priority]
                        )}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
