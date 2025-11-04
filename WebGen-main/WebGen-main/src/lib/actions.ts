'use server';

import {
  aiChatbotMedicalAdvice,
  type AIChatbotMedicalAdviceOutput,
} from '@/ai/flows/ai-chatbot-medical-advice';
import { medicalRecords } from '@/lib/data';

export async function getMedicalAdvice(
  patientId: string,
  patientQuery: string
): Promise<AIChatbotMedicalAdviceOutput> {
  const records = medicalRecords.find((r) => r.patientId === patientId);

  if (!records) {
    return {
      advice: 'Could not find your medical records. Please update your profile.',
      consultDoctorMessage: 'Please ensure your profile is up-to-date before using the chat.',
    };
  }

  const medicalRecordsString = `
    Diagnoses: ${records.diagnoses.join(', ') || 'None'}
    Medications: ${records.medications.join(', ') || 'None'}
    Allergies: ${records.allergies.join(', ') || 'None'}
  `;

  try {
    const response = await aiChatbotMedicalAdvice({
      medicalRecords: medicalRecordsString,
      patientQuery,
    });
    return response;
  } catch (error) {
    console.error('Error getting medical advice:', error);
    return {
      advice: 'Sorry, I encountered an error and cannot provide advice right now.',
      consultDoctorMessage:
        'Please try again later or consult a doctor directly if your concern is urgent.',
    };
  }
}
