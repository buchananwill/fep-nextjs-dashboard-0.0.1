import {
  RatingValueAccessor,
  RatingCategoryIdAccessor,
  RatingCategoryLabelAccessor,
  RatingListAccessor
} from '../../staffroom/teachers/rating-table';
import { AssetDto } from '../../api/dtos/AssetDtoSchema';
import { NameAccessor } from '../../curriculum/delivery-models/add-new-curriculum-model-card';
import { AssetRoleWorkTaskSuitabilityDto } from '../../api/dtos/AssetRoleWorkTaskSuitabilityDtoSchema';

export const assetRoleWorkTaskSuitabilityRatingAccessor: RatingValueAccessor<
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
