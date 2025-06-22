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
import { ScrollArea } from '@/components/ui/scroll-area';

type AuditAction = 
  | 'user_created'
  | 'user_updated'
  | 'user_deleted'
  | 'order_created'
  | 'order_updated'
  | 'order_deleted'
  | 'payment_processed'
  | 'login_success'
  | 'login_failed'
  | 'role_changed';

interface AuditLog {
  id: string;
  timestamp: string;
  action: AuditAction;
  userId: string;
  userEmail: string;
  details: string;
  ipAddress: string;
}

const actionColors: Record<AuditAction, string> = {
  user_created: 'bg-green-500',
  user_updated: 'bg-blue-500',
  user_deleted: 'bg-red-500',
  order_created: 'bg-green-500',
  order_updated: 'bg-blue-500',
  order_deleted: 'bg-red-500',
  payment_processed: 'bg-purple-500',
  login_success: 'bg-green-500',
  login_failed: 'bg-red-500',
  role_changed: 'bg-yellow-500'
};

const actionLabels: Record<AuditAction, string> = {
  user_created: 'Usuario Creado',
  user_updated: 'Usuario Actualizado',
  user_deleted: 'Usuario Eliminado',
  order_created: 'Pedido Creado',
  order_updated: 'Pedido Actualizado',
  order_deleted: 'Pedido Eliminado',
  payment_processed: 'Pago Procesado',
  login_success: 'Login Exitoso',
  login_failed: 'Login Fallido',
  role_changed: 'Rol Cambiado'
};

export default function AuditLogTable() {
  // TODO: Implementar lógica de Firebase para obtener logs de auditoría
  const [logs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: '2024-03-20 15:30:25',
      action: 'user_created',
      userId: 'user123',
      userEmail: 'nuevo@usuario.com',
      details: 'Nuevo usuario registrado como rider',
      ipAddress: '192.168.1.100'
    },
    {
      id: '2',
      timestamp: '2024-03-20 15:25:10',
      action: 'login_failed',
      userId: 'user456',
      userEmail: 'usuario@existente.com',
      details: 'Intento de login fallido - Contraseña incorrecta',
      ipAddress: '192.168.1.101'
    },
    {
      id: '3',
      timestamp: '2024-03-20 15:20:00',
      action: 'order_updated',
      userId: 'admin789',
      userEmail: 'admin@mardelmotos.com',
      details: 'Actualización de estado de pedido #123 a "entregado"',
      ipAddress: '192.168.1.102'
    },
    {
      id: '4',
      timestamp: '2024-03-20 15:15:30',
      action: 'payment_processed',
      userId: 'local321',
      userEmail: 'local@comercio.com',
      details: 'Pago procesado por $1500 - ID Transacción: TRX789',
      ipAddress: '192.168.1.103'
    },
    {
      id: '5',
      timestamp: '2024-03-20 15:10:00',
      action: 'role_changed',
      userId: 'user654',
      userEmail: 'usuario@modificado.com',
      details: 'Rol cambiado de "rider" a "operator"',
      ipAddress: '192.168.1.104'
    }
  ]);

  return (
    <ScrollArea className="h-[600px] rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha/Hora</TableHead>
            <TableHead>Acción</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Detalles</TableHead>
            <TableHead>IP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{log.timestamp}</TableCell>
              <TableCell>
                <Badge className={actionColors[log.action]}>
                  {actionLabels[log.action]}
                </Badge>
              </TableCell>
              <TableCell>{log.userEmail}</TableCell>
              <TableCell>{log.details}</TableCell>
              <TableCell className="font-mono">{log.ipAddress}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
} 