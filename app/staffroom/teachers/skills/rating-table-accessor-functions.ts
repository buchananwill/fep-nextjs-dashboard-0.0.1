import {
  RatingAccessor,
  RatingCategoryIdAccessor,
  RatingCategoryLabelAccessor,
  RatingListAccessor
} from '../rating-table';
import { WorkTaskCompetencyDto } from '../../../api/dtos/WorkTaskCompetencyDtoSchema';
import { NameAccessor } from '../../../curriculum/delivery-models/add-new-curriculum-model-card';
import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';

export const workTaskCompetencyRatingAccessor: RatingAccessor<
  WorkTaskCompetencyDto
> = (wtcDto) => wtcDto.competencyRating;
export const workTaskCompetencyLabelAccessor: RatingCategoryLabelAccessor<
  WorkTaskCompetencyDto
> = (wtcDto) => wtcDto.workTaskType;
export const workTaskCompetencyIdAccessor: RatingCategoryIdAccessor<
  WorkTaskCompetencyDto
> = (wtcDto) => wtcDto.workTaskTypeId;
export const providerRoleNameAccessor: NameAccessor<ProviderRoleDto> = (
  providerRole
) => providerRole.partyName;
export const workTaskCompetencyDtoListAccessor: RatingListAccessor<
  ProviderRoleDto,
  WorkTaskCompetencyDto
> = (pRole) => pRole.workTaskCompetencyDtoList;
