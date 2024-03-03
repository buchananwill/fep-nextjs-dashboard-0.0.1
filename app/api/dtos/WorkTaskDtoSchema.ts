import { EventDtoSchema } from './EventDtoSchema';
import { WorkTaskTypeDtoSchema } from './WorkTaskTypeDtoSchema';
import { z } from 'zod';
export const WorkTaskDtoSchema = z.object({
  id: z.number(),
  events: z.array(EventDtoSchema),
  dueDate: z.date(),
  serviceProductSeriesSchemaId: z.number(),
  serviceProductSeriesSchemaName: z.string(),
  serviceProductTypeDto: WorkTaskTypeDtoSchema,
  taskLength: z.number(),
  targetAssetId: z.number(),
  targetAssetName: z.string(),
  targetAssetTypeName: z.string(),
  completedDate: z.date(),
  customerOrderNumber: z.number(),
  notes: z.string(),
});
export type WorkTaskDto = z.infer<typeof WorkTaskDtoSchema>;