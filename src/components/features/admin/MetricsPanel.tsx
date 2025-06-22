'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Clock, 
  TrendingUp, 
  Users, 
  CreditCard,
  Bike,
  Building,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function MetricCard({ title, value, description, icon: Icon, trend }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
          {trend && (
            <span className={trend.isPositive ? 'text-green-500' : 'text-red-500'}>
              {' '}
              ({trend.isPositive ? '+' : '-'}{trend.value}%)
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}

export default function MetricsPanel() {
  // TODO: Implementar lógica de Firebase para obtener métricas en tiempo real
  const metrics = [
    {
      title: 'Pedidos Hoy',
      value: 145,
      description: 'Total del día',
      icon: Clock,
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Tiempo Promedio',
      value: '28 min',
      description: 'Tiempo de entrega',
      icon: TrendingUp,
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Riders Activos',
      value: 18,
      description: 'En servicio',
      icon: Bike
    },
    {
      title: 'Locales Activos',
      value: 32,
      description: 'Operando hoy',
      icon: Building
    },
    {
      title: 'Deudas Totales',
      value: '$4,250',
      description: 'Pendientes de cobro',
      icon: CreditCard,
      trend: { value: 5, isPositive: false }
    },
    {
      title: 'Usuarios Totales',
      value: 1250,
      description: 'Registrados',
      icon: Users
    },
    {
      title: 'Entregas Exitosas',
      value: '98%',
      description: 'Última semana',
      icon: CheckCircle,
      trend: { value: 2, isPositive: true }
    },
    {
      title: 'Incidencias',
      value: 3,
      description: 'Pendientes de resolver',
      icon: AlertTriangle
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
} 