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

const isVideoRelevantTool = ai.defineTool({
  name: 'isVideoRelevant',
  description: 'Determine if a video is relevant to the user watch history.',
  inputSchema: z.object({
    videoId: z.string().describe('The ID of the video to check.'),
    userWatchHistory: z
      .array(z.string())
      .describe('An array of video IDs representing the user watch history.'),
  }),
  outputSchema: z.boolean(),
  async (input) => {
    // TODO: Implement this by calling an AI model or using some other logic.
    // For now, just return true for the first video in the list.
    return input.userWatchHistory.length > 0 && input.videoId === input.userWatchHistory[0];
  },
});

const recommendVideosPrompt = ai.definePrompt({
  name: 'recommendVideosPrompt',
  input: {schema: RecommendVideosInputSchema},
  output: {schema: RecommendVideosOutputSchema},
  tools: [isVideoRelevantTool],
  prompt: `Based on the user's watch history, recommend videos from the available video IDs.\n\nUser watch history: {{{userWatchHistory}}}\n\nAvailable video IDs: {{{allVideoIds}}}\n\nConsider each video and use the isVideoRelevant tool to determine if it is relevant to the user's interests. Only include videos that are deemed relevant in the recommendedVideoIds output array.\n\nYou must use the isVideoRelevant tool to check each video.
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
    return output!;
  }
);
