// src/ai/flows/suggest-payment-plan.ts
'use server';

/**
 * @fileOverview An AI agent to suggest payment plans for riders based on their debt history and current location.
 *
 * - suggestPaymentPlan - A function that suggests a payment plan.
 * - SuggestPaymentPlanInput - The input type for the suggestPaymentPlan function.
 * - SuggestPaymentPlanOutput - The return type for the suggestPaymentPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPaymentPlanInputSchema = z.object({
  riderDebtHistory: z
    .string()
    .describe('The rider debt history, including amounts, due dates, and payment records.'),
  riderCurrentLocation: z
    .string()
    .describe('The current location of the rider.'),
});
export type SuggestPaymentPlanInput = z.infer<typeof SuggestPaymentPlanInputSchema>;

const SuggestPaymentPlanOutputSchema = z.object({
  suggestedPaymentPlan: z
    .string()
    .describe('A suggested payment plan for the rider, including payment amounts, due dates, and methods.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested payment plan, including factors considered and trade-offs made.'),
});
export type SuggestPaymentPlanOutput = z.infer<typeof SuggestPaymentPlanOutputSchema>;

export async function suggestPaymentPlan(input: SuggestPaymentPlanInput): Promise<SuggestPaymentPlanOutput> {
  return suggestPaymentPlanFlow(input);
}

const suggestPaymentPlanPrompt = ai.definePrompt({
  name: 'suggestPaymentPlanPrompt',
  input: {schema: SuggestPaymentPlanInputSchema},
  output: {schema: SuggestPaymentPlanOutputSchema},
  prompt: `You are an AI assistant that analyzes rider debt history and current location to suggest a personalized payment plan.

  Given the following rider debt history:
  {{riderDebtHistory}}

  And the rider's current location:
  {{riderCurrentLocation}}

  Suggest a payment plan that helps the rider manage their debts effectively.

  Consider the rider's debt history, current location, and any other relevant factors.

  Provide a detailed payment plan with payment amounts, due dates, and methods.
  Also include the reasoning behind the suggested payment plan, including factors considered and trade-offs made.`,
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
