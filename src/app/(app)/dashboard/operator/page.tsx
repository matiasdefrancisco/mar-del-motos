
'use client';

import { useState, useEffect, useMemo } from 'react';
import PageTitle from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, ClipboardList, Bike, Bot, MoreHorizontal, Search, Filter, Eye, Edit, UserPlus, CreditCardIcon, ListOrdered, PlusCircle, History } from 'lucide-react';
import type { Order, OrderStatus, Rider, Local } from '@/lib/types';
// import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
// import { firestore } from '@/lib/firebase/config';
import { formatDistanceToNowStrict } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { cn } from '@/lib/utils'; 

// Mock Data - Reemplazar con Firestore
const MOCK_ORDERS: Order[] = [
  { id: 'ORD001', localId: 'L001', localName: 'Pizzería Don Pepito', deliveryAddress: 'Av. Colón 1234, Mar del Plata', assignedRiderId: 'R001', assignedRiderName: 'Juan Pérez', status: 'en_camino_retiro', totalAmount: 1500, createdAt: new Date(Date.now() - 30 * 60 * 1000), operatorAcceptedAt: new Date(Date.now() - 28 * 60 * 1000) },
  { id: 'ORD002', localId: 'L002', localName: 'Sushi Place', deliveryAddress: 'Almafuerte 567, Mar del Plata', status: 'pendiente_asignacion', totalAmount: 2500, createdAt: new Date(Date.now() - 60 * 60 * 1000), operatorAcceptedAt: new Date(Date.now() - 55 * 60 * 1000) },
  { id: 'ORD003', localId: 'L001', localName: 'Pizzería Don Pepito', deliveryAddress: 'San Martín 2020, Mar del Plata', status: 'retirado_local', assignedRiderId: 'R002', assignedRiderName: 'Ana Gómez', totalAmount: 1200, createdAt: new Date(Date.now() - 15 * 60 * 1000), operatorAcceptedAt: new Date(Date.now() - 13 * 60 * 1000), pickedUpByRiderAt: new Date(Date.now() - 5 * 60 * 1000) },
  { id: 'ORD004', localId: 'L003', localName: 'Hamburguesería El Crack', deliveryAddress: 'Rivadavia 3000, Mar del Plata', status: 'entregado_cliente', assignedRiderId: 'R001', assignedRiderName: 'Juan Pérez', totalAmount: 1800, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), operatorAcceptedAt: new Date(Date.now() - 118 * 60 * 1000), pickedUpByRiderAt: new Date(Date.now() - 90 * 60 * 1000), deliveredToCustomerAt: new Date(Date.now() - 65 * 60 * 1000), paymentStatus: 'deuda_rider' },
  { id: 'ORD005', localId: 'L002', localName: 'Sushi Place', deliveryAddress: 'Moreno 1100, Mar del Plata', status: 'pendiente_aceptacion_op', totalAmount: 3200, createdAt: new Date(Date.now() - 5 * 60 * 1000) },
  { id: 'ORD006', localId: 'L001', localName: 'Pizzería Don Pepito', deliveryAddress: 'Belgrano 4500, Mar del Plata', status: 'asignado_rider', assignedRiderId: 'R003', assignedRiderName: 'Carlos López', totalAmount: 950, createdAt: new Date(Date.now() - 40 * 60 * 1000), operatorAcceptedAt: new Date(Date.now() - 38 * 60 * 1000), assignedToRiderAt: new Date(Date.now() - 35 * 60 * 1000) },
  { id: 'ORD007', localId: 'L003', localName: 'Hamburguesería El Crack', deliveryAddress: 'Independencia 900, Mar del Plata', status: 'en_camino_entrega', assignedRiderId: 'R001', assignedRiderName: 'Juan Pérez', totalAmount: 2200, createdAt: new Date(Date.now() - 25 * 60 * 1000), operatorAcceptedAt: new Date(Date.now() - 23 * 60 * 1000), pickedUpByRiderAt: new Date(Date.now() - 15 * 60 * 1000) },
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


