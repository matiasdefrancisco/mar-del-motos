'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PageTitle from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ClipboardList, 
  PlusCircle, 
  Eye, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Package,
  Star,
  MessageSquare,
  DollarSign
} from 'lucide-react';

// Tipos específicos para esta página
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderObservation {
  id: string;
  type: 'mala_presentacion' | 'mochila_mal_estado' | 'sin_casco' | 'mala_educacion' | 'otros';
  description: string;
  createdAt: Date;
}

interface LocalOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'peticion_enviada' | 'repartidor_en_camino' | 'pedido_retirado' | 'saldo_definido' | 'entregado_repartidor';
  assignedRiderName: string;
  createdAt: Date;
  eta?: string;
  specialInstructions?: string;
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia';
  observations: OrderObservation[];
}

// Mock data - Reemplazar con Firebase
const MOCK_ORDERS: LocalOrder[] = [
  {
    id: 'ORD001',
    customerName: 'Juan Pérez',
    customerPhone: '223-123-4567',
    deliveryAddress: 'Av. Colón 1234, Mar del Plata',
    items: [
      { name: 'Pizza Napolitana', quantity: 1, price: 1200 },
      { name: 'Coca Cola 1.5L', quantity: 1, price: 300 }
    ],
    totalAmount: 1500,
    status: 'peticion_enviada' as const,
    assignedRiderName: 'Carlos López',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    eta: '25 min',
    specialInstructions: 'Tocar timbre, departamento 4B',
    paymentMethod: 'efectivo' as const,
    observations: []
  },
  {
    id: 'ORD002',
    customerName: 'María García',
    customerPhone: '223-987-6543',
    deliveryAddress: 'San Martín 567, Mar del Plata',
    items: [
      { name: 'Hamburguesa Completa', quantity: 2, price: 800 }
    ],
    totalAmount: 1600,
    status: 'repartidor_en_camino' as const,
    assignedRiderName: 'Ana Rodríguez',
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
    eta: '10 min',
    paymentMethod: 'tarjeta' as const,
    observations: []
  },
  {
    id: 'ORD003',
    customerName: 'Roberto Silva',
    customerPhone: '223-456-7890',
    deliveryAddress: 'Belgrano 890, Mar del Plata',
    items: [
      { name: 'Empanadas x12', quantity: 1, price: 2400 }
    ],
    totalAmount: 2400,
    status: 'pedido_retirado' as const,
    assignedRiderName: 'Luis Martín',
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
    paymentMethod: 'efectivo' as const,
    observations: [
      {
        id: 'OBS001',
        type: 'mala_presentacion',
        description: 'Uniforme sucio',
        createdAt: new Date()
      }
    ]
  }
];

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'peticion_enviada':
      return { label: 'Enviado', variant: 'secondary' as const, color: 'text-blue-600' };
    case 'repartidor_en_camino':
      return { label: 'En Camino', variant: 'default' as const, color: 'text-yellow-600' };
    case 'pedido_retirado':
      return { label: 'Retirado', variant: 'default' as const, color: 'text-orange-600' };
    case 'saldo_definido':
      return { label: 'Saldo Definido', variant: 'outline' as const, color: 'text-purple-600' };
    case 'entregado_repartidor':
      return { label: 'Entregado', variant: 'default' as const, color: 'text-green-600' };
    default:
      return { label: status, variant: 'secondary' as const, color: 'text-gray-600' };
  }
};

const getObservationTypeLabel = (type: string) => {
  switch (type) {
    case 'mala_presentacion':
      return 'Mala Presentación';
    case 'mochila_mal_estado':
      return 'Mochila en Mal Estado';
    case 'sin_casco':
      return 'Sin Casco';
    case 'mala_educacion':
      return 'Mala Educación';
    case 'otros':
      return 'Otros';
    default:
      return type;
  }
};

