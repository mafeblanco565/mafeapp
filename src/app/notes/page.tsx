
"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Tag, 
  Grid2X2, 
  List,
  Pin
} from "lucide-react";
import { cn } from "@/lib/utils";

type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  pinned: boolean;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([
    { id: "1", title: "Project Idea: Focus AI", content: "Implement a deep learning model to predict user productivity patterns based on habit history.", updatedAt: "2h ago", pinned: true },
    { id: "2", title: "Book Recommendations", content: "Atomic Habits, Deep Work, The One Thing, Essentialism.", updatedAt: "1d ago", pinned: false },
    { id: "3", title: "Recipe: Spicy Pasta", content: "Garlic, chili flakes, olive oil, parmesan, and fresh parsley. Simple and quick!", updatedAt: "3d ago", pinned: false },
  ]);

  return (
    <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold text-primary">Notes: Quick Ideas</h1>
          <p className="text-muted-foreground">Capture inspiration whenever it strikes.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search notes..." className="pl-10 w-full md:w-64" />
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> New Note
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <Card key={note.id} className={cn(
            "group relative hover:shadow-lg transition-all cursor-pointer border-t-4",
            note.pinned ? "border-t-primary" : "border-t-muted"
          )}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-bold leading-tight line-clamp-2">
                  {note.title}
                </CardTitle>
                <button className={cn(
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                  note.pinned ? "text-primary opacity-100" : "text-muted-foreground hover:text-primary"
                )}>
                  <Pin className={cn("w-4 h-4", note.pinned && "fill-current")} />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                {note.content}
              </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-0 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              <span>{note.updatedAt}</span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="w-6 h-6 rounded-full hover:bg-secondary">
                  <Edit3 className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon" className="w-6 h-6 rounded-full hover:bg-destructive/10 text-destructive">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
        
        {/* Create Note Placeholder */}
        <Card className="border-2 border-dashed flex flex-col items-center justify-center p-8 text-muted-foreground hover:bg-secondary/20 hover:border-primary/30 transition-all cursor-pointer">
           <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Plus className="w-6 h-6" />
           </div>
           <p className="font-bold text-sm">Create New Note</p>
        </Card>
      </div>
    </div>
  );
}
