
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Sparkles, 
  Trash2, 
  ShoppingCart, 
  Loader2,
  CheckCircle2
} from "lucide-react";
import { generateGroceryList } from "@/ai/flows/ai-grocery-list-generator";
import { useToast } from "@/hooks/use-toast";
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

export default function GroceryPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTheme, setAiTheme] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, "users", user.uid, "groceryItems");
  }, [firestore, user]);

  const { data: items, isLoading } = useCollection(itemsQuery);

  const addItem = () => {
    if (!newItem.trim() || !user || !firestore) return;
    
    const colRef = collection(firestore, "users", user.uid, "groceryItems");
    addDocumentNonBlocking(colRef, {
      userId: user.uid,
      name: newItem.trim(),
      quantity: newQuantity.trim() || "1 unidad",
      isPurchased: false,
      suggestedByAI: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    setNewItem("");
    setNewQuantity("");
  };

  const toggleItem = (id: string, currentStatus: boolean) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, "users", user.uid, "groceryItems", id);
    updateDocumentNonBlocking(docRef, { 
      isPurchased: !currentStatus,
      updatedAt: new Date().toISOString()
    });
  };

  const removeItem = (id: string) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, "users", user.uid, "groceryItems", id);
    deleteDocumentNonBlocking(docRef);
  };

  const handleAiSuggest = async () => {
    if (!aiTheme.trim() || !user || !firestore) {
      toast({
        title: "Campo vacío",
        description: "Escribe qué quieres cocinar primero.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAiLoading(true);
    try {
      const result = await generateGroceryList({ theme: aiTheme });
      if (result && result.items && result.items.length > 0) {
        const colRef = collection(firestore, "users", user.uid, "groceryItems");
        
        // Añadimos cada item de la IA a la base de datos de forma secuencial pero no bloqueante
        for (const item of result.items) {
          addDocumentNonBlocking(colRef, {
            userId: user.uid,
            name: item.name,
            quantity: item.quantity,
            isPurchased: false,
            suggestedByAI: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }

        toast({
          title: "¡Lista generada!",
          description: `Se añadieron los ingredientes para ${aiTheme}.`,
        });
        setAiTheme("");
      } else {
        throw new Error("Respuesta de IA vacía");
      }
    } catch (error) {
      console.error("AI Error:", error);
      toast({
        title: "Error del Asistente",
        description: "Hubo un problema al consultar a la IA. Reintenta.",
        variant: "destructive",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2 uppercase tracking-tighter">
          <ShoppingCart className="w-8 h-8" />
          Compras Inteligentes
        </h1>
        <p className="text-muted-foreground text-sm font-bold uppercase opacity-60">Organiza tu mercado con el poder de la IA.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-primary/10 bg-white rounded-3xl overflow-hidden shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Añadir a la lista</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Input 
                  placeholder="Producto..." 
                  className="flex-1 min-w-[150px] rounded-xl"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addItem()}
                />
                <Input 
                  placeholder="Cant." 
                  className="w-24 rounded-xl"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addItem()}
                />
                <Button onClick={addItem} size="icon" className="shrink-0 rounded-xl shadow-md">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-3">
            {isLoading ? (
              <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <p className="text-xs uppercase font-bold opacity-40">Sincronizando...</p>
              </div>
            ) : !items || items.length === 0 ? (
              <div className="p-16 text-center text-muted-foreground bg-white rounded-[2.5rem] border-2 border-dashed flex flex-col items-center gap-3">
                <ShoppingCart className="w-10 h-10 opacity-10" />
                <p className="text-xs font-bold uppercase tracking-widest">Tu lista está vacía</p>
              </div>
            ) : (
              items.map((item: any) => (
                <div 
                  key={item.id} 
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-[1.5rem] bg-white border transition-all group shadow-sm",
                    item.isPurchased ? "opacity-40 grayscale" : "hover:border-primary/30"
                  )}
                >
                  <button 
                    onClick={() => toggleItem(item.id, item.isPurchased)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                      item.isPurchased ? "bg-primary border-primary text-white" : "border-muted"
                    )}
                  >
                    {item.isPurchased && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <div className="flex-1">
                    <p className={cn(
                      "font-bold text-sm uppercase tracking-tight",
                      item.isPurchased && "line-through"
                    )}>
                      {item.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase opacity-60">{item.quantity}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive h-8 w-8 hover:bg-destructive/10 rounded-full"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Card className="border-accent/40 bg-accent/5 overflow-hidden rounded-[2.5rem] shadow-sm">
            <CardHeader className="bg-accent/10 pb-4">
              <CardTitle className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-5 h-5" />
                Asistente Gourmet
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <p className="text-[10px] text-muted-foreground font-bold uppercase leading-relaxed opacity-70">
                Escribe un plato y la IA generará la lista de ingredientes necesarios.
              </p>
              <Input 
                value={aiTheme} 
                onChange={(e) => setAiTheme(e.target.value)}
                placeholder="Ej: Sancocho, Pasta..." 
                className="text-sm rounded-xl border-accent/20 focus:border-accent"
                onKeyDown={(e) => e.key === 'Enter' && handleAiSuggest()}
              />
              <Button 
                onClick={handleAiSuggest} 
                className="w-full bg-accent hover:bg-accent/90 text-white gap-2 font-bold shadow-lg h-12 rounded-2xl transition-transform active:scale-95"
                disabled={isAiLoading || !aiTheme.trim()}
              >
                {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {isAiLoading ? "PENSANDO..." : "GENERAR INGREDIENTES"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
