import { scenes } from '@/content/data/scenes';
import { SYSTEM_STEPS } from '@/components/sections/solution/mnvr-onboard-scene';

/** Scenes in the scene lab (P5B-01). `progress` scenes are scrubbed through --p, `steps` scenes step by step. */
export const LAB_SCENES = [
  { id: 'mnvr-route', title: 'Mobile NVR · Route (fleet level)', kind: 'progress', beats: scenes.find((s) => s.id === 'mnvr-route')!.beats.length },
  { id: 'mnvr-onboard', title: 'Mobile NVR · On board (cutaway)', kind: 'steps', beats: SYSTEM_STEPS.length },
  {
    id: 'elv-one-infrastructure',
    title: 'ELV Systems · One Infrastructure',
    kind: 'progress',
    beats: scenes.find((s) => s.id === 'elv-one-infrastructure')!.beats.length,
  },
  {
    id: 'cctv-see-know-respond',
    title: 'CCTV & Security Systems · See · Know · Respond',
    kind: 'steps',
    beats: scenes.find((s) => s.id === 'cctv-see-know-respond')!.beats.length,
  },
] as const satisfies readonly { id: string; title: string; kind: 'progress' | 'steps'; beats: number }[];
