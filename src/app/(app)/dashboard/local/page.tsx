import PageTitle from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, PlusCircle, ListOrdered, BarChart3 } from 'lucide-react';

export default function LocalDashboardPage() {
  return (
    <div>
      <PageTitle 
        title="Panel de Local" 
        icon={Building} 
        subtitle="Gestiona tus pedidos y revisa tu rendimiento."
        actions={
          <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Pedido
          </Button>
        }
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendientes</CardTitle>
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Esperando rider</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Hoy</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Total: $450.75</p>
          </CardContent>
        </Card>
         <Card className="bg-highlighted-section">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oferta Especial Activa</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">20% Descuento en Pizzas</div>
            <p className="text-xs text-muted-foreground">Válido hasta fin de mes</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <Card>
            <CardHeader>
                <CardTitle>Pedidos Recientes</CardTitle>
                <CardDescription>Visualiza el estado de tus últimos envíos.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Tabla de pedidos recientes irá aquí.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
