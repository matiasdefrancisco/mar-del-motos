'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PageTitle from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ShieldCheck, 
  Users, 
  Building, 
  Bike, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  BarChart3,
  FileText,
  Settings,
  UserPlus,
  Eye,
  Phone,
  MapPin
} from 'lucide-react';

// Mock data - Reemplazar con Firebase
const MOCK_SYSTEM_STATS = {
  totalUsers: 156,
  activeUsers: 142,
  totalOrders: 2847,
  completedOrders: 2653,
  totalRevenue: 487500,
  monthlyRevenue: 45800,
  averageDeliveryTime: 28, // minutos
  customerSatisfaction: 4.7
};

const MOCK_USERS = [
  {
    id: 'USER001',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    role: 'rider' as const,
    status: 'active' as const,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    totalOrders: 245,
    totalDebt: 750
  },
  {
    id: 'USER002',
    name: 'Pizza Express',
    email: 'pizza@example.com',
    role: 'local' as const,
    status: 'active' as const,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    lastActive: new Date(Date.now() - 30 * 60 * 1000),
    totalOrders: 189,
    totalDebt: 0
  },
  {
    id: 'USER003',
    name: 'Ana Rodríguez',
    email: 'ana@example.com',
    role: 'rider' as const,
    status: 'active' as const,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
    totalOrders: 312,
    totalDebt: 1200
  },
  {
    id: 'USER004',
    name: 'Carlos Martínez',
    email: 'carlos@example.com',
    role: 'operator' as const,
    status: 'active' as const,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    lastActive: new Date(Date.now() - 15 * 60 * 1000),
    totalOrders: 0,
    totalDebt: 0
  },
  {
    id: 'USER005',
    name: 'Administrador Sistema',
    email: 'admin@mardelmotos.com',
    role: 'admin' as const,
    status: 'active' as const,
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    lastActive: new Date(Date.now() - 5 * 60 * 1000),
    totalOrders: 0,
    totalDebt: 0
  }
];

const MOCK_RECENT_ORDERS = [
  {
    id: 'ORD001',
    localName: 'Pizza Express',
    riderName: 'Juan Pérez',
    customerName: 'María García',
    status: 'entregado_cliente' as const,
    totalAmount: 1500,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    deliveryTime: 25
  },
  {
    id: 'ORD002',
    localName: 'Burger House',
    riderName: 'Ana Rodríguez',
    customerName: 'Roberto Silva',
    status: 'repartidor_en_camino' as const,
    totalAmount: 1200,
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
    deliveryTime: null
  },
  {
    id: 'ORD003',
    localName: 'Sushi Place',
    riderName: null,
    customerName: 'Laura Gómez',
    status: 'peticion_enviada' as const,
    totalAmount: 2400,
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    deliveryTime: null
  }
];

const MOCK_AUDIT_LOGS = [
  {
    id: 'LOG001',
    action: 'Usuario creado',
    userId: 'USER005',
    userEmail: 'nuevo@example.com',
    userRole: 'rider' as const,
    details: 'Nuevo repartidor registrado',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 'LOG002',
    action: 'Pedido asignado',
    userId: 'USER001',
    userEmail: 'operador@example.com',
    userRole: 'operator' as const,
    details: 'Pedido ORD004 asignado a Juan Pérez',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
  },
  {
    id: 'LOG003',
    action: 'Deuda saldada',
    userId: 'USER002',
    userEmail: 'pizza@example.com',
    userRole: 'local' as const,
    details: 'Deuda de $750 marcada como pagada',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
  }
];

const getRoleInfo = (role: string) => {
  switch (role) {
    case 'admin':
      return { label: 'Administrador', icon: ShieldCheck, color: 'text-red-400' };
    case 'operator':
      return { label: 'Operador', icon: Users, color: 'text-blue-400' };
    case 'rider':
      return { label: 'Repartidor', icon: Bike, color: 'text-green-400' };
    case 'local':
      return { label: 'Local', icon: Building, color: 'text-purple-400' };
    default:
      return { label: role, icon: Users, color: 'text-gray-400' };
  }
};

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'peticion_enviada':
      return { label: 'Pendiente', variant: 'destructive' as const, color: 'text-red-400' };
    case 'repartidor_en_camino':
      return { label: 'En Camino', variant: 'default' as const, color: 'text-yellow-400' };
    case 'entregado_cliente':
      return { label: 'Entregado', variant: 'default' as const, color: 'text-green-400' };
    default:
      return { label: status, variant: 'secondary' as const, color: 'text-gray-400' };
  }
};

