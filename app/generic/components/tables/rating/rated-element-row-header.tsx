'use client';
import { PropsWithChildren, useContext } from 'react';
import { GenericRatingEditContext } from './rating-edit-context';
import { ConfirmActionModal } from '../../modals/confirm-action-modal';
import { useRatingEditModal } from '../../../hooks/use-rating-edit-modal';
import { EmptyArray, isNotUndefined } from '../../../../api/main';
import { useUnsavedListContext } from '../../../../selective-context/hooks/derived/use-unsaved-list-context';
import { RatingStepper } from '../../buttons/rating-stepper';
import { ArrowRightIcon, PencilSquareIcon } from '@heroicons/react/20/solid';
import { Button } from '@nextui-org/react';

export function RatedElementRowHeader<R, E>({
  elementWithRating
}: {
  elementWithRating: E;
} & PropsWithChildren) {
  const retrievedContext = useContext(GenericRatingEditContext);
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
      <Button
        className={
          'rounded-none w-full h-full m-0 border-0 px-1 text-left focus:outline-offset-0 flex justify-between focus-visible:outline-offset-0 outline-offset-0 focus-visible:outline-1 data-[focus-visible=true]:outline-offset-0'
        }
        onPress={() =>
          triggerModal({ elementWithRating, rating: currentState[0] })
        }
        // size={'md'}
      >
        {elementLabelAccessor(elementWithRating)}
        <ArrowRightIcon className={'w-4 h-4 '}></ArrowRightIcon>
      </Button>
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
