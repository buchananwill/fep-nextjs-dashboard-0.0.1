import { NameAccessor } from '../../curriculum/delivery-models/add-new-curriculum-model-card';
import { RatingAccessorProps } from '../../staffroom/teachers/rating-table';
import { useCallback, useState } from 'react';

import { isNotUndefined } from '../../api/main';
import { useModal } from '../components/modals/confirm-action-modal';

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
    ({ elementWithRating, rating }: { rating: R; elementWithRating: E }) => {
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

  return {
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
    triggerModal,
    ...ratingModalProps
  };
}