export default function LocalPedidosPage() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<LocalOrder[]>(MOCK_ORDERS);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<LocalOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isObservationModalOpen, setIsObservationModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  // Formulario nuevo pedido
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    items: [{ name: '', quantity: 1, price: 0 }],
    specialInstructions: '',
    paymentMethod: 'efectivo' as const
  });

  // Formulario observación
  const [newObservation, setNewObservation] = useState<{
    type: OrderObservation['type'];
    description: string;
  }>({
    type: 'otros',
    description: ''
  });

  // Formulario definir saldo
  const [paymentData, setPaymentData] = useState({
    amountPaid: 0,
    amountOwed: 0,
    notes: ''
  });

  const handleCreateOrder = () => {
    const totalAmount = newOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const order: LocalOrder = {
      id: `ORD${String(orders.length + 1).padStart(3, '0')}`,
      ...newOrder,
      totalAmount,
      status: 'peticion_enviada',
      assignedRiderName: '', // Inicialmente sin asignar
      createdAt: new Date(),
      eta: '', // Sin ETA inicial
      observations: []
    };

    setOrders(prev => [order, ...prev]);
    setNewOrder({
      customerName: '',
      customerPhone: '',
      deliveryAddress: '',
      items: [{ name: '', quantity: 1, price: 0 }],
      specialInstructions: '',
      paymentMethod: 'efectivo'
    });
    setIsCreateOrderOpen(false);
  };

  const handleAddObservation = () => {
    if (!selectedOrder) return;

    const observation: OrderObservation = {
      id: `OBS${Date.now()}`,
      ...newObservation,
      createdAt: new Date()
    };

    setOrders(prev => prev.map(order => 
      order.id === selectedOrder.id 
        ? { ...order, observations: [...order.observations, observation] }
        : order
    ));

    setNewObservation({ type: 'otros', description: '' });
    setIsObservationModalOpen(false);
  };

  const handleDefinePayment = () => {
    if (!selectedOrder) return;

    setOrders(prev => prev.map(order => 
      order.id === selectedOrder.id 
        ? { 
            ...order, 
            status: 'saldo_definido' as LocalOrder['status']
            // Nota: amountPaid, amountOwed y paymentNotes se manejarían en una colección separada en Firebase
          }
        : order
    ));

    setPaymentData({ amountPaid: 0, amountOwed: 0, notes: '' });
    setIsPaymentModalOpen(false);
  };

  const addItem = () => {
    setNewOrder(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const filteredOrders = {
    active: orders.filter(o => ['peticion_enviada', 'repartidor_en_camino', 'pedido_retirado'].includes(o.status)),
    completed: orders.filter(o => ['saldo_definido', 'entregado_repartidor'].includes(o.status)),
    all: orders
  };

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Gestión de Pedidos"
        icon={ClipboardList} 
        subtitle="Administra todos tus pedidos y su estado de entrega."
        actions={
          <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Pedido
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Pedido</DialogTitle>
                <DialogDescription>
                  Completa la información del pedido para enviarlo al sistema.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Nombre del Cliente</Label>
                    <Input
                      id="customerName"
                      value={newOrder.customerName}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Teléfono</Label>
                    <Input
                      id="customerPhone"
                      value={newOrder.customerPhone}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, customerPhone: e.target.value }))}
                      placeholder="223-123-4567"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="deliveryAddress">Dirección de Entrega</Label>
                  <Input
                    id="deliveryAddress"
                    value={newOrder.deliveryAddress}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                    placeholder="Av. Colón 1234, Mar del Plata"
                  />
                </div>

                <div>
                  <Label>Items del Pedido</Label>
                  <div className="space-y-2">
                    {newOrder.items.map((item, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Input
                            placeholder="Nombre del producto"
                            value={item.name}
                            onChange={(e) => updateItem(index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="w-20">
                          <Input
                            type="number"
                            placeholder="Cant."
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div className="w-24">
                          <Input
                            type="number"
                            placeholder="Precio"
                            value={item.price}
                            onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        {newOrder.items.length > 1 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            Eliminar
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addItem}>
                      Agregar Item
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="paymentMethod">Método de Pago</Label>
                  <Select 
                    value={newOrder.paymentMethod} 
                    onValueChange={(value) => setNewOrder(prev => ({ ...prev, paymentMethod: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="specialInstructions">Instrucciones Especiales</Label>
                  <Textarea
                    id="specialInstructions"
                    value={newOrder.specialInstructions}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, specialInstructions: e.target.value }))}
                    placeholder="Tocar timbre, departamento 4B..."
                  />
                </div>

                <div className="pt-4 border-t">
                  <p className="text-lg font-semibold">
                    Total: ${newOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateOrder} className="flex-1">
                    Crear Pedido
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateOrderOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Activos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredOrders.active.length}</div>
            <p className="text-xs text-muted-foreground">En proceso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados Hoy</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredOrders.completed.length}</div>
            <p className="text-xs text-muted-foreground">Finalizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total del Día</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">
              ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de pedidos con tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Activos ({filteredOrders.active.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completados ({filteredOrders.completed.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Todos ({filteredOrders.all.length})
          </TabsTrigger>
        </TabsList>

        {(['active', 'completed', 'all'] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {tab === 'active' ? 'Pedidos Activos' : 
                   tab === 'completed' ? 'Pedidos Completados' : 'Todos los Pedidos'}
                </CardTitle>
                <CardDescription>
                  {tab === 'active' ? 'Pedidos en proceso de entrega' : 
                   tab === 'completed' ? 'Pedidos finalizados' : 'Historial completo de pedidos'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredOrders[tab].map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    return (
                      <div key={order.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">#{order.id.slice(-4)}</h3>
                            <Badge variant={statusInfo.variant} className={statusInfo.color}>
                              {statusInfo.label}
                            </Badge>
                            {order.eta && (
                              <Badge variant="outline" className="text-blue-600">
                                ETA: {order.eta}
                              </Badge>
                            )}
                            {order.observations.length > 0 && (
                              <Badge variant="outline" className="text-orange-600">
                                {order.observations.length} observación{order.observations.length > 1 ? 'es' : ''}
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleTimeString('es-AR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>Cliente:</strong> {order.customerName}</p>
                            <p className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {order.customerPhone}
                            </p>
                            <p className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {order.deliveryAddress}
                            </p>
                          </div>
                          <div>
                            {order.assignedRiderName && (
                              <p><strong>Repartidor:</strong> {order.assignedRiderName}</p>
                            )}
                            <p><strong>Pago:</strong> {order.paymentMethod}</p>
                            <p><strong>Items:</strong></p>
                            <ul className="list-disc list-inside ml-2 text-xs">
                              {order.items.map((item, idx) => (
                                <li key={idx}>
                                  {item.quantity}x {item.name} (${item.price})
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {order.specialInstructions && (
                          <div className="text-sm bg-blue-50 p-2 rounded">
                            <strong>Instrucciones:</strong> {order.specialInstructions}
                          </div>
                        )}

                        {order.observations.length > 0 && (
                          <div className="text-sm bg-orange-50 p-2 rounded">
                            <strong>Observaciones:</strong>
                            <ul className="mt-1 space-y-1">
                              {order.observations.map((obs) => (
                                <li key={obs.id} className="flex items-center gap-2">
                                  <Star className="h-3 w-3 text-orange-600" />
                                  <span>{getObservationTypeLabel(obs.type)}</span>
                                  {obs.description && <span>- {obs.description}</span>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="pt-3 border-t flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsDetailsModalOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </Button>
                          
                          {order.status === 'pedido_retirado' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setPaymentData({
                                    amountPaid: order.totalAmount,
                                    amountOwed: 0,
                                    notes: ''
                                  });
                                  setIsPaymentModalOpen(true);
                                }}
                              >
                                <DollarSign className="mr-2 h-4 w-4" />
                                Definir Saldo
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsObservationModalOpen(true);
                                }}
                              >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Agregar Observación
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {filteredOrders[tab].length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="mx-auto h-12 w-12 mb-4" />
                      <p>No hay pedidos en esta categoría</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Modal Observación */}
      <Dialog open={isObservationModalOpen} onOpenChange={setIsObservationModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Observación</DialogTitle>
            <DialogDescription>
              Registra una observación sobre el repartidor para el pedido #{selectedOrder?.id.slice(-4)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="observationType">Tipo de Observación</Label>
              <Select 
                value={newObservation.type} 
                onValueChange={(value) => setNewObservation(prev => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mala_presentacion">Mala Presentación</SelectItem>
                  <SelectItem value="mochila_mal_estado">Mochila en Mal Estado</SelectItem>
                  <SelectItem value="sin_casco">Sin Casco</SelectItem>
                  <SelectItem value="mala_educacion">Mala Educación</SelectItem>
                  <SelectItem value="otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="observationDescription">Descripción (Opcional)</Label>
              <Textarea
                id="observationDescription"
                value={newObservation.description}
                onChange={(e) => setNewObservation(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detalles adicionales sobre la observación..."
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddObservation} className="flex-1">
                Agregar Observación
              </Button>
              <Button variant="outline" onClick={() => setIsObservationModalOpen(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Definir Pago */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Definir Saldo del Pedido</DialogTitle>
            <DialogDescription>
              Define los montos de pago para el pedido #{selectedOrder?.id.slice(-4)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedOrder && (
              <div className="p-3 bg-gray-50 rounded">
                <p><strong>Total del pedido:</strong> ${selectedOrder.totalAmount.toFixed(2)}</p>
                <p><strong>Método de pago:</strong> {selectedOrder.paymentMethod}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amountPaid">Monto Pagado por Cliente</Label>
                <Input
                  id="amountPaid"
                  type="number"
                  step="0.01"
                  value={paymentData.amountPaid}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, amountPaid: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="amountOwed">Monto que Debe el Repartidor</Label>
                <Input
                  id="amountOwed"
                  type="number"
                  step="0.01"
                  value={paymentData.amountOwed}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, amountOwed: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="paymentNotes">Notas del Pago</Label>
              <Textarea
                id="paymentNotes"
                value={paymentData.notes}
                onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Detalles sobre el pago..."
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleDefinePayment} className="flex-1">
                Confirmar Saldo
              </Button>
              <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 