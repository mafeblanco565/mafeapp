'use server';
/**
 * @fileOverview Un flujo de Genkit que genera una lista de compras basada en un tema o comida proporcionado por el usuario.
 *
 * - generateGroceryList - Una función que maneja el proceso de generación de la lista de compras.
 * - GenerateGroceryListInput - El tipo de entrada para la función generateGroceryList.
 * - GenerateGroceryListOutput - El tipo de retorno para la función generateGroceryList.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGroceryListInputSchema = z.object({
  theme: z.string().describe('Un tema o comida para el cual generar una lista de compras.'),
});
export type GenerateGroceryListInput = z.infer<typeof GenerateGroceryListInputSchema>;

const GenerateGroceryListOutputSchema = z.object({
  items: z.array(z.object({
    name: z.string().describe('El nombre del artículo de la compra.'),
    quantity: z.string().describe('La cantidad sugerida para el artículo (ej. "1 docena", "500g", "1 unidad").'),
  })).describe('Una lista de artículos de compra sugeridos con sus cantidades.'),
});
export type GenerateGroceryListOutput = z.infer<typeof GenerateGroceryListOutputSchema>;

const groceryListPrompt = ai.definePrompt({
  name: 'groceryListPrompt',
  input: {schema: GenerateGroceryListInputSchema},
  output: {schema: GenerateGroceryListOutputSchema},
  prompt: `Eres un experto asistente de compras y nutrición. 
Tu tarea es generar una lista de compras completa y lógica basada en el tema o comida proporcionado: "{{{theme}}}".

INSTRUCCIONES:
1. Genera una lista de entre 5 y 10 artículos esenciales.
2. Incluye cantidades realistas para cada artículo.
3. Todo el contenido (nombres y cantidades) DEBE estar en ESPAÑOL.
4. Responde ÚNICAMENTE con el objeto JSON solicitado, sin texto adicional.

Ejemplo:
{
  "items": [
    { "name": "Leche entera", "quantity": "2 litros" },
    { "name": "Huevos", "quantity": "1 docena" }
  ]
}`,
});

const aiGroceryListGeneratorFlow = ai.defineFlow(
  {
    name: 'aiGroceryListGeneratorFlow',
    inputSchema: GenerateGroceryListInputSchema,
    outputSchema: GenerateGroceryListOutputSchema,
  },
  async (input) => {
    const {output} = await groceryListPrompt(input);
    if (!output) throw new Error('No se pudo generar la lista de compras.');
    return output;
  }
);

export async function generateGroceryList(input: GenerateGroceryListInput): Promise<GenerateGroceryListOutput> {
  return aiGroceryListGeneratorFlow(input);
}
