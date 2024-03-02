import { OrganizationTypeDtoSchema } from './OrganizationTypeDtoSchema';
import { z } from 'zod';
export const OrganizationDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  organizationType: OrganizationTypeDtoSchema,
});
export type OrganizationDto = z.infer<typeof OrganizationDtoSchema>;