const getStatusBadgeInfo = (status: OrderStatus): { variant: BadgeProps["variant"]; className?: string; label: string } => {
  switch (status) {
    case 'entregado_cliente': // Verde (primary)
      return { variant: 'default', label: 'Entregado' };
    case 'en_camino_retiro': // Amarillo/Dorado (accent)
    case 'retirado_local':
    case 'en_camino_entrega':
      return { variant: 'default', className: 'bg-accent text-accent-foreground hover:bg-accent/90', label: status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) };
    case 'pendiente_asignacion': // Gris/Outline (secondary o muted)
      return { variant: 'outline', className: 'text-muted-foreground border-muted', label: 'Sin Asignar' };
    case 'asignado_rider': // Azul (podríamos usar secondary o un color específico si el tema lo permite)
      return { variant: 'secondary', label: 'Asignado' };
    case 'pendiente_aceptacion_op': // Dorado Fuerte (accent)
      return { variant: 'default', className: 'bg-accent text-accent-foreground hover:bg-accent/90 font-semibold', label: 'Nuevo Pedido' };
    case 'cancelado': // Rojo (destructive)
      return { variant: 'destructive', label: 'Cancelado' };
    default:
      const defaultLabel = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return { variant: 'secondary', label: defaultLabel };
  }
};

const calculateDuration = (startTime: Date | string | undefined): string => {
  if (!startTime) return '-';
  try {
    return formatDistanceToNowStrict(new Date(startTime), { addSuffix: false, locale: es });
  } catch (error) {
    console.error("Error calculating duration:", error);
    return '-';
  }
};

