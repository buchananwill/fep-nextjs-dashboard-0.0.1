import { DeliveryAllocationDtoSchema } from './DeliveryAllocationDtoSchema';
import { WorkTaskTypeDtoSchema } from './WorkTaskTypeDtoSchema';
import { z } from 'zod';
export const WorkProjectSeriesSchemaDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  workTaskType: WorkTaskTypeDtoSchema,
  deliveryAllocations: z.array(DeliveryAllocationDtoSchema),
  workProjectBandwidth: z.number(),
  allocationType: z.string(),
  userToProviderRatio: z.number(),
});
export type WorkProjectSeriesSchemaDto = z.infer<typeof WorkProjectSeriesSchemaDtoSchema>;