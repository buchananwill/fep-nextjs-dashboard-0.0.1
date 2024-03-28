'use client';

import { NameAccessor } from '../../../curriculum/delivery-models/add-new-curriculum-model-card';
import {
  RatingCategoryLabelAccessor,
  RatingValueAccessor
} from '../tables/rating/rating-table';
import { PropsWithChildren, useMemo } from 'react';

import { ConfirmRatingValue } from '../../hooks/selective-context/use-confirm-rating-value-function';
import { useRatingEditModal } from '../../hooks/use-rating-edit-modal';

import { useSelectiveContextControllerFunction } from '../selective-context/selective-context-manager-function';
import { ConfirmActionModal } from './confirm-action-modal';
import { RatingStepper } from '../buttons/rating-stepper';

export interface RatingEditModalProps<R, E> {
  ratingCategoryLabelAccessor: RatingCategoryLabelAccessor<R>;
  ratingValueAccessor: RatingValueAccessor<R>;
  nameAccessor: NameAccessor<E>;
  confirmRatingValue: ConfirmRatingValue<R, E>;
  ratingDescriptor?: string;
}

export interface RatingEditModalTriggerProps<R, E> {
  rating: R;
  elementWithRating: E;
}

export function RatingEditModal<R, E>({
  nameAccessor,
  ratingCategoryLabelAccessor,
  ratingValueAccessor,
  confirmRatingValue,
  children,
  ratingDescriptor = 'Rating'
}: RatingEditModalProps<R, E> & PropsWithChildren) {
  const {
    triggerModal,
    modifySkillValue,
    elementWithRatingsInModal,
    ratingInModal,
    modalRatingValue,
    ...skillEditProps
  } = useRatingEditModal({
    confirmRatingValue,
    ratingValueAccessor: ratingValueAccessor,
    nameAccessor: nameAccessor,
    ratingCategoryLabelAccessor: ratingCategoryLabelAccessor
  });

  const triggerFunction = useMemo(() => {
    return { cachedFunction: triggerModal };
  }, [triggerModal]);

  useSelectiveContextControllerFunction<
    RatingEditModalTriggerProps<R, E>,
    void
  >('prepare-rating-modal', 'rating-edit-modal', triggerFunction);

  return (
    <>
      {children}
      <ConfirmActionModal
        title={`Change ${ratingDescriptor} Value`}
        {...skillEditProps}
      >
        <div className="p-2 bg-gray-100 rounded-lg">
          <div className="font-light">
            {elementWithRatingsInModal &&
              nameAccessor(elementWithRatingsInModal)}
            :
          </div>
          <div className="font-light flex py-2">
            {ratingInModal && ratingCategoryLabelAccessor(ratingInModal)}:
            <RatingStepper
              handleDecrement={() => modifySkillValue && modifySkillValue(-1)}
              ratingValue={modalRatingValue}
              handleIncrement={() => modifySkillValue && modifySkillValue(1)}
            />
          </div>
        </div>
      </ConfirmActionModal>
    </>
  );
}