export default function OperatorDashboardPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS.map(o => ({...o, duration: calculateDuration(o.operatorAcceptedAt || o.createdAt)})));
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

 useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => prevOrders.map(o => ({
        ...o,
        duration: calculateDuration(o.operatorAcceptedAt || o.createdAt)
      })));
    }, 60000); 
    return () => clearInterval(interval);
  }, []);
  

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
                            order.id.toLowerCase().includes(searchLower) ||
                            order.localName.toLowerCase().includes(searchLower) ||
                            order.deliveryAddress.toLowerCase().includes(searchLower) ||
                            (order.assignedRiderName && order.assignedRiderName.toLowerCase().includes(searchLower));
      const matchesStatus = statusFilter === 'todos' || order.status === statusFilter;
      const matchesLocal = localFilter === 'todos' || order.localId === localFilter;
      const matchesRider = riderFilter === 'todos' || order.assignedRiderId === riderFilter || (riderFilter === 'no_asignado' && !order.assignedRiderId);
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
    console.log(`Asignar pedido ${orderToAssign.id} al rider ${selectedRiderForAssignment}`);
    const riderName = riders.find(r => r.id === selectedRiderForAssignment)?.name || 'Desconocido';
    setOrders(prev => prev.map(o => 
      o.id === orderToAssign.id 
      ? {...o, assignedRiderId: selectedRiderForAssignment, assignedRiderName: riderName, status: 'asignado_rider' as OrderStatus} 
      : o
    ));
    setIsAssignModalOpen(false);
    setOrderToAssign(null);
    setSelectedRiderForAssignment(null);
  };
  
  const uniqueOrderStatuses = useMemo(() => {
    const statuses = new Set<OrderStatus>();
    MOCK_ORDERS.forEach(order => statuses.add(order.status));
    return Array.from(statuses).sort();
  }, []);

  return (
    <div className="flex flex-col gap-6"> 
      <PageTitle 
        title="Panel de Operador" 
        icon={Users} 
        subtitle="Supervisa y gestiona las operaciones diarias de Mar del Motos."
        actions={
          <Button asChild variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground h-auto whitespace-normal text-sm">
            <Link href="/dashboard/operator/ai-payment-plan">
              <Bot className="mr-2 h-4 w-4 shrink-0" />
              <span>Sugerir Plan de Pago IA</span>
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Totales Hoy</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">
              {orders.filter(o => o.status === 'pendiente_asignacion' || o.status === 'pendiente_aceptacion_op').length} pendientes
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
                    {orders.filter(o => o.status === 'asignado_rider' || o.status === 'en_camino_retiro' || o.status === 'retirado_local' || o.status === 'en_camino_entrega').length}
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
      
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Pedidos Pendientes</CardTitle>
          <CardDescription>Visualiza y gestiona los pedidos en tiempo real. Filtra y busca para encontrar pedidos específicos.</CardDescription>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center">
            <div className="relative w-full md:w-auto md:flex-grow md:max-w-[300px] lg:max-w-[400px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Buscar ID, local, dirección, repartidor..." 
                className="pl-8 w-full bg-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | 'todos')}>
              <SelectTrigger className="w-full md:w-auto md:flex-grow md:min-w-[180px] bg-input">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los Estados</SelectItem>
                {uniqueOrderStatuses.map(status => {
                  const statusInfo = getStatusBadgeInfo(status);
                  return <SelectItem key={status} value={status}>{statusInfo.label}</SelectItem>;
                })}
              </SelectContent>
            </Select>
            <Select value={localFilter} onValueChange={(value) => setLocalFilter(value as string)}>
              <SelectTrigger className="w-full md:w-auto md:flex-grow md:min-w-[180px] bg-input">
                <SelectValue placeholder="Local" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los Locales</SelectItem>
                {locals.map(local => (
                  <SelectItem key={local.id} value={local.id}>{local.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={riderFilter} onValueChange={(value) => setRiderFilter(value as string)}>
              <SelectTrigger className="w-full md:w-auto md:flex-grow md:min-w-[180px] bg-input">
                <SelectValue placeholder="Repartidor" />
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
                const statusInfo = getStatusBadgeInfo(order.status);
                return (
                  <TableRow key={order.id} className={cn(order.status === 'pendiente_aceptacion_op' ? 'bg-accent/10' : '')}>
                    <TableCell className="font-medium">#{order.id.slice(-4)}</TableCell>
                    <TableCell>{order.localName}</TableCell>
                    <TableCell>{order.deliveryAddress}</TableCell>
                    <TableCell>{order.assignedRiderName || <span className="text-muted-foreground italic">No asignado</span>}</TableCell>
                    <TableCell>
                      <Badge variant={statusInfo.variant} className={cn(statusInfo.className, 'cursor-default')}>
                        {statusInfo.label}
                      </Badge>
                      {order.paymentStatus === 'deuda_rider' && (
                        <Badge variant="outline" className="ml-2 cursor-default text-destructive border-transparent bg-transparent">Deuda</Badge>
                      )}
                    </TableCell>
                    <TableCell>{order.duration}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Acciones del pedido</span>
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

      <Card>
        <CardHeader>
          <CardTitle>Asignación Rápida de Pedidos</CardTitle>
          <CardDescription>Selecciona un repartidor disponible y asígnale pedidos pendientes.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Label htmlFor="rider-select-assignment">Seleccionar Repartidor</Label>
            <Select>
              <SelectTrigger id="rider-select-assignment" className="mt-1 bg-input w-full">
                <SelectValue placeholder="Elige un repartidor online" />
              </SelectTrigger>
              <SelectContent>
                {riders.filter(r => r.status === 'online').map(rider => (
                  <SelectItem key={rider.id} value={rider.id}>{rider.name} (Online)</SelectItem>
                ))}
                 {riders.filter(r => r.status === 'online').length === 0 && (
                    <SelectItem value="no_online" disabled>No hay riders online</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-secondary/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pedidos Pendientes de Asignar</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="space-y-2 max-h-60 overflow-y-auto p-1">
                  {orders.filter(o => o.status === 'pendiente_asignacion' || o.status === 'pendiente_aceptacion_op').slice(0,5).map(order => ( 
                    <div key={order.id} className="flex items-center gap-2 p-2 border rounded-md bg-background shadow-sm">
                       <Checkbox id={`pending-assign-${order.id}`} /> 
                       <Label htmlFor={`pending-assign-${order.id}`} className="text-xs">#{order.id.slice(-4)} - {order.localName}</Label>
                    </div>
                  ))}
                  {orders.filter(o => o.status === 'pendiente_asignacion' || o.status === 'pendiente_aceptacion_op').length === 0 && (
                    <p className="text-muted-foreground text-xs">No hay pedidos pendientes de asignar.</p>
                  )}
                </div>
                <Button size="sm" className="mt-4 w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={orders.filter(o => o.status === 'pendiente_asignacion' || o.status === 'pendiente_aceptacion_op').length === 0}>
                  Asignar Seleccionados
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-secondary/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Asignados a [Repartidor Sel.]</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p className="text-xs">Lista de pedidos ya asignados al repartidor seleccionado aparecerá aquí.</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Resumen de Deudas Pendientes</CardTitle>
            <CardDescription>Deudas principales entre locales y repartidores.</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/debts"><ListOrdered className="mr-2 h-3 w-3" /> Ver Todas las Deudas</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Una tabla resumida de deudas pendientes irá aquí.</p>
        </CardContent>
      </Card>

      {selectedOrder && (
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalles del Pedido #{selectedOrder.id.slice(-4)}</DialogTitle>
              <DialogDescription>Local: {selectedOrder.localName} - Total: ${selectedOrder.totalAmount.toFixed(2)}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div><strong>Dirección:</strong> {selectedOrder.deliveryAddress}</div>
                <div><strong>Cliente:</strong> {selectedOrder.customerName || 'N/A'}</div>
                <div><strong>Teléfono Cliente:</strong> {selectedOrder.customerPhone || 'N/A'}</div>
                <div><strong>Creado:</strong> {new Date(selectedOrder.createdAt).toLocaleString('es-AR')}</div>
                <div><strong>Aceptado Op.:</strong> {selectedOrder.operatorAcceptedAt ? new Date(selectedOrder.operatorAcceptedAt).toLocaleString('es-AR') : 'N/A'}</div>
                 <div><strong>Repartidor:</strong> {selectedOrder.assignedRiderName || 'No asignado'}</div>
                <div><strong>Asignado Rider:</strong> {selectedOrder.assignedToRiderAt ? new Date(selectedOrder.assignedToRiderAt).toLocaleString('es-AR') : 'N/A'}</div>
                <div><strong>Retirado Local:</strong> {selectedOrder.pickedUpByRiderAt ? new Date(selectedOrder.pickedUpByRiderAt).toLocaleString('es-AR') : 'N/A'}</div>
                <div><strong>Entregado Cliente:</strong> {selectedOrder.deliveredToCustomerAt ? new Date(selectedOrder.deliveredToCustomerAt).toLocaleString('es-AR') : 'N/A'}</div>
              </div>
              
              <div>
                <strong>Estado Actual:</strong> <Badge variant={getStatusBadgeInfo(selectedOrder.status).variant} className={cn(getStatusBadgeInfo(selectedOrder.status).className, 'ml-1')}>{getStatusBadgeInfo(selectedOrder.status).label}</Badge>
                 {selectedOrder.paymentStatus === 'deuda_rider' && <Badge variant="destructive" className="ml-2">Deuda Rider</Badge>}
              </div>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <h4 className="font-medium mb-1">Items del Pedido:</h4>
                  <ul className="list-disc list-inside pl-1 text-xs space-y-0.5">
                    {selectedOrder.items.map((item, index) => (
                      <li key={index}>{item.quantity}x {item.name} (${item.price.toFixed(2)} c/u)</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                 <h4 className="font-medium mb-1 mt-2">Historial de Estados:</h4>
                 <p className="text-xs text-muted-foreground">(El historial de cambios de estado se mostrará aquí)</p>
              </div>

              <div className="mt-2">
                <Label htmlFor="internalNotes">Observaciones Internas (Operador)</Label>
                <Textarea 
                  id="internalNotes" 
                  placeholder="Añade notas visibles solo para operadores..." 
                  defaultValue={selectedOrder.internalNotes} 
                  className="bg-input mt-1 text-sm" 
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-between flex-wrap gap-2">
              <Button variant="outline" onClick={() => alert("Funcionalidad 'Marcar Entregado al Repartidor' pendiente.")} 
                disabled={selectedOrder.status !== 'en_camino_entrega' && selectedOrder.status !== 'retirado_local'}
              >
                Marcar Entregado al Repartidor
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cerrar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {orderToAssign && (
        <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Asignar Repartidor al Pedido #{orderToAssign.id.slice(-4)}</DialogTitle>
              <DialogDescription>Local: {orderToAssign.localName} - Dirección: {orderToAssign.deliveryAddress}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="rider-select-modal">Seleccionar Repartidor</Label>
              <Select value={selectedRiderForAssignment || ""} onValueChange={setSelectedRiderForAssignment}>
                <SelectTrigger id="rider-select-modal" className="w-full mt-1 bg-input">
                  <SelectValue placeholder="Elige un repartidor disponible" />
                </SelectTrigger>
                <SelectContent>
                  {riders.filter(r => r.status === 'online').map(rider => (
                    <SelectItem key={rider.id} value={rider.id}>{rider.name} (Online)</SelectItem>
                  ))}
                  {riders.filter(r => r.status === 'online').length === 0 && (
                    <SelectItem value="no_online_modal" disabled>No hay riders online</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
               <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="button" onClick={handleAssignRider} disabled={!selectedRiderForAssignment} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Bike className="mr-2 h-4 w-4" /> Confirmar Asignación
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
