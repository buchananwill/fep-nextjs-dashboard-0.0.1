import { AccessorFunction, RatingListAccessor } from './rating-table';
import { Context } from 'react';
import { RatingEditContext } from './rating-edit-context';
import { RatingTableRatings } from './rating-table-ratings';
import { RatedElementRowHeader } from './rated-element-row-header';

export function RatingTableBody<R, E>({
  elementsWithRatings,
  elementIdAccessor,
  ratingEditContext
}: {
  elementsWithRatings: E[];
  listAccessor: RatingListAccessor<E, R>;
  elementIdAccessor: AccessorFunction<E, string>;
  ratingEditContext: Context<RatingEditContext<R, E>>;
}) {
  return elementsWithRatings.map((ratedElement) => (
    <tr key={elementIdAccessor(ratedElement)} className="">
      <th
        className="text-sm px-2 sticky left-0 bg-opacity-100 z-10 bg-white"
        scope={'row'}
      >
        <RatedElementRowHeader
          elementWithRating={ratedElement}
          ratingEditContext={ratingEditContext}
        />
      </th>
      <RatingTableRatings
        ratedElement={ratedElement}
        ratingEditContext={ratingEditContext}
      />
    </tr>
  ));
}
