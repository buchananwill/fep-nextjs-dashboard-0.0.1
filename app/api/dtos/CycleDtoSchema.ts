import { CycleSubspanDtoSchema } from './CycleSubspanDtoSchema';
import { zDayOfWeek } from '../zod-mods';
import { z } from 'zod';
export const CycleDtoSchema = z.object({
  id: z.number(),
  cycleSubspans: z.array(CycleSubspanDtoSchema),
  cycleLengthInDays: z.number(),
  cycleDayZero: zDayOfWeek,
});
export type CycleDto = z.infer<typeof CycleDtoSchema>;