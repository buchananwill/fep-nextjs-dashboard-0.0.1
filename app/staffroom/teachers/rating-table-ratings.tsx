'use client';

import { RatingTableCell } from './rating-table-cell';
import { Context, useContext } from 'react';
import { RatingEditContext } from '../../generic/components/modals/rating-edit-context';
import { EmptyArray } from '../../api/main';

export function RatingTableRatings<R, E>({
  ratedElement,
  ratingEditContext
}: {
  ratedElement: E;
  ratingEditContext: Context<RatingEditContext<R, E>>;
}) {
  const {
    ratingCategoryIdAccessor,
    useRatingListDispatchHook,
    elementIdAccessor
  } = useContext(ratingEditContext);
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
          ratingEditContext={ratingEditContext}
        ></RatingTableCell>
      ))}
    </>
  );
}
