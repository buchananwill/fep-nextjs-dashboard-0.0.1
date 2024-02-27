import { z } from 'zod';
export const WorkSeriesSchemaBundleLeanDtoSchema = z.object({
  id: z.number(),
  workProjectSeriesSchemaIds: z.array(z.string()),
});
export type WorkSeriesSchemaBundleLeanDto = z.infer<typeof WorkSeriesSchemaBundleLeanDtoSchema>;