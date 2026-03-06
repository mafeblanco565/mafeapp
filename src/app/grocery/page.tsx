
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { generateGroceryList, type GenerateGroceryListOutput } from "@/ai/flows/ai-grocery-list-generator";
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
import { collection, doc, serverTimestamp } from "firebase/firestore";

export default function GroceryPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTheme, setAiTheme] = useState("");

  // Consulta de items (asumiendo una lista por defecto para simplificar el MVP)
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
      name: newItem,
      quantity: newQuantity || "1 unidad",
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
      const result: GenerateGroceryListOutput = await generateGroceryList({ theme: aiTheme });
      const colRef = collection(firestore, "users", user.uid, "groceryItems");
      
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
        title: "Sugerencias IA Añadidas",
        description: `Se han añadido ${result.items.length} artículos basados en "${aiTheme}"`,
      });
      setAiTheme("");
    } catch (error) {
      toast({
        title: "Error en Generación IA",
        description: "No se pudieron obtener sugerencias. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
          <ShoppingCart className="w-8 h-8" />
          Mercado: Lista de Compra
        </h1>
        <p className="text-muted-foreground">Gestiona tus compras eficientemente con asistencia de IA.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Añadir Nuevo Artículo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Input 
                  placeholder="Nombre del artículo (ej. Aguacate)" 
                  className="flex-1 min-w-[200px]"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addItem()}
                />
                <Input 
                  placeholder="Cant. (ej. 2 piezas)" 
                  className="w-32"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addItem()}
                />
                <Button onClick={addItem} className="gap-2">
                  <Plus className="w-4 h-4" /> Añadir
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {isLoading && (
                  <div className="p-8 text-center text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Cargando lista...
                  </div>
                )}
                {!isLoading && items?.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    Tu lista de compra está vacía. ¡Empieza a añadir artículos o usa sugerencias de IA!
                  </div>
                )}
                {items?.map((item: any) => (
                  <div 
                    key={item.id} 
                    className={cn(
                      "flex items-center gap-4 p-4 transition-colors group",
                      item.isPurchased ? "bg-muted/30" : "hover:bg-secondary/20"
                    )}
                  >
                    <Checkbox 
                      checked={item.isPurchased} 
                      onCheckedChange={() => toggleItem(item.id, item.isPurchased)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <p className={cn(
                        "font-medium",
                        item.isPurchased && "line-through text-muted-foreground"
                      )}>
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.quantity}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-accent/20 bg-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <Sparkles className="w-5 h-5" />
                Asistente IA
              </CardTitle>
              <CardDescription>
                ¿Necesitas inspiración? Deja que la IA cree tu lista.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Tema o Comida</label>
                <Input 
                  value={aiTheme} 
                  onChange={(e) => setAiTheme(e.target.value)}
                  placeholder="ej. Cena de Pasta Italiana" 
                />
              </div>
              <Button 
                onClick={handleAiSuggest} 
                className="w-full bg-accent hover:bg-accent/90 gap-2"
                disabled={isAiLoading || !aiTheme.trim()}
              >
                {isAiLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Generar Lista con IA
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Artículos Totales:</span>
                <span className="font-bold">{items?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Completado:</span>
                <span className="font-bold text-green-600">{items?.filter((i: any) => i.isPurchased).length || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
