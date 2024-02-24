import { z } from 'zod';
export const WorkTaskTypeDtoSchema = z.object({
  name: z.string(),
  id: z.number(),
  serviceCategoryName: z.string(),
  serviceCategoryId: z.number(),
  serviceCategoryKnowledgeDomainDescriptor: z.string(),
  knowledgeDomainName: z.string(),
  knowledgeDomainId: z.number(),
  serviceCategoryKnowledgeLevelDescriptor: z.string(),
  knowledgeLevelName: z.string(),
  knowledgeLevelLevelOrdinal: z.number(),
  knowledgeLevelId: z.number(),
  deliveryValidationTypeName: z.string(),
  deliveryValidationTypeId: z.number(),
});
export type WorkTaskTypeDto = z.infer<typeof WorkTaskTypeDtoSchema>;