import PageTitle from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ClipboardList, Bike, Bot } from 'lucide-react';
import Link from 'next/link';

export default function OperatorDashboardPage() {
  return (
    <div>
      <PageTitle 
        title="Panel de Operador" 
        icon={Users} 
        subtitle="Supervisa y gestiona las operaciones diarias."
        actions={
          <Button asChild variant="default">
            <Link href="/dashboard/operator/ai-payment-plan"><Bot className="mr-2 h-4 w-4" />Sugerir Plan de Pago</Link>
          </Button>
        }
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Activos</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Pendientes de asignación: 8</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riders Disponibles</CardTitle>
            <Bike className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 / 20</div>
            <p className="text-xs text-muted-foreground">En servicio / Total</p>
          </CardContent>
        </Card>
        <Card className="bg-highlighted-section">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deudas Pendientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 Riders</div>
            <p className="text-xs text-muted-foreground">Total adeudado: $450.00</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <Card>
            <CardHeader>
                <CardTitle>Herramientas Rápidas</CardTitle>
                <CardDescription>Accede a funciones importantes para operadores.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
                <Button variant="outline">Asignar Rider Manualmente</Button>
                <Button variant="outline">Ver Mapa de Riders</Button>
                <Button variant="outline">Gestionar Deudas</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
