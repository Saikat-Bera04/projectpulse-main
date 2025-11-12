'use server';

/**
 * @fileOverview This file defines the Genkit flow for AI-powered teammate matching.
 *
 * It takes a student's skills, interests, and project requirements as input
 * and suggests potential teammates based on compatibility.
 *
 * @module ai/ai-teammate-matching
 *
 * @interface AITeamMateMatchingInput
 * @interface AITeamMateMatchingOutput
 * @function aiTeamMateMatching
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AITeamMateMatchingInputSchema = z.object({
  skills: z
    .array(z.string())
    .describe('List of skills the student possesses.'),
  interests: z
    .array(z.string())
    .describe('List of interests of the student.'),
  projectRequirements: z
    .string()
    .describe('Description of the project and required skills.'),
  numberOfSuggestions: z
    .number()
    .default(3)
    .describe('Number of teammate suggestions to generate.'),
});

export type AITeamMateMatchingInput = z.infer<typeof AITeamMateMatchingInputSchema>;

const AITeamMateMatchingOutputSchema = z.array(
  z.object({
    name: z.string().describe('Name of the suggested teammate.'),
    role: z.string().describe('Role of the suggested teammate.'),
    matchScore: z.number().describe('A score indicating how well the teammate matches.'),
    skills: z.array(z.string()).describe('Skills the teammate possesses'),
  })
);

export type AITeamMateMatchingOutput = z.infer<typeof AITeamMateMatchingOutputSchema>;

export async function aiTeamMateMatching(
  input: AITeamMateMatchingInput
): Promise<AITeamMateMatchingOutput> {
  return aiTeamMateMatchingFlow(input);
}

const aiTeamMateMatchingPrompt = ai.definePrompt({
  name: 'aiTeamMateMatchingPrompt',
  input: {
    schema: AITeamMateMatchingInputSchema,
  },
  output: {
    schema: AITeamMateMatchingOutputSchema,
  },
  prompt: `You are an AI assistant designed to suggest teammates for students based on their skills, interests and project requirements.

Given the following information about a student:

Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Project Requirements: {{{projectRequirements}}}

Suggest {{numberOfSuggestions}} potential teammates. For each teammate, include their name, role, a match score (out of 100), and their skills.
Make sure to generate teammates with complementary skills and experience, who can improve overall team capabilities.
Ensure each teammate's skills align with the project requirements.

Format your response as a JSON array.`,
});

const aiTeamMateMatchingFlow = ai.defineFlow(
  {
    name: 'aiTeamMateMatchingFlow',
    inputSchema: AITeamMateMatchingInputSchema,
    outputSchema: AITeamMateMatchingOutputSchema,
  },
  async input => {
    const {output} = await aiTeamMateMatchingPrompt(input);
    return output!;
  }
);
