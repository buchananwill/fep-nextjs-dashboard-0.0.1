import { z } from 'zod';
export const ProviderRoleTypeWorkTaskTypeSuitabilityDtoSchema = z.object({
  id: z.number(),
  rating: z.number(),
  partyId: z.number(),
  workTaskType: z.string(),
  workTaskTypeId: z.number(),
});
export type ProviderRoleTypeWorkTaskTypeSuitabilityDto = z.infer<typeof ProviderRoleTypeWorkTaskTypeSuitabilityDtoSchema>;