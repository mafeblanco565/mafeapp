
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  DollarSign, 
  CreditCard, 
  Home, 
  Zap, 
  Wifi, 
  AlertCircle 
} from "lucide-react";

const bills = [
  { id: "1", name: "Monthly Rent", amount: 1200, dueDate: "2024-06-01", category: "Housing", status: "Paid" },
  { id: "2", name: "Credit Card", amount: 450, dueDate: "2024-05-28", category: "Finance", status: "Overdue" },
  { id: "3", name: "Electric Bill", amount: 85, dueDate: "2024-06-05", category: "Utilities", status: "Pending" },
  { id: "4", name: "Internet Service", amount: 60, dueDate: "2024-06-10", category: "Utilities", status: "Pending" },
];

export default function BillsPage() {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold text-primary">Bills: Financial Tracker</h1>
          <p className="text-muted-foreground">Keep your finances on track and avoid late fees.</p>
        </div>
        <Button className="gap-2 bg-accent hover:bg-accent/90">
          <Plus className="w-4 h-4" /> Add Bill
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Total Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">$595.00</div>
            <p className="text-xs text-muted-foreground mt-1">3 bills remaining this month</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600 uppercase">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">$450.00</div>
            <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
              <AlertCircle className="w-3 h-3" />
              Action required immediately
            </div>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Monthly Budget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold text-accent">65%</div>
            <Progress value={65} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming & Recent Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.name}</TableCell>
                  <TableCell>${bill.amount.toFixed(2)}</TableCell>
                  <TableCell>{bill.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      {bill.category === "Housing" && <Home className="w-3 h-3" />}
                      {bill.category === "Finance" && <CreditCard className="w-3 h-3" />}
                      {bill.category === "Utilities" && <Zap className="w-3 h-3" />}
                      {bill.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={cn(
                        bill.status === "Paid" && "bg-green-100 text-green-700 hover:bg-green-100",
                        bill.status === "Overdue" && "bg-red-100 text-red-700 hover:bg-red-100",
                        bill.status === "Pending" && "bg-amber-100 text-amber-700 hover:bg-amber-100"
                      )}
                    >
                      {bill.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Pay Now</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
