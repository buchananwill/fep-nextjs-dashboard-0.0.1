import { WorkSeriesSchemaBundleLeanDtoSchema } from './WorkSeriesSchemaBundleLeanDtoSchema';
import { z } from 'zod';
export const WorkSeriesBundleAssignmentDtoSchema = z.object({
  id: z.number(),
  partyId: z.number(),
  workSeriesSchemaBundle: WorkSeriesSchemaBundleLeanDtoSchema,
});
export type WorkSeriesBundleAssignmentDto = z.infer<typeof WorkSeriesBundleAssignmentDtoSchema>;