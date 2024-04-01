import {
  RatingValueAccessor,
  RatingCategoryIdAccessor,
  RatingCategoryLabelAccessor,
  RatingListAccessor
} from '../../../generic/components/tables/rating/rating-table';
import { WorkTaskCompetencyDto } from '../../../api/dtos/WorkTaskCompetencyDtoSchema';
import { NameAccessor } from '../../../curriculum/delivery-models/add-new-curriculum-model-card';
import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';
import { ProviderRoleTypeWorkTaskTypeSuitabilityDto } from '../../../api/dtos/ProviderRoleTypeWorkTaskTypeSuitabilityDtoSchema';

export const workTaskCompetencyRatingAccessor: RatingValueAccessor<
  ProviderRoleTypeWorkTaskTypeSuitabilityDto
> = (wtcDto) => wtcDto.rating;
export const workTaskCompetencyLabelAccessor: RatingCategoryLabelAccessor<
  ProviderRoleTypeWorkTaskTypeSuitabilityDto
> = (wtcDto) => wtcDto.workTaskType;
export const workTaskCompetencyIdAccessor: RatingCategoryIdAccessor<
  ProviderRoleTypeWorkTaskTypeSuitabilityDto
> = (wtcDto) => wtcDto.workTaskTypeId;
export const providerRoleNameAccessor: NameAccessor<ProviderRoleDto> = (
  providerRole
) => providerRole.partyName;

const providerRoleIdAccessor = (pr: ProviderRoleDto) => pr.id;

export const SkillEditAccessorFunctions = {
  elementLabelAccessor: providerRoleNameAccessor,
  ratingCategoryLabelAccessor: workTaskCompetencyLabelAccessor,
  ratingValueAccessor: workTaskCompetencyRatingAccessor,
  ratingCategoryIdAccessor: workTaskCompetencyIdAccessor,
  elementIdAccessor: providerRoleIdAccessor
};
