import PageTitle from '@/components/shared/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestTube } from 'lucide-react';

export default function TestDashboardPage() {
  return (
    <div>
      <PageTitle title="Dashboard de Prueba" icon={TestTube} subtitle="Esta es una página de prueba accesible por todos los roles." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Métrica de Prueba 1</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">123</p>
            <p className="text-sm text-muted-foreground">Datos de ejemplo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Métrica de Prueba 2</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">456</p>
            <p className="text-sm text-muted-foreground">Más datos de prueba</p>
          </CardContent>
        </Card>
        <Card className="bg-highlighted-section">
          <CardHeader>
            <CardTitle>Anuncio de Prueba</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">Este es un anuncio en la sección de prueba.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
