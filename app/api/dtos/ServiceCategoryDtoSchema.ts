import { CollectionSchema } from './CollectionSchema';
import { z } from 'zod';
export const ServiceCategoryDtoSchema = z.object({
  name: z.string(),
  id: z.number(),
  knowledgeDomainDescriptor: z.string(),
  knowledgeLevelDescriptor: z.string(),
  knowledgeDomainIds: CollectionSchema,
  knowledgeLevelIds: CollectionSchema,
});
export type ServiceCategoryDto = z.infer<typeof ServiceCategoryDtoSchema>;