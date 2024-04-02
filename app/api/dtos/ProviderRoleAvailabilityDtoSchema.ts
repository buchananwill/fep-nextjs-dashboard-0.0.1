import { CycleSubspanDtoSchema } from './CycleSubspanDtoSchema';
import { z } from 'zod';
export const ProviderRoleAvailabilityDtoSchema = z.object({
  id: z.number(),
  providerRoleId: z.number(),
  cycleSubspanDto: CycleSubspanDtoSchema,
  availabilityCode: z.number(),
});
export type ProviderRoleAvailabilityDto = z.infer<typeof ProviderRoleAvailabilityDtoSchema>;