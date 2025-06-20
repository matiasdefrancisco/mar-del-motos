// src/ai/flows/suggest-payment-plan.ts
'use server';

/**
 * @fileOverview Un agente de IA para sugerir planes de pago a los riders basándose en su historial de deudas y ubicación actual.
 *
 * - suggestPaymentPlan - Una función que sugiere un plan de pago.
 * - SuggestPaymentPlanInput - El tipo de entrada para la función suggestPaymentPlan.
 * - SuggestPaymentPlanOutput - El tipo de retorno para la función suggestPaymentPlan.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPaymentPlanInputSchema = z.object({
  riderDebtHistory: z
    .string()
    .describe('El historial de deudas del rider, incluyendo montos, fechas de vencimiento y registros de pago.'),
  riderCurrentLocation: z
    .string()
    .describe('La ubicación actual del rider.'),
});
export type SuggestPaymentPlanInput = z.infer<typeof SuggestPaymentPlanInputSchema>;

const SuggestPaymentPlanOutputSchema = z.object({
  suggestedPaymentPlan: z
    .string()
    .describe('Un plan de pago sugerido para el rider, incluyendo montos de pago, fechas de vencimiento y métodos.'),
  reasoning: z
    .string()
    .describe('El razonamiento detrás del plan de pago sugerido, incluyendo factores considerados y compensaciones realizadas.'),
});
export type SuggestPaymentPlanOutput = z.infer<typeof SuggestPaymentPlanOutputSchema>;

export async function suggestPaymentPlan(input: SuggestPaymentPlanInput): Promise<SuggestPaymentPlanOutput> {
  return suggestPaymentPlanFlow(input);
}

const suggestPaymentPlanPrompt = ai.definePrompt({
  name: 'suggestPaymentPlanPrompt',
  input: {schema: SuggestPaymentPlanInputSchema},
  output: {schema: SuggestPaymentPlanOutputSchema},
  prompt: `Eres un asistente de IA que analiza el historial de deudas de un rider y su ubicación actual para sugerir un plan de pago personalizado.

  Dado el siguiente historial de deudas del rider:
  {{riderDebtHistory}}

  Y la ubicación actual del rider:
  {{riderCurrentLocation}}

  Sugiere un plan de pago que ayude al rider a gestionar sus deudas de forma eficaz.

  Considera el historial de deudas del rider, su ubicación actual y cualquier otro factor relevante.

  Proporciona un plan de pago detallado con los montos de pago, fechas de vencimiento y métodos.
  También incluye el razonamiento detrás del plan de pago sugerido, incluyendo los factores considerados y las compensaciones realizadas.`,
});

const suggestPaymentPlanFlow = ai.defineFlow(
  {
    name: 'suggestPaymentPlanFlow',
    inputSchema: SuggestPaymentPlanInputSchema,
    outputSchema: SuggestPaymentPlanOutputSchema,
  },
  async input => {
    const {output} = await suggestPaymentPlanPrompt(input);
    return output!;
  }
);
