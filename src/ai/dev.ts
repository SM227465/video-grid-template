import { config } from 'dotenv';
config();

import '@/ai/flows/video-recommendations.ts';
// UI components are typically not part of AI flow dev server, but keeping pattern if intended
// import '@/components/ui/aspect-ratio'; 
