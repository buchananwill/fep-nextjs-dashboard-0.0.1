import { ServiceCompetencyDtoSchema } from './ServiceCompetencyDtoSchema';
import { z } from 'zod';
export const ProviderRoleDtoSchema = z.object({
  name: z.string(),
  id: z.number(),
  partyName: z.string(),
  partyId: z.number(),
  knowledgeDomainId: z.number(),
  knowledgeDomainName: z.string(),
  serviceCompetencyDtoList: z.array(ServiceCompetencyDtoSchema),
});
export type ProviderRoleDto = z.infer<typeof ProviderRoleDtoSchema>;