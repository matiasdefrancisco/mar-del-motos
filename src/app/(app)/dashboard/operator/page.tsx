'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PageTitle from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  ClipboardList, 
  Bike, 
  Bot, 
  MoreHorizontal, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  UserPlus, 
  CreditCardIcon, 
  ListOrdered, 
  PlusCircle, 
  History, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  Phone, 
  CheckCircle, 
  XCircle,
  Package,
  TrendingUp,
  Activity
} from 'lucide-react';
import type { Order, OrderStatus, Rider, Local } from '@/lib/types';
import { formatDistanceToNowStrict } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { cn } from '@/lib/utils'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock Data - Reemplazar con Firestore
const MOCK_ORDERS: Order[] = [
  { id: 'ORD001', localId: 'L001', localName: 'Pizzería Don Pepito', deliveryAddress: 'Av. Colón 1234, Mar del Plata', assignedRiderId: 'R001', assignedRiderName: 'Juan Pérez', status: 'en_camino_retiro', totalAmount: 1500, createdAt: new Date(Date.now() - 30 * 60 * 1000), operatorAcceptedAt: new Date(Date.now() - 28 * 60 * 1000) },
  { id: 'ORD002', localId: 'L002', localName: 'Sushi Place', deliveryAddress: 'Almafuerte 567, Mar del Plata', status: 'pendiente_asignacion', totalAmount: 2500, createdAt: new Date(Date.now() - 60 * 60 * 1000), operatorAcceptedAt: new Date(Date.now() - 55 * 60 * 1000) },
  { id: 'ORD003', localId: 'L001', localName: 'Pizzería Don Pepite', deliveryAddress: 'San Martín 2020, Mar del Plata', status: 'retirado_local', assignedRiderId: 'R002', assignedRiderName: 'Ana Gómez', totalAmount: 1200, createdAt: new Date(Date.now() - 15 * 60 * 1000), operatorAcceptedAt: new Date(Date.now() - 13 * 60 * 1000), pickedUpByRiderAt: new Date(Date.now() - 5 * 60 * 1000) },
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
    case 'entregado_cliente':
      return { variant: 'default', className: 'bg-green-600 text-white hover:bg-green-700', label: 'Entregado' };
    case 'en_camino_retiro':
      return { variant: 'default', className: 'bg-blue-600 text-white hover:bg-blue-700', label: 'Camino a Local' };
    case 'retirado_local':
      return { variant: 'default', className: 'bg-purple-600 text-white hover:bg-purple-700', label: 'Retirado' };
    case 'en_camino_entrega':
      return { variant: 'default', className: 'bg-orange-600 text-white hover:bg-orange-700', label: 'Camino Cliente' };
    case 'pendiente_asignacion':
      return { variant: 'outline', className: 'text-gray-400 border-gray-600', label: 'Sin Asignar' };
    case 'asignado_rider':
      return { variant: 'default', className: 'bg-cyan-600 text-white hover:bg-cyan-700', label: 'Asignado' };
    case 'pendiente_aceptacion_op':
      return { variant: 'default', className: 'bg-[#ffd700] text-black hover:bg-[#ffd700]/90 font-semibold', label: 'Nuevo Pedido' };
    case 'cancelado':
      return { variant: 'destructive', label: 'Cancelado' };
    default:
      const defaultLabel = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return { variant: 'secondary', label: defaultLabel };
  }
};

const toSafeDate = (dateValue: Date | import('firebase/firestore').Timestamp | string | undefined): Date => {
  if (!dateValue) return new Date();
  
  if (dateValue instanceof Date) {
    return dateValue;
  } else if (typeof dateValue === 'string') {
    return new Date(dateValue);
  } else if (dateValue && typeof dateValue === 'object' && 'toDate' in dateValue) {
    return dateValue.toDate();
  } else {
    return new Date(dateValue as any);
  }
};

const calculateDuration = (startTime: Date | import('firebase/firestore').Timestamp | string | undefined): string => {
  if (!startTime) return '-';
  try {
    const date = toSafeDate(startTime);
    return formatDistanceToNowStrict(date, { addSuffix: false, locale: es });
  } catch (error) {
    console.error("Error calculating duration:", error);
    return '-';
  }
};

