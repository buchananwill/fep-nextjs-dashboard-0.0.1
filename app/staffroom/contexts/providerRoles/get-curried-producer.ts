import { Draft, produce } from 'immer';

export function getCurriedProducer<T, U>(
  ratingSetter: (rating: Draft<T>, updatedValue: U) => void
) {
  return function ratingProducer(rating: T, updatedValue: U) {
    return produce(rating, (draft) => {
      ratingSetter(draft, updatedValue);
    });
  };
}
