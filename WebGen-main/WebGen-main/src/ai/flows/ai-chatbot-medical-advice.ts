'use server';

/**
 * @fileOverview An AI chatbot for providing medical advice to patients.
 *
 * - aiChatbotMedicalAdvice - A function that handles the chatbot interaction.
 * - AIChatbotMedicalAdviceInput - The input type for the aiChatbotMedicalAdvice function.
 * - AIChatbotMedicalAdviceOutput - The return type for the aiChatbotMedicalAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatbotMedicalAdviceInputSchema = z.object({
  medicalRecords: z
    .string()
    .describe('The patient medical records, including diagnoses, medications, and allergies.'),
  patientQuery: z.string().describe('The patient health concern.'),
});
export type AIChatbotMedicalAdviceInput = z.infer<typeof AIChatbotMedicalAdviceInputSchema>;

const AIChatbotMedicalAdviceOutputSchema = z.object({
  advice: z.string().describe('The medical advice provided by the chatbot.'),
  consultDoctorMessage: z
    .string()
    .describe('A message indicating when the patient should consult a real doctor.'),
});
export type AIChatbotMedicalAdviceOutput = z.infer<typeof AIChatbotMedicalAdviceOutputSchema>;

export async function aiChatbotMedicalAdvice(
  input: AIChatbotMedicalAdviceInput
): Promise<AIChatbotMedicalAdviceOutput> {
  return aiChatbotMedicalAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotMedicalAdvicePrompt',
  input: {schema: AIChatbotMedicalAdviceInputSchema},
  output: {schema: AIChatbotMedicalAdviceOutputSchema},
  prompt: `You are a medical advisor chatbot.

  Based on the patient's medical records and their current query, provide medical advice. Remind the patient that you're not a real doctor, and that if you tell them something that might be wrong they should consult a real doctor.

  Medical Records: {{{medicalRecords}}}
  Patient Query: {{{patientQuery}}}

  Here's an example of how you should respond:

  Advice: Based on your symptoms and medical history, it sounds like you might have a cold. I recommend that you rest and drink plenty of fluids.
  Consult Doctor Message: Please consult a doctor if your symptoms worsen or if you experience any new symptoms.
  `,
});

const aiChatbotMedicalAdviceFlow = ai.defineFlow(
  {
    name: 'aiChatbotMedicalAdviceFlow',
    inputSchema: AIChatbotMedicalAdviceInputSchema,
    outputSchema: AIChatbotMedicalAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
