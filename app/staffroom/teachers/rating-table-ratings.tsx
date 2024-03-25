'use client';

import { RatingTableCell } from './rating-table-cell';
import { Context, useContext } from 'react';
import { RatingEditContext } from '../contexts/providerRoles/rating-edit-context';
import { EmptyNumberIdArray } from '../../premises/classroom-suitability/asset-suitability-table-wrapper';

export function RatingTableRatings<R, E>({
  ratedElement,
  ratingEditContext
}: {
  ratedElement: E;
  ratingEditContext: Context<RatingEditContext<R, E>>;
}) {
  const {
    ratingCategoryIdAccessor,
    useRatingListListenerHook,
    elementIdAccessor
  } = useContext(ratingEditContext);
  const listKey = `${elementIdAccessor(ratedElement)}`;
  const listenerKey = `${listKey}-ratings`;
  const { currentState } = useRatingListListenerHook(
    listKey,
    listenerKey,
    EmptyNumberIdArray as R[]
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
