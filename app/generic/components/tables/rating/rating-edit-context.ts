import { createContext } from 'react';
import { WorkTaskCompetencyDto } from '../../../../api/dtos/WorkTaskCompetencyDtoSchema';
import { ProviderRoleDto } from '../../../../api/dtos/ProviderRoleDtoSchema';
import { AssetRoleWorkTaskSuitabilityDto } from '../../../../api/dtos/AssetRoleWorkTaskSuitabilityDtoSchema';
import { AssetDto } from '../../../../api/dtos/AssetDtoSchema';
import { NameAccessor } from '../../../../curriculum/delivery-models/add-new-curriculum-model-card';
import {
  AccessorFunction,
  RatingAccessorProps,
  RatingListAccessor
} from './rating-table';
import { MockReturn } from '../../../../selective-context/hooks/generic/use-selective-context-listener';
import { ConfirmRatingValue } from '../../../../selective-context/hooks/derived/use-confirm-rating-value-function';
import { EmptyArray } from '../../../../api/main';
import { Draft } from 'immer';
import { UseSelectiveContextDispatch } from '../../../../selective-context/hooks/generic/use-selective-context-dispatch';

export interface RatingEditContext<R, E> extends RatingAccessorProps<R> {
  elementLabelAccessor: NameAccessor<E>;
  elementIdAccessor: AccessorFunction<E, string | number>;
  ratingListAccessor: RatingListAccessor<E, R>;
  useRatingListDispatchHook: UseSelectiveContextDispatch<R[]>;
  ratingProducer: (rating: R | Draft<R>, value: number) => R;
  confirmRatingValue: ConfirmRatingValue<R, E>;
  unsavedChangesListKey: string;
  unsavedChangesKey: string;
}

const defaultContext: RatingEditContext<any, any> = {
  confirmRatingValue: () => {},
  ratingValueAccessor: () => NaN,
  ratingProducer: () => {},
  ratingCategoryLabelAccessor: () => '',
  ratingCategoryIdAccessor: () => NaN,
  ratingListAccessor: () => EmptyArray,
  elementLabelAccessor: () => '',
  elementIdAccessor: () => NaN,
  useRatingListDispatchHook: () => MockReturn,
  unsavedChangesKey: '',
  unsavedChangesListKey: ''
};

export const SkillEditContext = createContext<
  RatingEditContext<WorkTaskCompetencyDto, ProviderRoleDto>
>(defaultContext as RatingEditContext<WorkTaskCompetencyDto, ProviderRoleDto>);
export const AssetSuitabilityEditContext =
  createContext<RatingEditContext<AssetRoleWorkTaskSuitabilityDto, AssetDto>>(
    defaultContext
  );

export const GenericRatingEditContext =
  createContext<RatingEditContext<any, any>>(defaultContext);
