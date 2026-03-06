
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Trash2, 
  Pin,
  Loader2,
  Search,
  BookOpen
} from "lucide-react";
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
import { formatDistanceToNow, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export default function NotesPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const notesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, "users", user.uid, "notes");
  }, [firestore, user]);

  const { data: notes, isLoading } = useCollection(notesQuery);

  const addNote = () => {
    if (!newTitle.trim() || !user || !firestore) return;
    const colRef = collection(firestore, "users", user.uid, "notes");
    addDocumentNonBlocking(colRef, {
      userId: user.uid,
      title: newTitle,
      content: newContent,
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setNewTitle("");
    setNewContent("");
    setIsAdding(false);
  };

  const removeNote = (id: string) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, "users", user.uid, "notes", id);
    deleteDocumentNonBlocking(docRef);
  };

  const togglePin = (id: string, currentStatus: boolean) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, "users", user.uid, "notes", id);
    updateDocumentNonBlocking(docRef, { pinned: !currentStatus });
  };

  if (!mounted) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold text-primary">Notas: Ideas Rápidas</h1>
          <p className="text-muted-foreground">Captura la inspiración cuando surja.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Nueva Nota
        </Button>
      </div>

      {isAdding && (
        <Card className="border-primary/20">
          <CardHeader>
            <Input 
              placeholder="Título de la nota..." 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Escribe tu idea aquí..." 
              value={newContent} 
              onChange={(e) => setNewContent(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancelar</Button>
            <Button onClick={addNote}>Guardar Nota</Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full p-12 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
        ) : !notes || notes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-20 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/5">
             <BookOpen className="w-12 h-12 mb-4 opacity-10" />
             <p className="font-bold">No hay notas todavía</p>
             <p className="text-sm">Tus ideas brillantes aparecerán aquí.</p>
          </div>
        ) : (
          notes.map((note: any) => {
            let noteDate = new Date();
            try {
              const parsed = typeof note.updatedAt === 'string' ? parseISO(note.updatedAt) : new Date(note.updatedAt.seconds * 1000);
              if (isValid(parsed)) noteDate = parsed;
            } catch (e) {}

            return (
              <Card key={note.id} className={cn(
                "group relative hover:shadow-lg transition-all cursor-pointer border-t-4",
                note.pinned ? "border-t-primary" : "border-t-muted"
              )}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-bold leading-tight line-clamp-2">
                      {note.title}
                    </CardTitle>
                    <button 
                      onClick={() => togglePin(note.id, note.pinned)}
                      className={cn(
                        "transition-opacity",
                        note.pinned ? "text-primary opacity-100" : "text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100"
                      )}
                    >
                      <Pin className={cn("w-4 h-4", note.pinned && "fill-current")} />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                    {note.content}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-0 text-[10px] text-muted-foreground font-bold uppercase">
                  <span>{formatDistanceToNow(noteDate, { addSuffix: true, locale: es })}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 opacity-0 group-hover:opacity-100 text-destructive"
                    onClick={() => removeNote(note.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
