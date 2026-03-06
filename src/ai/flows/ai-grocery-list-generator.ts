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
  prompt: `Eres un asistente útil que genera listas de compras.
Basándote en el siguiente tema o comida, genera una lista de compras completa con cantidades sugeridas.
La salida debe ser un objeto JSON que contenga un array de artículos, donde cada artículo tiene un campo 'name' y un campo 'quantity'.
IMPORTANTE: Todos los nombres de los artículos y las cantidades deben estar en ESPAÑOL.

Tema/Comida: {{{theme}}}

Ejemplo de Salida:
{
  "items": [
    { "name": "Salchichas", "quantity": "1 paquete" },
    { "name": "Pan de hot dog", "quantity": "1 paquete" },
    { "name": "Ketchup", "quantity": "1 botella" },
    { "name": "Mostaza", "quantity": "1 botella" }
  ]
}
`,
});

const aiGroceryListGeneratorFlow = ai.defineFlow(
  {
    name: 'aiGroceryListGeneratorFlow',
    inputSchema: GenerateGroceryListInputSchema,
    outputSchema: GenerateGroceryListOutputSchema,
  },
  async (input) => {
    const {output} = await groceryListPrompt(input);
    return output!;
  }
);

export async function generateGroceryList(input: GenerateGroceryListInput): Promise<GenerateGroceryListOutput> {
  return aiGroceryListGeneratorFlow(input);
}
