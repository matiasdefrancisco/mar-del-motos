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
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface DebtRecord {
  rider: string;
  amount: number;
  lastUpdate: string;
  notes?: string;
}

export default function DebtsTable() {
  // TODO: Implementar lógica de Firebase para obtener registros de deudas en tiempo real
  const [debtRecords] = useState<DebtRecord[]>([
    {
      rider: 'Juan Pérez',
      amount: 450.00,
      lastUpdate: 'Hace 2 horas',
      notes: 'Pedido #123 - Pendiente de registro de pago'
    },
    {
      rider: 'María García',
      amount: 800.00,
      lastUpdate: 'Hace 5 horas',
      notes: 'Pedido #124 - Pendiente de confirmación'
    },
  ]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rider</TableHead>
            <TableHead>Monto Registrado</TableHead>
            <TableHead>Última Actualización</TableHead>
            <TableHead>Notas</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {debtRecords.map((record) => (
            <TableRow key={record.rider}>
              <TableCell>{record.rider}</TableCell>
              <TableCell>${record.amount.toFixed(2)}</TableCell>
              <TableCell>{record.lastUpdate}</TableCell>
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