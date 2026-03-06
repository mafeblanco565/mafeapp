
'use server';
/**
 * @fileOverview Un flujo de Genkit optimizado para generar listas de compras.
 *
 * - generateGroceryList - Función principal para generar ingredientes usando Gemini.
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
  prompt: `Eres un asistente de cocina experto integrado en MBFOCUS. 
Tu tarea es generar una lista de exactamente 6 ingredientes esenciales para cocinar el plato o tema: "{{{theme}}}".

Instrucciones:
1. Sé preciso con los nombres de los ingredientes.
2. Incluye cantidades realistas para una preparación estándar.
3. Responde exclusivamente en ESPAÑOL.
4. Devuelve los resultados en el formato JSON solicitado.

Tema solicitado: {{{theme}}}`,
});

const aiGroceryListGeneratorFlow = ai.defineFlow(
  {
    name: 'aiGroceryListGeneratorFlow',
    inputSchema: GenerateGroceryListInputSchema,
    outputSchema: GenerateGroceryListOutputSchema,
  },
  async (input) => {
    // Llamada directa a Gemini a través del prompt definido
    const {output} = await groceryListPrompt(input);
    if (!output || !output.items) {
      throw new Error('La IA de Gemini no pudo procesar los ingredientes en este momento.');
    }
    return output;
  }
);

export async function generateGroceryList(input: GenerateGroceryListInput): Promise<GenerateGroceryListOutput> {
  // Aseguramos que la ejecución se realice en el servidor para usar Gemini
  return aiGroceryListGeneratorFlow(input);
}
