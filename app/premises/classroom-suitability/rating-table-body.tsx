import {
  AccessorFunction,
  RatingListAccessor
} from '../../staffroom/teachers/rating-table';
import { NameAccessor } from '../../curriculum/delivery-models/add-new-curriculum-model-card';
import { Context } from 'react';
import { RatingEditContext } from '../../generic/components/modals/rating-edit-context';
import { RatingTableRatings } from '../../staffroom/teachers/rating-table-ratings';

export function RatingTableBody<R, E>({
  elementsWithRatings,
  elementIdAccessor,
  elementLabelAccessor,
  ratingEditContext
}: {
  elementsWithRatings: E[];
  listAccessor: RatingListAccessor<E, R>;
  elementIdAccessor: AccessorFunction<E, string>;
  elementLabelAccessor: NameAccessor<E>;
  ratingEditContext: Context<RatingEditContext<R, E>>;
}) {
  return elementsWithRatings.map((ratedElement) => (
    <tr key={elementIdAccessor(ratedElement)} className="">
      <th
        className="text-sm px-2 sticky left-0 bg-opacity-100 z-10 bg-white"
        scope={'row'}
      >
        {elementLabelAccessor(ratedElement)}
      </th>
      <RatingTableRatings
        ratedElement={ratedElement}
        ratingEditContext={ratingEditContext}
      />
    </tr>
  ));
}
