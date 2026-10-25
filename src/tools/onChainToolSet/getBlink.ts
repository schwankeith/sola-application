import { ToolContext, ToolResult } from '@/types/tool';
import { z } from 'zod';

export const createGetBlinkTool = (_context: ToolContext) => {
  return {
    description: 'Fetch and render a Solana Blink action for a given URL.',
    parameters: z.object({
      url: z.string().describe('The URL or action link of the Blink'),
    }),
    execute: async ({ url }: { url: string }): Promise<ToolResult> => {
      try {
        return {
          success: true,
          data: {
            url,
          },
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || 'Failed to load blink',
        };
      },
    },
  };
};
