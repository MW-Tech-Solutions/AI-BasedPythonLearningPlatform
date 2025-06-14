// src/ai/flows/answer-python-questions.ts
'use server';

/**
 * @fileOverview An AI agent that answers user questions about Python concepts.
 *
 * - answerPythonQuestion - A function that answers a given Python question.
 * - AnswerPythonQuestionInput - The input type for the answerPythonQuestion function.
 * - AnswerPythonQuestionOutput - The return type for the answerPythonQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerPythonQuestionInputSchema = z.object({
  question: z.string().describe('The question about Python. Be specific.'),
});
export type AnswerPythonQuestionInput = z.infer<typeof AnswerPythonQuestionInputSchema>;

const AnswerPythonQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about Python.'),
});
export type AnswerPythonQuestionOutput = z.infer<typeof AnswerPythonQuestionOutputSchema>;

export async function answerPythonQuestion(input: AnswerPythonQuestionInput): Promise<AnswerPythonQuestionOutput> {
  return answerPythonQuestionFlow(input);
}

const answerPythonQuestionPrompt = ai.definePrompt({
  name: 'answerPythonQuestionPrompt',
  input: {schema: AnswerPythonQuestionInputSchema},
  output: {schema: AnswerPythonQuestionOutputSchema},
  prompt: `You are a helpful AI assistant specialized in answering questions about the Python programming language.

  Question: {{{question}}}

  Answer:`, 
});

const answerPythonQuestionFlow = ai.defineFlow(
  {
    name: 'answerPythonQuestionFlow',
    inputSchema: AnswerPythonQuestionInputSchema,
    outputSchema: AnswerPythonQuestionOutputSchema,
  },
  async input => {
    const {output} = await answerPythonQuestionPrompt(input);
    return output!;
  }
);
