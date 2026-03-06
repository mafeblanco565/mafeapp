"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, 
  Sparkles, 
  Trash2, 
  ShoppingCart, 
  Loader2
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTheme, setAiTheme] = useState("");

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
    if (!aiTheme.trim() || !user || !firestore) return;
    setIsAiLoading(true);
    try {
      const result = await generateGroceryList({ theme: aiTheme });
      if (result && result.items) {
        const colRef = collection(firestore, "users", user.uid, "groceryItems");
        
        // Añadir items secuencialmente para evitar saturación si fuera necesario
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
          title: "Sugerencias listas",
          description: `Se han añadido ${result.items.length} artículos para "${aiTheme}"`,
        });
        setAiTheme("");
      }
    } catch (error) {
      console.error("AI Error:", error);
      toast({
        title: "Error de IA",
        description: "Hubo un problema al generar la lista. Por favor, intenta de nuevo.",
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
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
          <ShoppingCart className="w-8 h-8" />
          Compras
        </h1>
        <p className="text-muted-foreground text-sm">Organiza tu lista de mercado fácilmente con ayuda de IA.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-md">Nuevo Artículo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Input 
                  placeholder="Ej. Manzanas" 
                  className="flex-1 min-w-[150px]"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addItem()}
                />
                <Input 
                  placeholder="Cant." 
                  className="w-20"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addItem()}
                />
                <Button onClick={addItem} size="icon" className="shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {isLoading ? (
                  <div className="p-8 text-center text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Cargando lista...
                  </div>
                ) : !items || items.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground bg-muted/5">
                    <p className="text-sm">Tu lista de compras está vacía.</p>
                  </div>
                ) : (
                  items.map((item: any) => (
                    <div 
                      key={item.id} 
                      className={cn(
                        "flex items-center gap-4 p-4 transition-colors group",
                        item.isPurchased ? "bg-muted/30" : "hover:bg-secondary/20"
                      )}
                    >
                      <Checkbox 
                        id={item.id}
                        checked={item.isPurchased} 
                        onCheckedChange={() => toggleItem(item.id, item.isPurchased)}
                        className="w-5 h-5"
                      />
                      <div className="flex-1 cursor-pointer" onClick={() => toggleItem(item.id, item.isPurchased)}>
                        <p className={cn(
                          "font-medium text-sm",
                          item.isPurchased && "line-through text-muted-foreground"
                        )}>
                          {item.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{item.quantity}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 text-destructive h-8 w-8"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-accent/20 bg-accent/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-accent text-md">
                <Sparkles className="w-5 h-5" />
                Asistente IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">Escribe un plato o tipo de dieta y la IA generará los ingredientes por ti.</p>
              <Input 
                value={aiTheme} 
                onChange={(e) => setAiTheme(e.target.value)}
                placeholder="Ej. Lasaña de carne" 
                className="text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleAiSuggest()}
              />
              <Button 
                onClick={handleAiSuggest} 
                className="w-full bg-accent hover:bg-accent/90 gap-2 font-bold"
                disabled={isAiLoading || !aiTheme.trim()}
              >
                {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isAiLoading ? "Generando..." : "Sugerir Ingredientes"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
