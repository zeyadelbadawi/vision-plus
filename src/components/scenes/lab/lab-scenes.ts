import { scenes } from '@/content/data/scenes';
import { SYSTEM_STEPS } from '@/components/sections/solution/mnvr-onboard-scene';

/** Scenes in the scene lab (P5B-01). `progress` scenes are scrubbed through --p, `steps` scenes step by step. */
export const LAB_SCENES = [
  { id: 'mnvr-route', title: 'Mobile NVR · Route (fleet level)', kind: 'progress', beats: scenes.find((s) => s.id === 'mnvr-route')!.beats.length },
  { id: 'mnvr-onboard', title: 'Mobile NVR · On board (cutaway)', kind: 'steps', beats: SYSTEM_STEPS.length },
] as const satisfies readonly { id: string; title: string; kind: 'progress' | 'steps'; beats: number }[];
