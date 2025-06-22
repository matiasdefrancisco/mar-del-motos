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
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface Order {
  id: string;
  localName: string;
  deliveryAddress: string;
  status: 'assigned' | 'on_way' | 'picked_up' | 'delivered';
  paymentStatus: 'no_debt' | 'i_owe';
  assignedTime: string;
  pickupTime?: string;
}

const getStatusBadgeColor = (status: Order['status']) => {
  switch (status) {
    case 'assigned':
      return 'bg-yellow-500';
    case 'on_way':
      return 'bg-blue-500';
    case 'picked_up':
      return 'bg-green-500/50';
    case 'delivered':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusText = (status: Order['status']) => {
  switch (status) {
    case 'assigned':
      return 'Asignado';
    case 'on_way':
      return 'En camino';
    case 'picked_up':
      return 'Recogido';
    case 'delivered':
      return 'Entregado';
    default:
      return status;
  }
};

export default function AssignedOrdersTable() {
  // TODO: Implementar lógica de Firebase para obtener pedidos en tiempo real
  const [orders] = useState<Order[]>([
    {
      id: 'ORD001',
      localName: 'Pizza Express',
      deliveryAddress: 'Calle Falsa 123',
      status: 'assigned',
      paymentStatus: 'no_debt',
      assignedTime: 'Hace 5 min',
    },
    {
      id: 'ORD002',
      localName: 'Burger House',
      deliveryAddress: 'Avenida Siempreviva 742',
      status: 'on_way',
      paymentStatus: 'i_owe',
      assignedTime: 'Hace 15 min',
      pickupTime: 'Hace 5 min',
    },
  ]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Pedido</TableHead>
            <TableHead>Local</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Deuda</TableHead>
            <TableHead>Tiempo</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.localName}</TableCell>
              <TableCell>{order.deliveryAddress}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(order.status)}>
                  {getStatusText(order.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={order.paymentStatus === 'no_debt' ? 'default' : 'destructive'}>
                  {order.paymentStatus === 'no_debt' ? 'Sin deuda' : 'Debo pago'}
                </Badge>
              </TableCell>
              <TableCell>{order.pickupTime || order.assignedTime}</TableCell>
              <TableCell className="text-right">
                {order.status !== 'delivered' && (
                  <Button variant="ghost" size="icon" className="mr-2">
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 