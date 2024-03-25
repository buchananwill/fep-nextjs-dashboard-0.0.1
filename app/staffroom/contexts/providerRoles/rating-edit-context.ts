import { createContext } from 'react';
import { WorkTaskCompetencyDto } from '../../../api/dtos/WorkTaskCompetencyDtoSchema';
import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';
import { AssetRoleWorkTaskSuitabilityDto } from '../../../api/dtos/AssetRoleWorkTaskSuitabilityDtoSchema';
import { AssetDto } from '../../../api/dtos/AssetDtoSchema';
import { NameAccessor } from '../../../curriculum/delivery-models/add-new-curriculum-model-card';
import {
  AccessorFunction,
  RatingAccessorProps,
  RatingListAccessor
} from '../../teachers/rating-table';
import { EmptyNumberIdArray } from '../../../premises/classroom-suitability/asset-suitability-table-wrapper';
import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import {
  MockReturn,
  UseSelectiveContextDispatch,
  UseSelectiveContextListener
} from '../../../components/selective-context/use-selective-context-listener';
import { ConfirmRatingValue } from '../../../premises/use-confirm-rating-value-function';

export interface RatingEditContext<R, E> extends RatingAccessorProps<R> {
  elementLabelAccessor: NameAccessor<E>;
  elementIdAccessor: AccessorFunction<E, string | number>;
  ratingListAccessor: RatingListAccessor<E, R>;
  useRatingListListenerHook: UseSelectiveContextListener<R[]>;
  confirmRatingValue: ConfirmRatingValue<R, E>;
}

const defaultContext: RatingEditContext<any, any> = {
  confirmRatingValue: () => {},
  ratingValueAccessor: (object) => NaN,
  ratingCategoryLabelAccessor: (object) => '',
  ratingCategoryIdAccessor: (object) => NaN,
  ratingListAccessor: (object) => EmptyNumberIdArray,
  elementLabelAccessor: (object) => '',
  elementIdAccessor: (object) => NaN,
  useRatingListListenerHook: () => MockReturn
};

export const SkillEditContext = createContext<
  RatingEditContext<WorkTaskCompetencyDto, ProviderRoleDto>
>(defaultContext as RatingEditContext<WorkTaskCompetencyDto, ProviderRoleDto>);
export const AssetSuitabilityEditContext =
  createContext<RatingEditContext<AssetRoleWorkTaskSuitabilityDto, AssetDto>>(
    defaultContext
  );