export default function AdminDashboardPage() {
  const { currentUser } = useAuth();
  const [systemStats] = useState(MOCK_SYSTEM_STATS);
  const [users] = useState(MOCK_USERS);
  const [recentOrders] = useState(MOCK_RECENT_ORDERS);
  const [auditLogs] = useState(MOCK_AUDIT_LOGS);

  // Estadísticas por rol
  const usersByRole = {
    admin: users.filter(u => u.role === 'admin').length,
    operator: users.filter(u => u.role === 'operator').length,
    rider: users.filter(u => u.role === 'rider').length,
    local: users.filter(u => u.role === 'local').length
  };

  const activeUsers = users.filter(u => u.status === 'active').length;
  const usersWithDebt = users.filter(u => u.totalDebt > 0).length;
  const totalSystemDebt = users.reduce((sum, user) => sum + user.totalDebt, 0);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6 space-y-6">
      <PageTitle 
        title="Panel de Administración"
        icon={ShieldCheck} 
        subtitle="Supervisión completa del sistema Mar del Motos."
        actions={
          <Button className="bg-[#ffd700] hover:bg-[#ffd700]/90 text-black font-semibold">
            <UserPlus className="mr-2 h-4 w-4" />
            Crear Usuario
          </Button>
        }
      />
      
      {/* Métricas principales del sistema */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#2d2d2d] border-[#333333] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Usuarios Totales</CardTitle>
            <Users className="h-4 w-4 text-[#ffd700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats.totalUsers}</div>
            <p className="text-xs text-gray-400">
              {activeUsers} activos ({Math.round((activeUsers / systemStats.totalUsers) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#2d2d2d] border-[#333333] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Pedidos Completados</CardTitle>
            <Package className="h-4 w-4 text-[#ffd700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats.completedOrders.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              de {systemStats.totalOrders.toLocaleString()} total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#2d2d2d] border-[#333333] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Ingresos del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-[#ffd700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${systemStats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-400">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#2d2d2d] border-[#333333] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-[#ffd700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats.averageDeliveryTime} min</div>
            <p className="text-xs text-gray-400">
              Satisfacción: {systemStats.customerSatisfaction}/5 ⭐
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribución de usuarios por rol */}
      <Card className="bg-[#2d2d2d] border-[#333333] text-white">
        <CardHeader>
          <CardTitle className="text-white">Distribución de Usuarios</CardTitle>
          <CardDescription className="text-gray-400">
            Usuarios registrados por rol en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(usersByRole).map(([role, count]) => {
              const roleInfo = getRoleInfo(role);
              const RoleIcon = roleInfo.icon;
              const percentage = (count / systemStats.totalUsers) * 100;
              
              return (
                <div key={role} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RoleIcon className={`h-4 w-4 ${roleInfo.color}`} />
                      <span className="text-sm font-medium text-white">{roleInfo.label}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{count}</span>
                  </div>
                  <Progress value={percentage} className="h-2 bg-[#333333] [&>div]:bg-[#ffd700]" />
                  <p className="text-xs text-gray-400">
                    {percentage.toFixed(1)}% del total
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Alertas del sistema */}
      {(usersWithDebt > 0 || totalSystemDebt > 0) && (
        <Card className="bg-orange-900/20 border-orange-600/30 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              <div>
                <p className="font-medium text-orange-300">
                  Sistema de Deudas - Atención Requerida
                </p>
                <p className="text-sm text-orange-400">
                  {usersWithDebt} usuario{usersWithDebt > 1 ? 's' : ''} con deudas pendientes. 
                  Total del sistema: ${totalSystemDebt.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contenido principal con tabs */}
      <Tabs defaultValue="usuarios" className="space-y-4">
        <TabsList className="bg-[#2d2d2d] border-[#333333]">
          <TabsTrigger 
            value="usuarios" 
            className="data-[state=active]:bg-[#ffd700] data-[state=active]:text-black text-gray-300"
          >
            Usuarios
          </TabsTrigger>
          <TabsTrigger 
            value="pedidos"
            className="data-[state=active]:bg-[#ffd700] data-[state=active]:text-black text-gray-300"
          >
            Pedidos Recientes
          </TabsTrigger>
          <TabsTrigger 
            value="logs"
            className="data-[state=active]:bg-[#ffd700] data-[state=active]:text-black text-gray-300"
          >
            Logs del Sistema
          </TabsTrigger>
          <TabsTrigger 
            value="reportes"
            className="data-[state=active]:bg-[#ffd700] data-[state=active]:text-black text-gray-300"
          >
            Reportes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="space-y-4">
          <Card className="bg-[#2d2d2d] border-[#333333] text-white">
            <CardHeader>
              <CardTitle className="text-white">Gestión de Usuarios</CardTitle>
              <CardDescription className="text-gray-400">
                Administra todos los usuarios del sistema. Puedes crear, editar y supervisar usuarios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => {
                  const roleInfo = getRoleInfo(user.role);
                  const RoleIcon = roleInfo.icon;
                  
                  return (
                    <div key={user.id} className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <RoleIcon className={`h-5 w-5 ${roleInfo.color}`} />
                          <div>
                            <h3 className="font-semibold text-white">{user.name}</h3>
                            <p className="text-sm text-gray-400">{user.email}</p>
                          </div>
                          <Badge 
                            variant={user.status === 'active' ? 'default' : 'secondary'}
                            className={user.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}
                          >
                            {user.status === 'active' ? 'Activo' : 'Inactivo'}
                          </Badge>
                          <Badge variant="outline" className={`${roleInfo.color} border-current`}>
                            {roleInfo.label}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">
                            {user.totalOrders} pedido{user.totalOrders !== 1 ? 's' : ''}
                          </p>
                          {user.totalDebt > 0 && (
                            <p className="text-sm text-orange-400 font-medium">
                              Deuda: ${user.totalDebt}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-400">
                        <div>
                          <p><strong className="text-white">Registrado:</strong> {user.createdAt.toLocaleDateString('es-AR')}</p>
                        </div>
                        <div>
                          <p><strong className="text-white">Última actividad:</strong> {user.lastActive.toLocaleTimeString('es-AR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-[#333333] text-white hover:bg-[#333333]">
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Perfil
                          </Button>
                          <Button size="sm" variant="outline" className="border-[#333333] text-white hover:bg-[#333333]">
                            <Settings className="mr-2 h-4 w-4" />
                            Editar
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pedidos" className="space-y-4">
          <Card className="bg-[#2d2d2d] border-[#333333] text-white">
            <CardHeader>
              <CardTitle className="text-white">Pedidos Recientes</CardTitle>
              <CardDescription className="text-gray-400">
                Últimos pedidos en el sistema con información detallada.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  
                  return (
                    <div key={order.id} className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-white">#{order.id.slice(-4)}</h3>
                          <Badge variant={statusInfo.variant} className={`${statusInfo.color} border-current`}>
                            {statusInfo.label}
                          </Badge>
                          {order.deliveryTime && (
                            <Badge variant="outline" className="text-green-400 border-green-400">
                              {order.deliveryTime} min
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">${order.totalAmount.toFixed(2)}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(order.createdAt).toLocaleTimeString('es-AR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400"><strong className="text-white">Local:</strong> {order.localName}</p>
                        </div>
                        <div>
                          <p className="text-gray-400"><strong className="text-white">Repartidor:</strong> {order.riderName || 'Sin asignar'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400"><strong className="text-white">Cliente:</strong> {order.customerName}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#333333] flex gap-2">
                        <Button size="sm" variant="outline" className="border-[#333333] text-white hover:bg-[#333333]">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalles
                        </Button>
                        <Button size="sm" variant="outline" className="border-[#333333] text-white hover:bg-[#333333]">
                          <MapPin className="mr-2 h-4 w-4" />
                          Rastrear
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card className="bg-[#2d2d2d] border-[#333333] text-white">
            <CardHeader>
              <CardTitle className="text-white">Logs de Auditoría</CardTitle>
              <CardDescription className="text-gray-400">
                Registro de todas las acciones importantes en el sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => {
                  const roleInfo = getRoleInfo(log.userRole);
                  const RoleIcon = roleInfo.icon;
                  
                  return (
                    <div key={log.id} className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <RoleIcon className={`h-4 w-4 ${roleInfo.color}`} />
                          <span className="font-medium text-white">{log.action}</span>
                          <Badge variant="outline" className={`${roleInfo.color} border-current`}>
                            {roleInfo.label}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-400">
                          {log.timestamp.toLocaleString('es-AR')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-1">
                        <strong className="text-white">Usuario:</strong> {log.userEmail}
                      </p>
                      <p className="text-sm text-gray-300">{log.details}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reportes" className="space-y-4">
          <Card className="bg-[#2d2d2d] border-[#333333] text-white">
            <CardHeader>
              <CardTitle className="text-white">Reportes del Sistema</CardTitle>
              <CardDescription className="text-gray-400">
                Análisis y métricas detalladas del rendimiento del sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Métricas de Rendimiento</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Tasa de Finalización</span>
                        <span className="font-medium text-white">
                          {Math.round((systemStats.completedOrders / systemStats.totalOrders) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={(systemStats.completedOrders / systemStats.totalOrders) * 100} 
                        className="mt-1 bg-[#333333] [&>div]:bg-[#ffd700]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Usuarios Activos</span>
                        <span className="font-medium text-white">
                          {Math.round((activeUsers / systemStats.totalUsers) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={(activeUsers / systemStats.totalUsers) * 100} 
                        className="mt-1 bg-[#333333] [&>div]:bg-[#ffd700]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Satisfacción del Cliente</span>
                        <span className="font-medium text-white">
                          {Math.round((systemStats.customerSatisfaction / 5) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={(systemStats.customerSatisfaction / 5) * 100} 
                        className="mt-1 bg-[#333333] [&>div]:bg-[#ffd700]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-white">Acciones Rápidas</h4>
                  
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start border-[#333333] text-white hover:bg-[#333333]">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Generar Reporte Mensual
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-[#333333] text-white hover:bg-[#333333]">
                      <FileText className="mr-2 h-4 w-4" />
                      Exportar Datos
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-[#333333] text-white hover:bg-[#333333]">
                      <Users className="mr-2 h-4 w-4" />
                      Reporte de Usuarios
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-[#333333] text-white hover:bg-[#333333]">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Análisis Financiero
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
