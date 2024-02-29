import { WorkSeriesSchemaBundleLeanDtoSchema } from './WorkSeriesSchemaBundleLeanDtoSchema';
import { z } from 'zod';
export const WorkSeriesBundleDeliveryDtoSchema = z.object({
  id: z.number(),
  partyId: z.number(),
  workSeriesSchemaBundle: WorkSeriesSchemaBundleLeanDtoSchema,
});
export type WorkSeriesBundleDeliveryDto = z.infer<typeof WorkSeriesBundleDeliveryDtoSchema>;