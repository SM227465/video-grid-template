'use server';
/**
 * @fileOverview Recommends videos to users based on their watch history.
 *
 * - recommendVideos - A function that recommends videos based on a user's watch history.
 * - RecommendVideosInput - The input type for the recommendVideos function.
 * - RecommendVideosOutput - The return type for the recommendVideos function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendVideosInputSchema = z.object({
  userWatchHistory: z
    .array(z.string())
    .describe('An array of video IDs representing the user watch history.'),
  allVideoIds: z.array(z.string()).describe('All available video IDs.'),
});
export type RecommendVideosInput = z.infer<typeof RecommendVideosInputSchema>;

const RecommendVideosOutputSchema = z.object({
  recommendedVideoIds: z
    .array(z.string())
    .describe('An array of video IDs that are recommended for the user.'),
});
export type RecommendVideosOutput = z.infer<typeof RecommendVideosOutputSchema>;

export async function recommendVideos(input: RecommendVideosInput): Promise<RecommendVideosOutput> {
  return recommendVideosFlow(input);
}

const isVideoRelevantTool = ai.defineTool(
  {
    name: 'isVideoRelevant',
    description: 'Determine if a video is relevant to the user watch history.',
    inputSchema: z.object({
      videoId: z.string().describe('The ID of the video to check.'),
      userWatchHistory: z
        .array(z.string())
        .describe('An array of video IDs representing the user watch history.'),
      allVideoIds: z.array(z.string()).describe('All available video IDs for context when history is short or empty.'),
    }),
    outputSchema: z.boolean(),
  },
  async function(input) { // Changed to regular function syntax
    // TODO: Implement this by calling an AI model or using some other logic.
    // For now, just return true for the first video in the list.
    // This mock logic can be improved to provide more diverse recommendations.
    // For example, recommend a few videos that are in the watch history
    // or a few random ones if history is short.
    if (input.userWatchHistory.length > 0) {
      // Simple mock: recommend if videoId is in userWatchHistory (up to 2 videos)
      // Or, if history is very short, recommend up to 2 videos from allVideoIds somewhat randomly.
      if (input.userWatchHistory.includes(input.videoId) && input.userWatchHistory.indexOf(input.videoId) < 2) {
        return true;
      }
      if (input.userWatchHistory.length < 2 && Math.random() < 0.3 ) { // 30% chance to recommend if history is short
         return input.allVideoIds.slice(0,5).includes(input.videoId); // recommend from first 5 available videos
      }
      return false;
    }
    // If no watch history, recommend a small subset of all videos randomly
    return Math.random() < 0.2 && input.allVideoIds.slice(0,5).includes(input.videoId);
  }
);

const recommendVideosPrompt = ai.definePrompt({
  name: 'recommendVideosPrompt',
  input: {schema: RecommendVideosInputSchema},
  output: {schema: RecommendVideosOutputSchema},
  tools: [isVideoRelevantTool],
  prompt: `Based on the user's watch history, recommend videos from the available video IDs.

User watch history: {{#if userWatchHistory.length}}
{{#each userWatchHistory}}
- {{this}}
{{/each}}
{{else}}
No watch history provided.
{{/if}}

Available video IDs:
{{#each allVideoIds}}
- {{this}}
{{/each}}

Consider each video from the "Available video IDs" list and use the isVideoRelevant tool to determine if it is relevant to the user's interests or if it should be recommended when history is empty. Pass allVideoIds to the tool for context. Only include videos that are deemed relevant in the recommendedVideoIds output array.

You must use the isVideoRelevant tool to check each video individually.
`,
});

const recommendVideosFlow = ai.defineFlow(
  {
    name: 'recommendVideosFlow',
    inputSchema: RecommendVideosInputSchema,
    outputSchema: RecommendVideosOutputSchema,
  },
  async input => {
    const {output} = await recommendVideosPrompt(input);
    // Ensure output is not null and has the recommendedVideoIds property
    if (output && output.recommendedVideoIds) {
      return output;
    }
    // Fallback if AI fails to return the expected structure or no videos are relevant
    return { recommendedVideoIds: [] };
  }
);
