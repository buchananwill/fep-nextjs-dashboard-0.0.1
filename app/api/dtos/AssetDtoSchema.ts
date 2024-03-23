import { AssetRoleWorkTaskSuitabilityDtoSchema } from './AssetRoleWorkTaskSuitabilityDtoSchema';
import { z } from 'zod';
export const AssetDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  assetTypeId: z.number(),
  assetTypeName: z.string(),
  assetTypeIsMoveable: z.boolean(),
  ownerId: z.number(),
  distanceFromRoot: z.number(),
  assetRoleWorkTaskSuitabilities: z.array(AssetRoleWorkTaskSuitabilityDtoSchema),
});
export type AssetDto = z.infer<typeof AssetDtoSchema>;