import { WorkProjectSeriesSchemaDtoSchema } from './WorkProjectSeriesSchemaDtoSchema';
import { z } from 'zod';
export const WorkSeriesBundleDeliveryDtoSchema = z.object({
  id: z.number(),
  partyId: z.number(),
  workSeriesSchemaBundleId: z.number(),
  workProjectSeriesSchemaDtos: z.array(WorkProjectSeriesSchemaDtoSchema),
});
export type WorkSeriesBundleDeliveryDto = z.infer<typeof WorkSeriesBundleDeliveryDtoSchema>;