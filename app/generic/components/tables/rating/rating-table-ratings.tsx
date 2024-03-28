'use client';

import { RatingTableCell } from './rating-table-cell';
import { useContext } from 'react';
import { GenericRatingEditContext } from './rating-edit-context';
import { EmptyArray } from '../../../../api/main';

export function RatingTableRatings<R, E>({
  ratedElement
}: {
  ratedElement: E;
}) {
  const {
    ratingCategoryIdAccessor,
    useRatingListDispatchHook,
    elementIdAccessor
  } = useContext(GenericRatingEditContext);
  const listKey = `${elementIdAccessor(ratedElement)}`;
  const listenerKey = `${listKey}-ratings`;
  const { currentState } = useRatingListDispatchHook(
    listKey,
    listenerKey,
    EmptyArray as R[]
  );

  return (
    <>
      {currentState.map((rating) => (
        <RatingTableCell
          key={`${listKey}:${ratingCategoryIdAccessor(rating)}`}
          ratedElement={ratedElement}
          rating={rating}
        ></RatingTableCell>
      ))}
    </>
  );
}
