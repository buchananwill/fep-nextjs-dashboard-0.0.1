import {
  RatingAccessor,
  RatingCategoryLabelAccessor,
  RatingListAccessor
} from '../../staffroom/teachers/rating-table';
import { AssetDto } from '../../api/dtos/AssetDtoSchema';
import { NameAccessor } from '../../curriculum/delivery-models/add-new-curriculum-model-card';
import { AssetRoleWorkTaskSuitabilityDto } from '../../api/dtos/AssetRoleWorkTaskSuitabilityDtoSchema';
import { useMemo } from 'react';

export const assetRoleWorkTaskSuitabilityRatingAccessor: RatingAccessor<
  AssetRoleWorkTaskSuitabilityDto
> = (wtcDto) => wtcDto.suitabilityRating;
export const assetRoleWorkTaskSuitabilityLabelAccessor: RatingCategoryLabelAccessor<
  AssetRoleWorkTaskSuitabilityDto
> = (wtcDto) => wtcDto.workTaskTypeName;
export const assetNameAccessor: NameAccessor<AssetDto> = (assetDto) =>
  assetDto.name;

export const assetRoleWorkTaskSuitabilityDtoListAccessor: RatingListAccessor<
  AssetDto,
  AssetRoleWorkTaskSuitabilityDto
> = (asset) => asset.assetRoleWorkTaskSuitabilities;
