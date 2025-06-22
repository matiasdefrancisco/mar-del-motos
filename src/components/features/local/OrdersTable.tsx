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
import { Eye, Edit, CreditCard } from 'lucide-react';

interface Order {
  id: string;
  deliveryAddress: string;
  rider: string | null;
  status: 'requested' | 'assigned' | 'on_way' | 'pickup_confirmed' | 'delivered';
  paymentStatus: 'pending' | 'paid';
  estimatedTime?: string;
}

const getStatusBadgeColor = (status: Order['status']) => {
  switch (status) {
    case 'requested':
      return 'bg-gray-500';
    case 'assigned':
      return 'bg-yellow-500';
    case 'on_way':
      return 'bg-blue-500';
    case 'pickup_confirmed':
      return 'bg-green-500/50';
    case 'delivered':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusText = (status: Order['status'], estimatedTime?: string) => {
  switch (status) {
    case 'requested':
      return 'Esperando rider';
    case 'assigned':
      return `Asignado (${estimatedTime || 'calculando...'})`;
    case 'on_way':
      return 'Rider en camino';
    case 'pickup_confirmed':
      return 'Pedido recogido';
    case 'delivered':
      return 'Entregado';
    default:
      return status;
  }
};

export default function OrdersTable() {
  // TODO: Implementar lógica de Firebase para obtener pedidos en tiempo real
  const [orders] = useState<Order[]>([
    {
      id: 'ORD001',
      deliveryAddress: 'Calle Falsa 123',
      rider: null,
      status: 'requested',
      paymentStatus: 'pending',
    },
    {
      id: 'ORD002',
      deliveryAddress: 'Avenida Siempreviva 742',
      rider: 'Juan Pérez',
      status: 'on_way',
      paymentStatus: 'pending',
      estimatedTime: '15 min',
    },
  ]);

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Pedido</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Rider</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Pago</TableHead>
            <TableHead className='text-right'>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className='font-medium'>{order.id}</TableCell>
              <TableCell>{order.deliveryAddress}</TableCell>
              <TableCell>{order.rider || 'Sin asignar'}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(order.status)}>
                  {getStatusText(order.status, order.estimatedTime)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                  {order.paymentStatus === 'paid' ? 'Saldado' : 'Pendiente'}
                </Badge>
              </TableCell>
              <TableCell className='text-right'>
                <Button variant='ghost' size='icon' className='mr-2'>
                  <Eye className='h-4 w-4' />
                </Button>
                <Button variant='ghost' size='icon' className='mr-2'>
                  <Edit className='h-4 w-4' />
                </Button>
                <Button variant='ghost' size='icon'>
                  <CreditCard className='h-4 w-4' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
