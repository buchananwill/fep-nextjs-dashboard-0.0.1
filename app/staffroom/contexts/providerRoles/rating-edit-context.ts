import { createContext } from 'react';
import { WorkTaskCompetencyDto } from '../../../api/dtos/WorkTaskCompetencyDtoSchema';
import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';
import { AssetRoleWorkTaskSuitabilityDto } from '../../../api/dtos/AssetRoleWorkTaskSuitabilityDtoSchema';
import { AssetDto } from '../../../api/dtos/AssetDtoSchema';
import { NameAccessor } from '../../../curriculum/delivery-models/add-new-curriculum-model-card';
import {
  RatingAccessorProps,
  RatingListAccessor
} from '../../teachers/rating-table';
import { EmptyNumberIdArray } from '../../../premises/classroom-suitability/asset-suitability-table-wrapper';

export interface RatingEditContext<R, E> extends RatingAccessorProps<R> {
  triggerModal: (skill: R, providerRoleDto: E) => void;
  elementLabelAccessor: NameAccessor<E>;
  ratingListAccessor: RatingListAccessor<E, R>;
}

const defaultContext: RatingEditContext<any, any> = {
  triggerModal: () => {},
  ratingValueAccessor: (object) => NaN,
  ratingCategoryLabelAccessor: (object) => '',
  ratingCategoryIdAccessor: (object) => NaN,
  ratingListAccessor: (object) => EmptyNumberIdArray,
  elementLabelAccessor: (object) => ''
};

export const SkillEditContext = createContext<
  RatingEditContext<WorkTaskCompetencyDto, ProviderRoleDto>
>(defaultContext as RatingEditContext<WorkTaskCompetencyDto, ProviderRoleDto>);
export const AssetSuitabilityEditContext =
  createContext<RatingEditContext<AssetRoleWorkTaskSuitabilityDto, AssetDto>>(
    defaultContext
  );
