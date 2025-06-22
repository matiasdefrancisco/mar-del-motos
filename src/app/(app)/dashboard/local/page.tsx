'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PageTitle from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Building, PlusCircle, ListOrdered, BarChart3, CreditCard, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import OrdersTable from '@/components/features/local/OrdersTable';
import DebtsTable from '@/components/features/local/DebtsTable';

// Mock data - Reemplazar con Firebase
const MOCK_ORDERS = [
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
    eta: '25 min'
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
    eta: '10 min'
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
    createdAt: new Date(Date.now() - 45 * 60 * 1000)
  }
];

const MOCK_DEBTS = [
  {
    id: 'DEBT001',
    riderName: 'Carlos López',
    orderId: 'ORD004',
    amount: 750,
    description: 'Pizza Margherita - Cliente pagó efectivo',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: 'pendiente' as const
  },
  {
    id: 'DEBT002',
    riderName: 'Ana Rodríguez',
    orderId: 'ORD005',
    amount: 1200,
    description: 'Hamburguesas - Cliente pagó efectivo',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    status: 'pendiente' as const
  }
];

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'peticion_enviada':
      return { label: 'Enviado', variant: 'secondary' as const, color: 'bg-blue-900/20 text-blue-400 border-blue-800' };
    case 'repartidor_en_camino':
      return { label: 'En Camino', variant: 'default' as const, color: 'bg-yellow-900/20 text-yellow-400 border-yellow-800' };
    case 'pedido_retirado':
      return { label: 'Retirado', variant: 'default' as const, color: 'bg-orange-900/20 text-orange-400 border-orange-800' };
    case 'saldo_definido':
      return { label: 'Saldo Definido', variant: 'outline' as const, color: 'bg-purple-900/20 text-purple-400 border-purple-800' };
    case 'entregado_repartidor':
      return { label: 'Entregado', variant: 'default' as const, color: 'bg-green-900/20 text-green-400 border-green-800' };
    default:
      return { label: status, variant: 'secondary' as const, color: 'bg-gray-900/20 text-gray-400 border-gray-800' };
  }
};

