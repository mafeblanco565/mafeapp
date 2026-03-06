
'use server';
/**
 * @fileOverview Un flujo de Genkit optimizado para generar listas de compras.
 *
 * - generateGroceryList - Función principal para generar ingredientes.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGroceryListInputSchema = z.object({
  theme: z.string().describe('Un tema o comida para el cual generar una lista de compras.'),
});
export type GenerateGroceryListInput = z.infer<typeof GenerateGroceryListInputSchema>;

const GenerateGroceryListOutputSchema = z.object({
  items: z.array(z.object({
    name: z.string().describe('El nombre del artículo.'),
    quantity: z.string().describe('La cantidad sugerida.'),
  })).describe('Lista de ingredientes sugeridos.'),
});
export type GenerateGroceryListOutput = z.infer<typeof GenerateGroceryListOutputSchema>;

const groceryListPrompt = ai.definePrompt({
  name: 'groceryListPrompt',
  input: {schema: GenerateGroceryListInputSchema},
  output: {schema: GenerateGroceryListOutputSchema},
  prompt: `Eres un asistente de cocina experto. Genera una lista de exactamente 6 ingredientes esenciales para cocinar: "{{{theme}}}".
Incluye cantidades realistas pero simples. 
IMPORTANTE: Responde solo con el objeto JSON solicitado, sin texto adicional, y todo en ESPAÑOL.`,
});

const aiGroceryListGeneratorFlow = ai.defineFlow(
  {
    name: 'aiGroceryListGeneratorFlow',
    inputSchema: GenerateGroceryListInputSchema,
    outputSchema: GenerateGroceryListOutputSchema,
  },
  async (input) => {
    const {output} = await groceryListPrompt(input);
    if (!output || !output.items) {
      throw new Error('La IA no pudo generar los ingredientes. Reintenta por favor.');
    }
    return output;
  }
);

export async function generateGroceryList(input: GenerateGroceryListInput): Promise<GenerateGroceryListOutput> {
  return aiGroceryListGeneratorFlow(input);
}
