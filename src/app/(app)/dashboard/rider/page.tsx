import PageTitle from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bike, DollarSign, ClipboardCheck, History } from 'lucide-react';

export default function RiderDashboardPage() {
  return (
    <div>
      <PageTitle title="Panel de Rider" icon={Bike} subtitle="Tus pedidos, ganancias y estado actual." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedido Actual</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">Entrega en Av. Colón 1234</div>
            <p className="text-xs text-muted-foreground">Estado: En Tránsito</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancias del Día</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">$75.50</div>
            <p className="text-xs text-muted-foreground">3 pedidos completados</p>
          </CardContent>
        </Card>
        <Card className="bg-highlighted-section">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deuda Actual</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$25.00</div>
            <p className="text-xs text-muted-foreground">Vence en 3 días</p>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Historial de Pedidos Recientes</CardTitle>
          <CardDescription>Últimos 5 pedidos realizados.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {[1,2,3,4,5].map(i => (
              <li key={i} className="flex justify-between items-center p-2 border-b last:border-b-0">
                <span>Pedido #100{i} - Local X</span>
                <span className="text-sm text-green-600">Entregado</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
