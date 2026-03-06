
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Trash2,
  AlertCircle,
  Loader2,
  CheckCircle
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
import { Input } from "@/components/ui/input";

export default function BillsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const billsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, "users", user.uid, "bills");
  }, [firestore, user]);

  const { data: bills, isLoading } = useCollection(billsQuery);

  const addBill = () => {
    if (!newName.trim() || !newAmount || !user || !firestore) return;
    const colRef = collection(firestore, "users", user.uid, "bills");
    addDocumentNonBlocking(colRef, {
      userId: user.uid,
      categoryId: "general",
      name: newName,
      amount: parseFloat(newAmount),
      dueDate: new Date().toISOString(),
      paymentStatus: "Pendiente",
      isPaid: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setNewName("");
    setNewAmount("");
  };

  const markAsPaid = (id: string) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, "users", user.uid, "bills", id);
    updateDocumentNonBlocking(docRef, { 
      isPaid: true,
      paymentStatus: "Pagado",
      paidAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  const removeBill = (id: string) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, "users", user.uid, "bills", id);
    deleteDocumentNonBlocking(docRef);
  };

  const totalPending = bills?.reduce((acc: number, b: any) => !b.isPaid ? acc + b.amount : acc, 0) || 0;

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold text-primary">Facturas: Seguimiento Financiero</h1>
        <p className="text-muted-foreground">Mantén tus finanzas al día y evita recargos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Total Pendiente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">${totalPending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {bills?.filter((b: any) => !b.isPaid).length || 0} facturas pendientes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium uppercase">Añadir Factura</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input 
              placeholder="Nombre (ej. Luz)" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)}
            />
            <Input 
              placeholder="Monto" 
              type="number"
              className="w-32"
              value={newAmount} 
              onChange={(e) => setNewAmount(e.target.value)}
            />
            <Button onClick={addBill} size="icon"><Plus className="w-4 h-4" /></Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Facturas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Cargando...
            </div>
          ) : !bills || bills.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground bg-muted/10 rounded-lg border-2 border-dashed">
              <p>No tienes facturas registradas.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((bill: any) => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">{bill.name}</TableCell>
                    <TableCell>${bill.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge 
                        className={cn(
                          bill.isPaid ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                        )}
                      >
                        {bill.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2">
                      {!bill.isPaid && (
                        <Button variant="ghost" size="sm" onClick={() => markAsPaid(bill.id)}>
                          <CheckCircle className="w-4 h-4 mr-2" /> Pagar
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeBill(bill.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
