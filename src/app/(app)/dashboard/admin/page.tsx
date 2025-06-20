import PageTitle from '@/components/shared/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div>
      <PageTitle title="Panel de Administrador" icon={ShieldCheck} subtitle="Gestión total del sistema Mar del Motos." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Usuarios Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,234</p>
            <p className="text-sm text-muted-foreground">+10% desde el último mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Completados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">5,678</p>
            <p className="text-sm text-muted-foreground">Hoy: 120</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">$9,876</p>
            <p className="text-sm text-muted-foreground">Mes actual</p>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6 bg-highlighted-section">
        <CardHeader>
            <CardTitle>Anuncios Globales</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-foreground">Aquí puedes configurar anuncios para todos los usuarios.</p>
        </CardContent>
      </Card>
    </div>
  );
}