export default function LocalDashboardPage() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [debts, setDebts] = useState(MOCK_DEBTS);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);

  // Obtener el nombre del negocio de forma segura
  const getBusinessName = () => {
    if (currentUser?.profile && currentUser.profile.role === 'local') {
      const localProfile = currentUser.profile as import('@/lib/types').LocalProfile;
      return localProfile.businessName || 'Local';
    }
    return 'Local';
  };

  // Estadísticas calculadas
  const stats = {
    pendingOrders: orders.filter(o => ['peticion_enviada', 'repartidor_en_camino', 'pedido_retirado'].includes(o.status)).length,
    todayOrders: orders.length,
    todayRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    totalDebt: debts.filter(d => d.status === 'pendiente').reduce((sum, debt) => sum + debt.amount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Panel de {getBusinessName()}
          </h1>
          <p className="text-gray-400 mt-1">
            Gestiona tus pedidos y revisa tu rendimiento.
          </p>
        </div>
        
        <Button 
          className="bg-[#ffd700] text-black hover:bg-[#e6c200] font-medium"
          onClick={() => setIsCreateOrderOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> 
          Nuevo Pedido
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#2d2d2d] border-[#333333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Pedidos Activos
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.pendingOrders}</div>
            <p className="text-xs text-gray-400">
              En proceso
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#2d2d2d] border-[#333333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Pedidos Hoy
            </CardTitle>
            <ListOrdered className="h-4 w-4 text-[#ffd700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.todayOrders}</div>
            <p className="text-xs text-gray-400">
              Total del día
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#2d2d2d] border-[#333333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Ingresos Hoy
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${stats.todayRevenue.toFixed(0)}</div>
            <p className="text-xs text-gray-400">
              Ventas del día
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#2d2d2d] border-[#333333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Deudas Pendientes
            </CardTitle>
            <CreditCard className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${stats.totalDebt.toFixed(0)}</div>
            <p className="text-xs text-gray-400">
              {debts.filter(d => d.status === 'pendiente').length} repartidores
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contenido principal con tabs */}
      <Tabs defaultValue="pedidos" className="space-y-4">
        <TabsList className="bg-[#2d2d2d] border-[#333333]">
          <TabsTrigger 
            value="pedidos"
            className="data-[state=active]:bg-[#ffd700] data-[state=active]:text-black text-gray-300"
          >
            Pedidos
          </TabsTrigger>
          <TabsTrigger 
            value="deudas"
            className="data-[state=active]:bg-[#ffd700] data-[state=active]:text-black text-gray-300"
          >
            Deudas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pedidos" className="space-y-4">
          <Card className="bg-[#2d2d2d] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-white">Gestión de Pedidos</CardTitle>
              <CardDescription className="text-gray-400">
                Administra todos tus pedidos. Puedes crear nuevos pedidos y seguir el estado de los existentes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  return (
                    <div key={order.id} className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-4 space-y-3 hover:border-[#ffd700]/20 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-white">#{order.id.slice(-4)}</h3>
                          <Badge className={`${statusInfo.color} border`}>
                            {statusInfo.label}
                          </Badge>
                          {order.eta && (
                            <Badge className="bg-blue-900/20 text-blue-400 border-blue-800 border">
                              ETA: {order.eta}
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#ffd700]">${order.totalAmount.toFixed(0)}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(order.createdAt).toLocaleTimeString('es-AR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                        <div>
                          <p><strong className="text-white">Cliente:</strong> {order.customerName}</p>
                          <p><strong className="text-white">Teléfono:</strong> {order.customerPhone}</p>
                          <p><strong className="text-white">Dirección:</strong> {order.deliveryAddress}</p>
                        </div>
                        <div>
                          {order.assignedRiderName && (
                            <p><strong className="text-white">Repartidor:</strong> {order.assignedRiderName}</p>
                          )}
                          <p><strong className="text-white">Items:</strong></p>
                          <ul className="list-disc list-inside ml-2">
                            {order.items.map((item, idx) => (
                              <li key={idx}>
                                {item.quantity}x {item.name} (${item.price})
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Acciones según el estado */}
                      {order.status === 'pedido_retirado' && (
                        <div className="pt-3 border-t border-[#333333]">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="bg-[#ffd700] text-black hover:bg-[#e6c200]"
                            >
                              Definir Saldo
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-[#333333] text-gray-300 hover:bg-[#333333] hover:text-white"
                            >
                              Agregar Observación
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deudas" className="space-y-4">
          <Card className="bg-[#2d2d2d] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-white">Deudas Pendientes</CardTitle>
              <CardDescription className="text-gray-400">
                Gestiona las deudas de los repartidores. Marca como saldado cuando recibas el pago.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {debts.map((debt) => (
                  <div key={debt.id} className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-4 hover:border-[#ffd700]/20 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                                              <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-white">{debt.riderName}</h3>
                                                  <Badge className={debt.status === 'pendiente' ? 'bg-red-900/20 text-red-400 border-red-800 border' : 'bg-green-900/20 text-green-400 border-green-800 border'}>
                            {debt.status === 'pendiente' ? 'Pendiente' : 'Pagado'}
                          </Badge>
                      </div>
                                              <div className="text-right">
                          <p className="font-semibold text-lg text-[#ffd700]">${debt.amount.toFixed(0)}</p>
                          <p className="text-sm text-gray-400">
                          Vence: {debt.dueDate.toLocaleDateString('es-AR')}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-300 mb-3">
                      <p><strong className="text-white">Pedido:</strong> #{debt.orderId}</p>
                      <p><strong className="text-white">Descripción:</strong> {debt.description}</p>
                    </div>

                    {debt.status === 'pendiente' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Marcar como Saldado
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-[#333333] text-gray-300 hover:bg-[#333333] hover:text-white"
                        >
                          Contactar Repartidor
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {debts.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <CreditCard className="mx-auto h-12 w-12 mb-4 text-gray-500" />
                    <p>No hay deudas pendientes</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
