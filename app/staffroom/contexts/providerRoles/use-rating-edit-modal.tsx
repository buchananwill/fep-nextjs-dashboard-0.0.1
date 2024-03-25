import { NameAccessor } from '../../../curriculum/delivery-models/add-new-curriculum-model-card';
import { RatingAccessorProps } from '../../teachers/rating-table';
import { useCallback, useState } from 'react';
import { useModal } from '../../../components/confirm-action-modal';
import { RatingEditModalProps } from './rating-edit-modal';

import { isNotUndefined } from '../../../api/main';

interface RatingEditModalHookProps<R, E> {
  confirmRatingValue: (rating: R, element: E, updatedValue: number) => void;
  nameAccessor: NameAccessor<E>;
}

export function useRatingEditModal<R, E>({
  confirmRatingValue,
  ratingValueAccessor,
  ...ratingModalProps
}: RatingEditModalHookProps<R, E> &
  Omit<RatingAccessorProps<R>, 'ratingCategoryIdAccessor'>) {
  const [modalRatingValue, setModalRatingValue] = useState(0);
  const [ratingInModal, setRatingInModal] = useState<R>();
  const [elementInModal, setProviderInModal] = useState<E>();
  const { isOpen, closeModal, openModal } = useModal();

  const triggerModal = useCallback(
    (rating: R, elementWithRating: E) => {
      setProviderInModal(elementWithRating);
      setModalRatingValue(ratingValueAccessor(rating));
      setRatingInModal(rating);
      openModal();
    },
    [openModal, ratingValueAccessor]
  );

  const modifySkillValue = useCallback((number: number) => {
    setModalRatingValue((prevState) => {
      const updatedValue = prevState + number;
      if (updatedValue > 5 || updatedValue < 0) return prevState;
      else return updatedValue;
    });
  }, []);

  const ratingEditModalProps: RatingEditModalProps<R, E> = {
    show: isOpen,
    onConfirm: () => {
      if (isNotUndefined(ratingInModal) && isNotUndefined(elementInModal)) {
        confirmRatingValue(ratingInModal, elementInModal, modalRatingValue);
      }
      closeModal();
    },
    onCancel: () => closeModal(),
    onClose: () => closeModal(),
    elementWithRatingsInModal: elementInModal,
    modalRatingValue,
    ratingInModal,
    modifySkillValue,
    ...ratingModalProps
  };
  return { ratingEditModalProps, triggerModal, elementInModal };
}
