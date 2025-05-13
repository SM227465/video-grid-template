
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Payment {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "Completed" | "Pending" | "Failed";
  invoiceId?: string;
}

// Mock payment data
const mockPayments: Payment[] = [
  { id: 'txn_1', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString(), description: 'VidShare Premium - Monthly Renewal', amount: '$9.99', status: 'Completed', invoiceId: 'INV-2024-001' },
  { id: 'txn_2', date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toLocaleDateString(), description: 'VidShare Premium - Initial Subscription', amount: '$9.99', status: 'Completed', invoiceId: 'INV-2023-120' },
  { id: 'txn_3', date: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toLocaleDateString(), description: 'VidShare Premium - One Time Pass (Failed)', amount: '$2.99', status: 'Failed' },
];

export function PaymentHistorySection() {
  const { toast } = useToast();

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Invoice Download",
      description: `Downloading invoice ${invoiceId} (simulated).`,
    });
    // Simulate file download
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-3 mb-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Payment History</CardTitle>
        </div>
        <CardDescription>Review your past payments and invoices for VidShare services.</CardDescription>
      </CardHeader>
      <CardContent>
        {mockPayments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell className="font-medium">{payment.description}</TableCell>
                  <TableCell className="text-right">{payment.amount}</TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={payment.status === 'Completed' ? 'default' : payment.status === 'Failed' ? 'destructive' : 'secondary'}
                      className={payment.status === 'Completed' ? 'bg-green-500/20 text-green-700 dark:bg-green-700/30 dark:text-green-300 border-green-500/30' 
                               : payment.status === 'Failed' ? 'bg-red-500/20 text-red-700 dark:bg-red-700/30 dark:text-red-300 border-red-500/30' 
                               : ''}
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {payment.invoiceId ? (
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleDownloadInvoice(payment.invoiceId!)}>
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download Invoice {payment.invoiceId}</span>
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No payment history found.</p>
            <p className="text-sm text-muted-foreground">Your payments will appear here once you subscribe or make purchases.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
