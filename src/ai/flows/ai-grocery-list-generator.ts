'use server';
/**
 * @fileOverview A Genkit flow that generates a grocery list based on a user-provided theme or meal.
 *
 * - generateGroceryList - A function that handles the grocery list generation process.
 * - GenerateGroceryListInput - The input type for the generateGroceryList function.
 * - GenerateGroceryListOutput - The return type for the generateGroceryList function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGroceryListInputSchema = z.object({
  theme: z.string().describe('A theme or meal for which to generate a grocery list.'),
});
export type GenerateGroceryListInput = z.infer<typeof GenerateGroceryListInputSchema>;

const GenerateGroceryListOutputSchema = z.object({
  items: z.array(z.object({
    name: z.string().describe('The name of the grocery item.'),
    quantity: z.string().describe('The suggested quantity for the grocery item (e.g., "1 dozen", "500g", "1 head").'),
  })).describe('A list of suggested grocery items with their quantities.'),
});
export type GenerateGroceryListOutput = z.infer<typeof GenerateGroceryListOutputSchema>;

const groceryListPrompt = ai.definePrompt({
  name: 'groceryListPrompt',
  input: {schema: GenerateGroceryListInputSchema},
  output: {schema: GenerateGroceryListOutputSchema},
  prompt: `You are a helpful assistant that generates grocery lists.
Based on the following theme or meal, generate a comprehensive grocery list with suggested quantities.
The output should be a JSON object containing an array of items, where each item has a 'name' and 'quantity' field.

Theme/Meal: {{{theme}}}

Example Output:
{
  "items": [
    { "name": "Hot dogs", "quantity": "1 pack" },
    { "name": "Hot dog buns", "quantity": "1 pack" },
    { "name": "Ketchup", "quantity": "1 bottle" },
    { "name": "Mustard", "quantity": "1 bottle" }
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
