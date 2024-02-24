import { z } from 'zod';
export const ScheduleCellSchema = z.object({
  principalValue: z.string(),
  leftBottom: z.string(),
  rightBottom: z.string(),
});
export type ScheduleCell = z.infer<typeof ScheduleCellSchema>;