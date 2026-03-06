
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Flame, 
  Zap, 
  DollarSign 
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-headline font-bold tracking-tight text-primary">
          Welcome back, Focus Master
        </h1>
        <p className="text-muted-foreground">
          Here's what's on your plate for today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Upcoming Bills</CardTitle>
            <DollarSign className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$420.00</div>
            <p className="text-xs text-muted-foreground">Due in next 7 days</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Habit Streak</CardTitle>
            <Flame className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 Days</div>
            <p className="text-xs text-muted-foreground">Personal record: 12</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Zap className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Optimal</div>
            <p className="text-xs text-muted-foreground">Last sync: 1m ago</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline font-semibold">Today's Focus</CardTitle>
            <Link href="/tasks">
              <Button variant="ghost" size="sm" className="gap-2">
                View all <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Review quarterly reports", priority: "High", time: "10:00 AM" },
              { title: "Grocery shopping", priority: "Medium", time: "05:00 PM" },
              { title: "Pay electricity bill", priority: "High", time: "Anytime" },
            ].map((task, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-secondary/50 transition-colors cursor-pointer">
                <div className="flex flex-col">
                  <span className="font-medium">{task.title}</span>
                  <span className="text-xs text-muted-foreground">{task.time}</span>
                </div>
                <Badge variant={task.priority === "High" ? "destructive" : "secondary"}>
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Habit Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="font-headline font-semibold">Habit Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { name: "Morning Meditation", progress: 80, color: "bg-primary" },
              { name: "Read 20 Pages", progress: 45, color: "bg-accent" },
              { name: "Workout", progress: 100, color: "bg-primary" },
            ].map((habit, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{habit.name}</span>
                  <span className="text-muted-foreground">{habit.progress}%</span>
                </div>
                <Progress value={habit.progress} className="h-2" />
              </div>
            ))}
            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
              <AlertCircle className="w-4 h-4" />
              Don't forget to log your hydration!
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
