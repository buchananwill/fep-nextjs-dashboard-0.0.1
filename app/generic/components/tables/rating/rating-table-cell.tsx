'use client';
import { useContext } from 'react';
import { GenericRatingEditContext } from './rating-edit-context';
import { HUE_OPTIONS } from '../../color/color-context';
import { useRatingEditModalTrigger } from './use-rating-edit-modal-trigger';
import { TooltipWrapper } from './tooltip-wrapper';

interface RatingTableCellProps<R, E> {
  rating: R;
  ratedElement: E;
}

export function RatingTableCell<R, E>({
  rating,
  ratedElement
}: RatingTableCellProps<R, E>) {
  const {
    ratingCategoryLabelAccessor,
    ratingValueAccessor,
    elementIdAccessor,
    ratingCategoryIdAccessor
  } = useContext(GenericRatingEditContext);

  const cachedFunction = useRatingEditModalTrigger({
    listenerKey: `cell:${elementIdAccessor(
      ratedElement
    )}-${ratingCategoryIdAccessor(rating)}`
  });

  return (
    <td className={'p-0'}>
      <TooltipWrapper
        tooltipContent={
          <span>
            <strong>{ratingCategoryLabelAccessor(rating)}</strong>: click to
            edit.
          </span>
        }
      >
        <button
          className={` w-full h-full hover:bg-opacity-50 bg-${
            HUE_OPTIONS[ratingValueAccessor(rating)].id
          }-400 cursor-pointer`}
          onClick={() => {
            cachedFunction({ rating, elementWithRating: ratedElement });
          }}
        >
          {ratingValueAccessor(rating)}
        </button>
      </TooltipWrapper>
    </td>
  );
}
