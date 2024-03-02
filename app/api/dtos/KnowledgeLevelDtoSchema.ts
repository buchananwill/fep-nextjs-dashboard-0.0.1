import { z } from 'zod';
export const KnowledgeLevelDtoSchema = z.object({
  name: z.string(),
  id: z.number(),
  levelOrdinal: z.number(),
  serviceCategoryId: z.number(),
  knowledgeLevelDescriptor: z.string(),
});
export type KnowledgeLevelDto = z.infer<typeof KnowledgeLevelDtoSchema>;