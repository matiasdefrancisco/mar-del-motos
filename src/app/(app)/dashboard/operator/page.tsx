
'use client';

import { useState, useEffect, useMemo } from 'react';
import PageTitle from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, ClipboardList, Bike, Bot, MoreHorizontal, Search, Filter, Eye, Edit, UserPlus, CreditCardIcon, ListOrdered, PlusCircle } from 'lucide-react';
import type { Order, OrderStatus, Rider, Local } from '@/lib/types';
// import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
// import { firestore } from '@/lib/firebase/config';
import { formatDistanceToNowStrict } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

// Mock Data - Reemplazar con Firestore
const MOCK_ORDERS: Order[] = [
  { id: 'ORD001', localId: 'L001', localName: 'Pizzería Don Pepito', deliveryAddress: 'Av. Colón 1234, Mar del Plata', assignedRiderId: 'R001', assignedRiderName: 'Juan Pérez', status: 'en_camino_retiro', totalAmount: 1500, createdAt: new Date(Date.now() - 30 * 60 * 1000), operatorAcceptedAt: new Date(Date.now() - 28 * 60 * 1000) },
  { id: 'ORD002', localId: 'L002', localName: 'Sushi Place', deliveryAddress: 'Almafuerte 567, Mar del Plata', status: 'pendiente_asignacion', totalAmount: 2500, createdAt: new Date(Date.now() - 60 * 60 * 1000), operatorAcceptedAt: new Date(Date.now() - 55 * 60 * 1000) },
  { id: 'ORD003', localId: 'L001', localName: 'Pizzería Don Pepito', deliveryAddress: 'San Martín 2020, Mar del Plata', status: 'retirado_local', assignedRiderId: 'R002', assignedRiderName: 'Ana Gómez', totalAmount: 1200, createdAt: new Date(Date.now() - 15 * 60 * 1000), operatorAcceptedAt: new Date(Date.now() - 13 * 60 * 1000), pickedUpByRiderAt: new Date(Date.now() - 5 * 60 * 1000) },
  { id: 'ORD004', localId: 'L003', localName: 'Hamburguesería El Crack', deliveryAddress: 'Rivadavia 3000, Mar del Plata', status: 'entregado_cliente', assignedRiderId: 'R001', assignedRiderName: 'Juan Pérez', totalAmount: 1800, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), operatorAcceptedAt: new Date(Date.now() - 118 * 60 * 1000), pickedUpByRiderAt: new Date(Date.now() - 90 * 60 * 1000), deliveredToCustomerAt: new Date(Date.now() - 65 * 60 * 1000), paymentStatus: 'deuda_rider' },
  { id: 'ORD005', localId: 'L002', localName: 'Sushi Place', deliveryAddress: 'Moreno 1100, Mar del Plata', status: 'pendiente_aceptacion_op', totalAmount: 3200, createdAt: new Date(Date.now() - 5 * 60 * 1000) },
];

const MOCK_RIDERS: Rider[] = [
  { id: 'R001', name: 'Juan Pérez', email: 'juan@example.com', status: 'online' },
  { id: 'R002', name: 'Ana Gómez', email: 'ana@example.com', status: 'ocupado' },
  { id: 'R003', name: 'Carlos López', email: 'carlos@example.com', status: 'offline' },
];

const MOCK_LOCALS: Local[] = [
    {id: 'L001', name: 'Pizzería Don Pepito', address: 'Av. Colón 1234', email: 'donpepito@example.com'},
    {id: 'L002', name: 'Sushi Place', address: 'Almafuerte 567', email: 'sushiplace@example.com'},
    {id: 'L003', name: 'Hamburguesería El Crack', address: 'Rivadavia 3000', email: 'elcrack@example.com'},
];


const getStatusBadgeVariant = (status: OrderStatus): { variant: "default" | "secondary" | "destructive" | "outline", className?: string, label: string } => {
  switch (status) {
    case 'entregado_cliente':
      return { variant: 'default', className: 'bg-green-500 hover:bg-green-600 text-white', label: 'Entregado' };
    case 'en_camino_retiro':
    case 'retirado_local':
    case 'en_camino_entrega':
      return { variant: 'default', className: 'bg-yellow-500 hover:bg-yellow-600 text-black', label: 'En Proceso' };
    case 'pendiente_asignacion':
      return { variant: 'secondary', className: 'bg-gray-500 hover:bg-gray-600 text-white', label: 'Sin Asignar' };
    case 'asignado_rider':
      return {variant: 'default', className: 'bg-blue-500 hover:bg-blue-600 text-white', label: 'Asignado' };
    case 'pendiente_aceptacion_op':
      return { variant: 'outline', className: 'border-orange-500 text-orange-500', label: 'Nuevo Pedido' };
    case 'cancelado':
      return { variant: 'destructive', label: 'Cancelado' };
    default:
      return { variant: 'outline', label: status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) };
  }
};

const calculateDuration = (startTime: Date | string | undefined): string => {
  if (!startTime) return '-';
  try {
    return formatDistanceToNowStrict(new Date(startTime), { addSuffix: false, locale: es });
  } catch (error) {
    return '-';
  }
};

