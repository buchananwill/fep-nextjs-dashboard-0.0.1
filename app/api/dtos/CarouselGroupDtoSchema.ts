import { z } from 'zod';
export const CarouselGroupDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});
export type CarouselGroupDto = z.infer<typeof CarouselGroupDtoSchema>;