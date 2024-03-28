import { AccessorFunction, RatingListAccessor } from './rating-table';
import { RatingTableRatings } from './rating-table-ratings';
import { RatedElementRowHeader } from './rated-element-row-header';

export function RatingTableBody<R, E>({
  elementsWithRatings,
  elementIdAccessor
}: {
  elementsWithRatings: E[];
  elementIdAccessor: AccessorFunction<E, string>;
}) {
  return elementsWithRatings.map((ratedElement) => (
    <tr key={elementIdAccessor(ratedElement)} className="">
      <th
        className="text-sm px-2 sticky left-0 bg-opacity-100 z-10 bg-white"
        scope={'row'}
      >
        <RatedElementRowHeader elementWithRating={ratedElement} />
      </th>
      <RatingTableRatings ratedElement={ratedElement} />
    </tr>
  ));
}