export default function OperatorDashboardPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS.map(o => ({...o, duration: calculateDuration(o.operatorAcceptedAt)})));
  const [riders, setRiders] = useState<Rider[]>(MOCK_RIDERS);
  const [locals, setLocals] = useState<Local[]>(MOCK_LOCALS);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'todos'>('todos');
  const [localFilter, setLocalFilter] = useState<string | 'todos'>('todos');
  const [riderFilter, setRiderFilter] = useState<string | 'todos'>('todos');

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [orderToAssign, setOrderToAssign] = useState<Order | null>(null);
  const [selectedRiderForAssignment, setSelectedRiderForAssignment] = useState<string | null>(null);

  // Placeholder for Firestore listener effect
  // useEffect(() => { /* Firestore onSnapshot logic for orders, riders, locals */ }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => prevOrders.map(o => ({
        ...o,
        duration: calculateDuration(o.operatorAcceptedAt)
      })));
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);
  

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = searchTerm === '' || 
                            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.localName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'todos' || order.status === statusFilter;
      const matchesLocal = localFilter === 'todos' || order.localId === localFilter;
      const matchesRider = riderFilter === 'todos' || order.assignedRiderId === riderFilter;
      return matchesSearch && matchesStatus && matchesLocal && matchesRider;
    });
  }, [orders, searchTerm, statusFilter, localFilter, riderFilter]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };
  
  const handleOpenAssignModal = (order: Order) => {
    setOrderToAssign(order);
    setSelectedRiderForAssignment(order.assignedRiderId || null);
    setIsAssignModalOpen(true);
  };

  const handleAssignRider = () => {
    if (!orderToAssign || !selectedRiderForAssignment) return;
    // Firestore update logic here
    console.log(`Asignar pedido ${orderToAssign.id} al rider ${selectedRiderForAssignment}`);
    setOrders(prev => prev.map(o => o.id === orderToAssign.id ? {...o, assignedRiderId: selectedRiderForAssignment, assignedRiderName: riders.find(r=>r.id === selectedRiderForAssignment)?.name, status: 'asignado_rider' as OrderStatus} : o));
    setIsAssignModalOpen(false);
    setOrderToAssign(null);
  };
  
  // Unique statuses for filter dropdown
  const uniqueOrderStatuses = useMemo(() => {
    const statuses = new Set<OrderStatus>();
    MOCK_ORDERS.forEach(order => statuses.add(order.status));
    return Array.from(statuses);
  }, []);


  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageTitle 
        title="Panel de Operador" 
        icon={Users} 
        subtitle="Supervisa y gestiona las operaciones diarias."
        actions={
          <Button asChild variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/dashboard/operator/ai-payment-plan"><Bot className="mr-2 h-4 w-4" />Sugerir Plan de Pago</Link>
          </Button>
        }
      />

      {/* Resumen de Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Totales Hoy</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_ORDERS.length}</div>
            <p className="text-xs text-muted-foreground">
              {MOCK_ORDERS.filter(o => o.status === 'pendiente_asignacion' || o.status === 'pendiente_aceptacion_op').length} pendientes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riders Activos</CardTitle>
            <Bike className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {riders.filter(r => r.status === 'online' || r.status === 'ocupado').length} / {riders.length}
            </div>
            <p className="text-xs text-muted-foreground">Online / Total</p>
          </CardContent>
        </Card>
        <Card className="bg-highlighted-section">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximas Entregas</CardTitle>
                <ListOrdered className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {MOCK_ORDERS.filter(o => o.status === 'asignado_rider' || o.status === 'en_camino_retiro' || o.status === 'retirado_local').length}
                </div>
                <p className="text-xs text-muted-foreground">Pedidos en curso</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Deudas de Riders</CardTitle>
                <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-destructive">$1250.00</div>
                <p className="text-xs text-muted-foreground">Total pendiente</p>
            </CardContent>
        </Card>
      </div>
      
      {/* Sección Gestión de Pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Pedidos Pendientes</CardTitle>
          <CardDescription>Visualiza y gestiona los pedidos en tiempo real.</CardDescription>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Buscar por ID, local, dirección..." 
                className="pl-8 sm:w-full md:w-[300px] lg:w-[400px] bg-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | 'todos')}>
                <SelectTrigger className="w-full md:w-[180px] bg-input">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los Estados</SelectItem>
                  {uniqueOrderStatuses.map(status => (
                    <SelectItem key={status} value={status}>{getStatusBadgeVariant(status).label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={localFilter} onValueChange={(value) => setLocalFilter(value as string)}>
                <SelectTrigger className="w-full md:w-[180px] bg-input">
                  <SelectValue placeholder="Filtrar por local" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los Locales</SelectItem>
                  {locals.map(local => (
                    <SelectItem key={local.id} value={local.id}>{local.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
               <Select value={riderFilter} onValueChange={(value) => setRiderFilter(value as string)}>
                <SelectTrigger className="w-full md:w-[180px] bg-input">
                  <SelectValue placeholder="Filtrar por repartidor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los Repartidores</SelectItem>
                  {riders.map(rider => (
                    <SelectItem key={rider.id} value={rider.id}>{rider.name}</SelectItem>
                  ))}
                  <SelectItem value="no_asignado">No Asignado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Repartidor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const statusInfo = getStatusBadgeVariant(order.status);
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id.slice(-4)}</TableCell>
                    <TableCell>{order.localName}</TableCell>
                    <TableCell>{order.deliveryAddress}</TableCell>
                    <TableCell>{order.assignedRiderName || <span className="text-muted-foreground italic">No asignado</span>}</TableCell>
                    <TableCell>
                      <Badge variant={statusInfo.variant} className={statusInfo.className}>{statusInfo.label}</Badge>
                      {order.paymentStatus === 'deuda_rider' && (
                        <Badge variant="destructive" className="ml-2">Deuda</Badge>
                      )}
                    </TableCell>
                    <TableCell>{order.duration}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                            <Eye className="mr-2 h-4 w-4" /> Ver / Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenAssignModal(order)} disabled={order.status === 'entregado_cliente' || order.status === 'cancelado'}>
                            <Bike className="mr-2 h-4 w-4" /> Asignar Repartidor
                          </DropdownMenuItem>
                           <DropdownMenuItem>
                            <CreditCardIcon className="mr-2 h-4 w-4" /> Ver Deuda
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filteredOrders.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No se encontraron pedidos con los filtros actuales.</p>
          )}
        </CardContent>
      </Card>

      {/* Placeholder: Sección de Asignación de Pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Asignación Rápida de Pedidos</CardTitle>
          <CardDescription>Selecciona un repartidor para ver y asignar pedidos.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Label htmlFor="rider-select-assignment">Seleccionar Repartidor</Label>
            <Select>
              <SelectTrigger id="rider-select-assignment" className="mt-1 bg-input">
                <SelectValue placeholder="Elige un repartidor" />
              </SelectTrigger>
              <SelectContent>
                {riders.filter(r => r.status === 'online').map(rider => (
                  <SelectItem key={rider.id} value={rider.id}>{rider.name} (Online)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-secondary/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pedidos Pendientes (Local X)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <div className="space-y-2 max-h-60 overflow-y-auto p-1">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-center gap-2 p-2 border rounded-md bg-background">
                       <Checkbox id={`pending-assign-${i}`} /> <Label htmlFor={`pending-assign-${i}`}>Pedido #ORD00${i+5} - Sushi Place</Label>
                    </div>
                  ))}
                </div>
                <Button size="sm" className="mt-4 w-full">Asignar Seleccionados</Button>
              </CardContent>
            </Card>
            <Card className="bg-secondary/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Asignados a [Rider]</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Lista de pedidos ya asignados al repartidor seleccionado.</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder: Vista Resumen de Deudas */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Deudas Pendientes</CardTitle>
          <Button variant="outline" size="sm" asChild className="float-right">
            <Link href="/dashboard/debts">Ver Todas las Deudas</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Tabla resumida de deudas entre locales y repartidores.</p>
        </CardContent>
      </Card>

      {/* Modal Detalles del Pedido */}
      {selectedOrder && (
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalles del Pedido #{selectedOrder.id.slice(-4)}</DialogTitle>
              <DialogDescription>Local: {selectedOrder.localName}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p><strong>Dirección:</strong> {selectedOrder.deliveryAddress}</p>
              <p><strong>Repartidor:</strong> {selectedOrder.assignedRiderName || 'No asignado'}</p>
              <p><strong>Estado:</strong> <Badge variant={getStatusBadgeVariant(selectedOrder.status).variant} className={getStatusBadgeVariant(selectedOrder.status).className}>{getStatusBadgeVariant(selectedOrder.status).label}</Badge></p>
              <p><strong>Monto:</strong> ${selectedOrder.totalAmount.toFixed(2)}</p>
              <p><strong>Creado:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              {/* Historial de estados y observaciones irían aquí */}
              <Textarea placeholder="Observaciones internas..." defaultValue={selectedOrder.internalNotes} className="bg-input" />
            </div>
            <DialogFooter className="sm:justify-between">
              <Button variant="outline">Marcar Entregado al Repartidor</Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cerrar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal Asignar Repartidor */}
      {orderToAssign && (
        <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Asignar Repartidor al Pedido #{orderToAssign.id.slice(-4)}</DialogTitle>
              <DialogDescription>Local: {orderToAssign.localName}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="rider-select">Seleccionar Repartidor</Label>
              <Select value={selectedRiderForAssignment || undefined} onValueChange={setSelectedRiderForAssignment}>
                <SelectTrigger id="rider-select" className="w-full mt-1 bg-input">
                  <SelectValue placeholder="Elige un repartidor" />
                </SelectTrigger>
                <SelectContent>
                  {riders.filter(r => r.status === 'online').map(rider => (
                    <SelectItem key={rider.id} value={rider.id}>{rider.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
               <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="button" onClick={handleAssignRider} disabled={!selectedRiderForAssignment}>
                Confirmar Asignación
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

