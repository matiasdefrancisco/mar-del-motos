'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Bike, 
  Navigation, 
  Package, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  MapPin, 
  Phone,
  Bell,
  RefreshCcw,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

// Mock data
const MOCK_ORDERS = [
  {
    id: 'ORD001',
    localName: 'Pizza Express',
    localAddress: 'Av. Independencia 1500',
    customerName: 'Juan Pérez',
    deliveryAddress: 'Av. Colón 1234',
    totalAmount: 1500,
    status: 'asignado_rider' as const,
    eta: '20 min',
    distance: '2.5 km'
  },
  {
    id: 'ORD002',
    localName: 'Burger House',
    localAddress: 'San Martín 567',
    customerName: 'María García',
    deliveryAddress: 'San Martín 567',
    totalAmount: 1600,
    status: 'en_camino_retiro' as const,
    eta: '15 min',
    distance: '1.8 km'
  },
  {
    id: 'ORD003',
    localName: 'Empanadas del Norte',
    localAddress: 'Belgrano 890',
    customerName: 'Roberto Silva',
    deliveryAddress: 'Belgrano 890',
    totalAmount: 2400,
    status: 'retirado_local' as const
  }
];

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'asignado_rider':
      return { 
        label: 'Asignado', 
        color: 'bg-blue-900/20 text-blue-400 border-blue-800',
        action: 'Ir a retirar',
        icon: Navigation
      };
    case 'en_camino_retiro':
      return { 
        label: 'En camino', 
        color: 'bg-yellow-900/20 text-yellow-400 border-yellow-800',
        action: 'Confirmar retiro',
        icon: Bike
      };
    case 'retirado_local':
      return { 
        label: 'Retirado', 
        color: 'bg-orange-900/20 text-orange-400 border-orange-800',
        action: 'Confirmar entrega',
        icon: Package
      };
    default:
      return { 
        label: status, 
        color: 'bg-gray-900/20 text-gray-400 border-gray-800',
        action: null,
        icon: Package
      };
  }
};

export default function RiderDashboardPage() {
  const { currentUser, loading, userRole } = useAuth();
  const [orders] = useState(MOCK_ORDERS);
  const [isOnline, setIsOnline] = useState(true);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ffd700] border-r-transparent" />
          <span className="text-gray-400">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!currentUser || userRole !== 'rider') {
    return null;
  }

  const activeOrders = orders.filter(o => ['asignado_rider', 'en_camino_retiro', 'retirado_local'].includes(o.status));
  const todayEarnings = orders.reduce((sum, order) => sum + (order.totalAmount * 0.1), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            ¡Hola, {currentUser.profile?.displayName || 'Repartidor'}!
          </h1>
          <p className="text-gray-400 mt-1">
            Gestiona tus entregas y ganancias del día
          </p>
        </div>
        
        {/* Status Toggle */}
        <div className="flex items-center space-x-3 bg-[#2d2d2d] p-3 rounded-lg border border-[#333333]">
          <span className={`text-sm font-medium ${isOnline ? 'text-green-400' : 'text-gray-400'}`}>
            {isOnline ? 'En línea' : 'Desconectado'}
          </span>
          <Switch 
            checked={isOnline} 
            onCheckedChange={setIsOnline}
            className="data-[state=checked]:bg-[#ffd700]"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#2d2d2d] border-[#333333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Entregas Hoy
            </CardTitle>
            <Package className="h-4 w-4 text-[#ffd700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">4</div>
            <p className="text-xs text-gray-400">
              +2 desde ayer
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#2d2d2d] border-[#333333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Pedidos Activos
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeOrders.length}</div>
            <p className="text-xs text-gray-400">
              En proceso
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#2d2d2d] border-[#333333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Ganancias Hoy
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${todayEarnings.toFixed(0)}</div>
            <p className="text-xs text-gray-400">
              +12% vs ayer
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#2d2d2d] border-[#333333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Deudas Pendientes
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$1950</div>
            <p className="text-xs text-gray-400">
              2 locales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Orders */}
      <Card className="bg-[#2d2d2d] border-[#333333]">
        <CardHeader>
          <div className="flex items-center justify-between">
              <div>
              <CardTitle className="text-white">Pedidos Activos</CardTitle>
              <CardDescription className="text-gray-400">
                Gestiona tus entregas en curso
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-[#333333] text-gray-300 hover:bg-[#333333] hover:text-white"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
              </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No tienes pedidos activos</p>
              <p className="text-sm text-gray-500">Los nuevos pedidos aparecerán aquí</p>
            </div>
          ) : (
            activeOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div 
                  key={order.id}
                  className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-4 hover:border-[#ffd700]/20 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <StatusIcon className="h-5 w-5 text-[#ffd700]" />
                          <span className="font-medium text-white">#{order.id}</span>
                          <Badge className={`${statusInfo.color} border`}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                        <span className="text-lg font-bold text-[#ffd700]">
                          ${order.totalAmount}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-300">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">{order.localName}</span>
                          </div>
                          <p className="text-gray-400 ml-6">{order.localAddress}</p>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Navigation className="h-4 w-4" />
                            <span className="font-medium">{order.customerName}</span>
                          </div>
                          <p className="text-gray-400 ml-6">{order.deliveryAddress}</p>
                        </div>
                      </div>

                      {/* ETA and Distance */}
                      {(order.eta || order.distance) && (
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          {order.eta && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>ETA: {order.eta}</span>
                            </div>
                          )}
                          {order.distance && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{order.distance}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-[#333333] text-gray-300 hover:bg-[#333333]"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Llamar
                      </Button>
                    {statusInfo.action && (
                        <Button 
                          size="sm"
                          className="bg-[#ffd700] text-black hover:bg-[#e6c200]"
                        >
                          {statusInfo.action}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
