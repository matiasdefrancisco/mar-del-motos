import AiPaymentPlanForm from '@/components/features/operator/AiPaymentPlanForm';
import PageTitle from '@/components/shared/PageTitle';
import { Bot } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plan de Pago IA - Mar del Motos',
  description: 'Herramienta inteligente para sugerir planes de pago a riders.',
};

export default function AiPaymentPlanPage() {
  return (
    <div>
      <PageTitle
        title="Asistente de Planes de Pago"
        icon={Bot}
        subtitle="Utiliza la inteligencia artificial para generar recomendaciones de planes de pago para los riders."
      />
      <AiPaymentPlanForm />
    </div>
  );
}
