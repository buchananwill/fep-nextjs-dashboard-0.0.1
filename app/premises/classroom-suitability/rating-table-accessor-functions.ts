import {
  RatingValueAccessor,
  RatingCategoryIdAccessor,
  RatingCategoryLabelAccessor,
  RatingListAccessor
} from '../../staffroom/teachers/rating-table';
import { AssetDto } from '../../api/dtos/AssetDtoSchema';
import { NameAccessor } from '../../curriculum/delivery-models/add-new-curriculum-model-card';
import { AssetRoleWorkTaskSuitabilityDto } from '../../api/dtos/AssetRoleWorkTaskSuitabilityDtoSchema';
import {
  providerRoleNameAccessor,
  workTaskCompetencyDtoListAccessor,
  workTaskCompetencyIdAccessor,
  workTaskCompetencyLabelAccessor,
  workTaskCompetencyRatingAccessor
} from '../../staffroom/teachers/skills/rating-table-accessor-functions';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';
import { HasUuidDto } from '../../api/dtos/HasUuidDtoSchema';

export const assetRoleWorkTaskSuitabilityRatingValueAccessor: RatingValueAccessor<
  AssetRoleWorkTaskSuitabilityDto
> = (wtcDto) => wtcDto.suitabilityRating;
export const assetRoleWorkTaskSuitabilityLabelAccessor: RatingCategoryLabelAccessor<
  AssetRoleWorkTaskSuitabilityDto
> = (wtcDto) => wtcDto.workTaskTypeName;
export const assetRoleWorkTaskSuitabilityIdAccessor: RatingCategoryIdAccessor<
  AssetRoleWorkTaskSuitabilityDto
> = (wtcDto) => wtcDto.workTaskTypeId;
export const assetNameAccessor: NameAccessor<AssetDto> = (assetDto) =>
  assetDto.name;

export const assetRoleWorkTaskSuitabilityDtoListAccessor: RatingListAccessor<
  AssetDto,
  AssetRoleWorkTaskSuitabilityDto
> = (asset) => asset.assetRoleWorkTaskSuitabilities;

export function IdAccessor<T extends HasNumberIdDto | HasUuidDto>(element: T) {
  return element.id;
}

export const AssetSuitabilityAccessorFunctions = {
  elementLabelAccessor: assetNameAccessor,
  ratingListAccessor: assetRoleWorkTaskSuitabilityDtoListAccessor,
  ratingCategoryLabelAccessor: assetRoleWorkTaskSuitabilityLabelAccessor,
  ratingValueAccessor: assetRoleWorkTaskSuitabilityRatingValueAccessor,
  ratingCategoryIdAccessor: assetRoleWorkTaskSuitabilityIdAccessor,
  elementIdAccessor: IdAccessor<AssetDto>
};
