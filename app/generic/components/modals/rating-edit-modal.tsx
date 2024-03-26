'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import { HUE_OPTIONS } from '../color/color-context';
import { NameAccessor } from '../../../curriculum/delivery-models/add-new-curriculum-model-card';
import {
  RatingCategoryLabelAccessor,
  RatingValueAccessor
} from '../../../staffroom/teachers/rating-table';
import { PropsWithChildren, useMemo } from 'react';

import { ConfirmRatingValue } from '../../../premises/use-confirm-rating-value-function';
import { useRatingEditModal } from '../../hooks/use-rating-edit-modal';

import { useSelectiveContextControllerFunction } from '../selective-context/selective-context-manager-function';
import { ConfirmActionModal } from './confirm-action-modal';

export interface RatingEditModalProps<R, E> {
  ratingCategoryLabelAccessor: RatingCategoryLabelAccessor<R>;
  ratingValueAccessor: RatingValueAccessor<R>;
  nameAccessor: NameAccessor<E>;
  confirmRatingValue: ConfirmRatingValue<R, E>;
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
  children
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
      <ConfirmActionModal title={'Change Skill Value'} {...skillEditProps}>
        <div className="p-2 bg-gray-100 rounded-lg">
          <div className="font-light">
            {elementWithRatingsInModal &&
              nameAccessor(elementWithRatingsInModal)}
            :
          </div>
          <div className="font-light flex py-2">
            {ratingInModal && ratingCategoryLabelAccessor(ratingInModal)}:
            <div className="flex col px-2">
              <button
                className="border-2 rounded-md p-1 mx-1 hover:bg-gray-600 hover:text-gray-50"
                onClick={() => modifySkillValue && modifySkillValue(-1)}
              >
                <MinusIcon className=" h-4 w-4"></MinusIcon>
              </button>
              <div
                className={`w-7 rounded-md px-2 bg-${HUE_OPTIONS[modalRatingValue].id}-400 justify-center text-center`}
              >
                {modalRatingValue}
              </div>
              <button
                className="border-2 rounded-md p-1 mx-1 hover:bg-gray-600 hover:text-gray-50"
                onClick={() => modifySkillValue && modifySkillValue(1)}
              >
                <PlusIcon className=" h-4 w-4"></PlusIcon>
              </button>
            </div>
          </div>
        </div>
      </ConfirmActionModal>
    </>
  );
}
