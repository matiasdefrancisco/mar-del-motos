'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DebtRecord {
  local: string;
  amount: number;
  status: 'pendiente' | 'registrado';
  orderId: string;
  dueDate: string;
  notes?: string;
}

export default function RiderDebtsTable() {
  const [debtRecords] = useState<DebtRecord[]>([
    {
      local: 'Pizza Express',
      amount: 450.00,
      status: 'pendiente',
      orderId: '#123',
      dueDate: '2024-03-25',
      notes: 'Pendiente de registro de entrega'
    },
    {
      local: 'Burger House',
      amount: 800.00,
      status: 'registrado',
      orderId: '#124',
      dueDate: '2024-03-24',
      notes: 'Entrega confirmada'
    },
  ]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Local</TableHead>
            <TableHead>Pedido</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Vencimiento</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Notas</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {debtRecords.map((record) => (
            <TableRow key={`${record.local}-${record.orderId}`}>
              <TableCell>{record.local}</TableCell>
              <TableCell>{record.orderId}</TableCell>
              <TableCell>${record.amount.toFixed(2)}</TableCell>
              <TableCell>{record.dueDate}</TableCell>
              <TableCell>
                <Badge variant={record.status === 'pendiente' ? 'outline' : 'default'}>
                  {record.status === 'pendiente' ? 'Pendiente' : 'Registrado'}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{record.notes}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" title="Ver detalles del registro">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 