'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { suggestPaymentPlan, type SuggestPaymentPlanOutput } from '@/ai/flows/suggest-payment-plan';
import { Bot, Lightbulb, AlertTriangle, Loader2 } from 'lucide-react';

export default function AiPaymentPlanForm() {
  const [riderDebtHistory, setRiderDebtHistory] = useState('');
  const [riderCurrentLocation, setRiderCurrentLocation] = useState('');
  const [suggestion, setSuggestion] = useState<SuggestPaymentPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const result = await suggestPaymentPlan({
        riderDebtHistory,
        riderCurrentLocation,
      });
      setSuggestion(result);
    } catch (err: any) {
      setError(err.message || 'Error al generar la sugerencia de plan de pago.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl font-headline">Asistente de Gestión de Deudas</CardTitle>
        </div>
        <CardDescription>
          Obtén sugerencias sobre cómo gestionar el registro de deudas y seguimiento de pagos pendientes. Esta herramienta es solo informativa y no procesa pagos reales.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="riderDebtHistory">Historial de Deudas del Rider</Label>
            <Textarea
              id="riderDebtHistory"
              value={riderDebtHistory}
              onChange={(e) => setRiderDebtHistory(e.target.value)}
              placeholder="Ej: Tiene registro de deuda de $500 del pedido #123 pendiente desde hace 1 semana, y un registro histórico de cumplimiento puntual en entregas anteriores."
              rows={5}
              required
              className="bg-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="riderCurrentLocation">Zona de Operación del Rider</Label>
            <Input
              id="riderCurrentLocation"
              value={riderCurrentLocation}
              onChange={(e) => setRiderCurrentLocation(e.target.value)}
              placeholder="Ej: Mar del Plata, zona céntrica - Para contextualizar las sugerencias de gestión"
              required
              className="bg-input"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lightbulb className="mr-2 h-4 w-4" />
            )}
            Generar Sugerencia
          </Button>
        </CardFooter>
      </form>

      {suggestion && (
        <div className="p-6 border-t">
          <h3 className="text-xl font-semibold mb-3 text-primary flex items-center gap-2">
            <Lightbulb className="h-5 w-5"/> Plan de Pago Sugerido
          </h3>
          <Card className="bg-highlighted-section border-primary/30">
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="font-medium text-foreground">Plan Sugerido:</p>
                <p className="text-sm text-foreground/80 whitespace-pre-wrap">{suggestion.suggestedPaymentPlan}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Razonamiento:</p>
                <p className="text-sm text-foreground/80 whitespace-pre-wrap">{suggestion.reasoning}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
}