export default function OperatorDashboardPage() {
  const { currentUser } = useAuth();
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

  // Estadísticas calculadas
  const stats = {
    pendingOrders: orders.filter(o => o.status === 'pendiente_asignacion' || o.status === 'pendiente_aceptacion_op').length,
    activeOrders: orders.filter(o => ['asignado_rider', 'en_camino_retiro', 'retirado_local', 'en_camino_entrega'].includes(o.status)).length,
    availableRiders: riders.filter(r => r.status === 'online').length,
    totalRiders: riders.length
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-[#333333] p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Panel de Operador</h1>
            <p className="text-gray-400 mt-1">Supervisa y gestiona las operaciones diarias de Mar del Motos</p>
          </div>
          <Button asChild className="bg-[#ffd700] hover:bg-[#ffd700]/90 text-black font-medium">
            <Link href="/dashboard/operator/ai-payment-plan">
              <Bot className="mr-2 h-4 w-4" />
              Sugerir Plan de Pago IA
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-[#2d2d2d] border-[#333333]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Pedidos Pendientes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-[#ffd700]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.pendingOrders}</div>
              <p className="text-xs text-gray-400">Requieren atención</p>
            </CardContent>
          </Card>

          <Card className="bg-[#2d2d2d] border-[#333333]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Pedidos Activos</CardTitle>
              <Activity className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeOrders}</div>
              <p className="text-xs text-gray-400">En proceso</p>
            </CardContent>
          </Card>

          <Card className="bg-[#2d2d2d] border-[#333333]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Riders Disponibles</CardTitle>
              <Bike className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.availableRiders}</div>
              <p className="text-xs text-gray-400">de {stats.totalRiders} total</p>
            </CardContent>
          </Card>

          <Card className="bg-[#2d2d2d] border-[#333333]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Ingresos Hoy</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#ffd700]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$12,450</div>
              <p className="text-xs text-green-400">+15% vs ayer</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="bg-[#2d2d2d] border border-[#333333]">
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-[#ffd700] data-[state=active]:text-black text-gray-300"
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Gestión de Pedidos
            </TabsTrigger>
            <TabsTrigger 
              value="riders" 
              className="data-[state=active]:bg-[#ffd700] data-[state=active]:text-black text-gray-300"
            >
              <Bike className="mr-2 h-4 w-4" />
              Riders Activos
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-[#ffd700] data-[state=active]:text-black text-gray-300"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Análisis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            {/* Filters */}
            <Card className="bg-[#2d2d2d] border-[#333333]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros de Búsqueda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar pedidos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-[#1a1a1a] border-[#333333] text-white"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | 'todos')}>
                    <SelectTrigger className="bg-[#1a1a1a] border-[#333333] text-white">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2d2d2d] border-[#333333]">
                      <SelectItem value="todos" className="text-white">Todos los estados</SelectItem>
                      {uniqueOrderStatuses.map(status => (
                        <SelectItem key={status} value={status} className="text-white">
                          {getStatusBadgeInfo(status).label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={localFilter} onValueChange={setLocalFilter}>
                    <SelectTrigger className="bg-[#1a1a1a] border-[#333333] text-white">
                      <SelectValue placeholder="Local" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2d2d2d] border-[#333333]">
                      <SelectItem value="todos" className="text-white">Todos los locales</SelectItem>
                      {locals.map(local => (
                        <SelectItem key={local.id} value={local.id} className="text-white">
                          {local.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={riderFilter} onValueChange={setRiderFilter}>
                    <SelectTrigger className="bg-[#1a1a1a] border-[#333333] text-white">
                      <SelectValue placeholder="Rider" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2d2d2d] border-[#333333]">
                      <SelectItem value="todos" className="text-white">Todos los riders</SelectItem>
                      <SelectItem value="no_asignado" className="text-white">Sin asignar</SelectItem>
                      {riders.map(rider => (
                        <SelectItem key={rider.id} value={rider.id} className="text-white">
                          {rider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Orders List */}
            <Card className="bg-[#2d2d2d] border-[#333333]">
              <CardHeader>
                <CardTitle className="text-white">
                  Pedidos ({filteredOrders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredOrders.map((order) => {
                    const statusInfo = getStatusBadgeInfo(order.status);
                    return (
                      <div
                        key={order.id}
                        className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-4 hover:border-[#ffd700]/30 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">{order.id}</span>
                              <Badge className={cn(statusInfo.className)} variant={statusInfo.variant}>
                                {statusInfo.label}
                              </Badge>
                            </div>
                            
                            <div className="text-sm text-gray-300">
                              <div className="flex items-center gap-1 mb-1">
                                <Package className="h-3 w-3" />
                                {order.localName}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {order.deliveryAddress}
                              </div>
                            </div>

                            {order.assignedRiderName && (
                              <div className="flex items-center gap-1 text-sm text-blue-400">
                                <Bike className="h-3 w-3" />
                                {order.assignedRiderName}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <div className="text-right">
                              <div className="font-bold text-[#ffd700]">${order.totalAmount}</div>
                              <div className="text-xs text-gray-400">
                                {calculateDuration(order.createdAt)}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(order)}
                                className="border-[#333333] text-gray-300 hover:bg-[#333333]"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              
                              {(order.status === 'pendiente_asignacion' || order.assignedRiderId) && (
                                <Button
                                  size="sm"
                                  onClick={() => handleOpenAssignModal(order)}
                                  className="bg-[#ffd700] hover:bg-[#ffd700]/90 text-black"
                                >
                                  <UserPlus className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredOrders.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      No se encontraron pedidos con los filtros aplicados
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="riders" className="space-y-4">
            <Card className="bg-[#2d2d2d] border-[#333333]">
              <CardHeader>
                <CardTitle className="text-white">Estado de Riders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {riders.map((rider) => (
                    <div
                      key={rider.id}
                      className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-white">{rider.name}</h3>
                        <Badge
                          className={cn(
                            rider.status === 'online' ? 'bg-green-600 text-white' :
                            rider.status === 'ocupado' ? 'bg-orange-600 text-white' :
                            'bg-gray-600 text-white'
                          )}
                        >
                          {rider.status === 'online' ? 'Disponible' :
                           rider.status === 'ocupado' ? 'Ocupado' : 'Desconectado'}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-400 space-y-1">
                        <div>{rider.email}</div>
                        <div>
                          Pedidos activos: {orders.filter(o => o.assignedRiderId === rider.id && 
                            ['asignado_rider', 'en_camino_retiro', 'retirado_local', 'en_camino_entrega'].includes(o.status)).length}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-[#2d2d2d] border-[#333333]">
                <CardHeader>
                  <CardTitle className="text-white">Pedidos por Estado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {uniqueOrderStatuses.map(status => {
                      const count = orders.filter(o => o.status === status).length;
                      const percentage = (count / orders.length) * 100;
                      const statusInfo = getStatusBadgeInfo(status);
                      
                      return (
                        <div key={status} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-300">{statusInfo.label}</span>
                            <span className="text-sm font-medium text-white">{count}</span>
                          </div>
                          <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                            <div
                              className="bg-[#ffd700] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#2d2d2d] border-[#333333]">
                <CardHeader>
                  <CardTitle className="text-white">Rendimiento de Riders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {riders.map(rider => {
                      const riderOrders = orders.filter(o => o.assignedRiderId === rider.id);
                      const completedOrders = riderOrders.filter(o => o.status === 'entregado_cliente').length;
                      
                      return (
                        <div key={rider.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-300">{rider.name}</span>
                            <span className="text-sm font-medium text-white">{completedOrders} entregados</span>
                          </div>
                          <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${riderOrders.length > 0 ? (completedOrders / riderOrders.length) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="bg-[#2d2d2d] border-[#333333] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Pedido</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">ID del Pedido</Label>
                  <div className="font-medium">{selectedOrder.id}</div>
                </div>
                <div>
                  <Label className="text-gray-300">Estado</Label>
                  <div>
                    <Badge className={cn(getStatusBadgeInfo(selectedOrder.status).className)} 
                           variant={getStatusBadgeInfo(selectedOrder.status).variant}>
                      {getStatusBadgeInfo(selectedOrder.status).label}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Local</Label>
                <div className="font-medium">{selectedOrder.localName}</div>
              </div>

              <div>
                <Label className="text-gray-300">Dirección de Entrega</Label>
                <div className="font-medium">{selectedOrder.deliveryAddress}</div>
              </div>

              {selectedOrder.assignedRiderName && (
                <div>
                  <Label className="text-gray-300">Rider Asignado</Label>
                  <div className="font-medium">{selectedOrder.assignedRiderName}</div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Monto Total</Label>
                  <div className="font-bold text-[#ffd700]">${selectedOrder.totalAmount}</div>
                </div>
                <div>
                  <Label className="text-gray-300">Tiempo Transcurrido</Label>
                  <div className="font-medium">{calculateDuration(selectedOrder.createdAt)}</div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-[#333333] text-gray-300 hover:bg-[#333333]">
                Cerrar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Rider Modal */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="bg-[#2d2d2d] border-[#333333] text-white">
          <DialogHeader>
            <DialogTitle>Asignar Rider</DialogTitle>
            <DialogDescription className="text-gray-400">
              {orderToAssign && `Selecciona un rider para el pedido ${orderToAssign.id}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Rider</Label>
              <Select value={selectedRiderForAssignment || ''} onValueChange={setSelectedRiderForAssignment}>
                <SelectTrigger className="bg-[#1a1a1a] border-[#333333] text-white">
                  <SelectValue placeholder="Seleccionar rider" />
                </SelectTrigger>
                <SelectContent className="bg-[#2d2d2d] border-[#333333]">
                  {riders.filter(r => r.status === 'online').map(rider => (
                    <SelectItem key={rider.id} value={rider.id} className="text-white">
                      {rider.name} - {rider.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-[#333333] text-gray-300 hover:bg-[#333333]">
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              onClick={handleAssignRider}
              disabled={!selectedRiderForAssignment}
              className="bg-[#ffd700] hover:bg-[#ffd700]/90 text-black"
            >
              Asignar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
