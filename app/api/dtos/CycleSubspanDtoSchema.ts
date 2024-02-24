import { zTimeOnly } from '../zod-mods';
import { z } from 'zod';
export const CycleSubspanDtoSchema = z.object({
  id: z.number(),
  start: zTimeOnly,
  end: zTimeOnly,
  zeroIndexedCycleDay: z.number(),
});
export type CycleSubspanDto = z.infer<typeof CycleSubspanDtoSchema>;