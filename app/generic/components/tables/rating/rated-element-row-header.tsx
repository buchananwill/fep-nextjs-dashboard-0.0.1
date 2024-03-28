'use client';
import { Context, PropsWithChildren, useContext } from 'react';
import { RatingEditContext } from './rating-edit-context';
import { ConfirmActionModal } from '../../modals/confirm-action-modal';
import { useRatingEditModal } from '../../../hooks/use-rating-edit-modal';
import { EmptyArray, isNotUndefined } from '../../../../api/main';
import { useUnsavedListContext } from '../../../hooks/selective-context/use-unsaved-list-context';
import { RatingStepper } from '../../buttons/rating-stepper';
import { PencilSquareIcon } from '@heroicons/react/20/solid';

export function RatedElementRowHeader<R, E>({
  elementWithRating,
  ratingEditContext
}: {
  elementWithRating: E;
  ratingEditContext: Context<RatingEditContext<R, E>>;
} & PropsWithChildren) {
  const retrievedContext = useContext(ratingEditContext);
  const {
    elementLabelAccessor,
    elementIdAccessor,
    useRatingListDispatchHook,
    unsavedChangesListKey,
    unsavedChangesKey,
    ratingProducer,
    ratingValueAccessor
  } = retrievedContext;
  const { currentState, dispatchWithoutControl } = useRatingListDispatchHook(
    elementIdAccessor(elementWithRating).toString(),
    'row-header',
    EmptyArray
  );

  const addUnsavedChange = useUnsavedListContext(
    unsavedChangesKey,
    unsavedChangesListKey
  );

  const confirmRatingValue = (rating: R, element: E, value: number) => {
    if (!isNotUndefined(rating) || !isNotUndefined(element)) return;
    const ratings = currentState.map((rating) => ratingProducer(rating, value));

    console.log(ratings);
    dispatchWithoutControl(ratings);
    addUnsavedChange(elementIdAccessor(elementWithRating).toString());
  };
  const {
    triggerModal,
    show,
    onClose,
    modalRatingValue,
    modifySkillValue,
    onConfirm
  } = useRatingEditModal({
    confirmRatingValue: confirmRatingValue,
    ratingCategoryLabelAccessor: () => 'Set All Ratings',
    ratingValueAccessor: ratingValueAccessor,
    nameAccessor: elementLabelAccessor
  });

  return (
    <>
      <button
        className={
          'btn rounded-none w-full h-full px-1 btn-xs text-left flex justify-between'
        }
        onClick={() =>
          triggerModal({ elementWithRating, rating: currentState[0] })
        }
      >
        {elementLabelAccessor(elementWithRating)}
        <PencilSquareIcon className={'w-4 h-4 '}></PencilSquareIcon>
      </button>
      <ConfirmActionModal
        show={show}
        onClose={onClose}
        onConfirm={onConfirm}
        onCancel={() => onClose()}
      >
        <div className={'p-2'}>Set all ratings for filtered row.</div>
        <RatingStepper
          handleDecrement={() => modifySkillValue(-1)}
          ratingValue={modalRatingValue}
          handleIncrement={() => modifySkillValue(1)}
        />
      </ConfirmActionModal>
    </>
  );
}
