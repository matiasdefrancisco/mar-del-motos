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
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, UserCheck, UserX } from 'lucide-react';

type UserRole = 'admin' | 'operator' | 'rider' | 'local';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
}

const roleColors: Record<UserRole, string> = {
  admin: 'bg-red-500',
  operator: 'bg-blue-500',
  rider: 'bg-green-500',
  local: 'bg-yellow-500'
};

export default function UsersTable() {
  // TODO: Implementar lógica de Firebase para obtener y gestionar usuarios
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@mardelmotos.com',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-15',
      lastLogin: '2024-03-20'
    },
    {
      id: '2',
      name: 'María González',
      email: 'maria@local.com',
      role: 'local',
      status: 'active',
      createdAt: '2024-02-01',
      lastLogin: '2024-03-19'
    },
    {
      id: '3',
      name: 'Carlos Rodríguez',
      email: 'carlos@rider.com',
      role: 'rider',
      status: 'inactive',
      createdAt: '2024-02-15',
      lastLogin: '2024-03-10'
    }
  ]);

  const handleStatusChange = (userId: string, newStatus: 'active' | 'inactive') => {
    // TODO: Implementar cambio de estado en Firebase
    console.log(`Cambiando estado de usuario ${userId} a ${newStatus}`);
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    // TODO: Implementar cambio de rol en Firebase
    console.log(`Cambiando rol de usuario ${userId} a ${newRole}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Registro</TableHead>
            <TableHead>Último Acceso</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge className={roleColors[user.role]}>
                  {user.role.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                  {user.status === 'active' ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>
              <TableCell>{user.createdAt}</TableCell>
              <TableCell>{user.lastLogin}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')}
                    >
                      {user.status === 'active' ? (
                        <>
                          <UserX className="mr-2 h-4 w-4" />
                          <span>Desactivar</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="mr-2 h-4 w-4" />
                          <span>Activar</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    {['admin', 'operator', 'rider', 'local'].map((role) => (
                      <DropdownMenuItem
                        key={role}
                        onClick={() => handleRoleChange(user.id, role as UserRole)}
                        disabled={user.role === role}
                      >
                        Cambiar a {role.toUpperCase()}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 