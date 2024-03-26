import { Context, useContext } from 'react';
import { RatingEditContext } from './rating-edit-context';
import { HUE_OPTIONS } from '../../color/color-context';
import { Tooltip, TooltipTrigger } from '../../tooltips/tooltip';
import { StandardTooltipContent } from '../../tooltips/standard-tooltip-content';
import {
  GenericFunctionWrapper,
  ObjectPlaceholder,
  useSelectiveContextListenerFunction
} from '../../selective-context/selective-context-manager-function';
import { RatingEditModalTriggerProps } from '../../modals/rating-edit-modal';

interface RatingTableCellProps<R, E> {
  rating: R;

  ratedElement: E;

  ratingEditContext: Context<RatingEditContext<R, E>>;
}

export function useRatingEditModalTrigger<E, R>({
  listenerKey
}: {
  listenerKey: string;
}) {
  const {
    currentFunction: { cachedFunction }
  } = useSelectiveContextListenerFunction<
    RatingEditModalTriggerProps<R, E>,
    void
  >(
    'prepare-rating-modal',
    listenerKey,
    ObjectPlaceholder as GenericFunctionWrapper<any, any>
  );
  return cachedFunction;
}

export function RatingTableCell<R, E>({
  rating,
  ratedElement,
  ratingEditContext
}: RatingTableCellProps<R, E>) {
  const {
    ratingCategoryLabelAccessor,
    ratingValueAccessor,
    elementIdAccessor,
    ratingCategoryIdAccessor
  } = useContext(ratingEditContext);

  const cachedFunction = useRatingEditModalTrigger({
    listenerKey: `cell:${elementIdAccessor(
      ratedElement
    )}-${ratingCategoryIdAccessor(rating)}`
  });

  return (
    <td
      className={`border bg-${
        HUE_OPTIONS[ratingValueAccessor(rating)].id
      }-400 cursor-pointer`}
      onClick={() => {
        cachedFunction({ rating, elementWithRating: ratedElement });
      }}
    >
      <Tooltip placement={'bottom'}>
        <TooltipTrigger>
          <div className={'px-2'}>{ratingValueAccessor(rating)}</div>
        </TooltipTrigger>

        <StandardTooltipContent>
          <strong>{ratingCategoryLabelAccessor(rating)}</strong>: click to edit.
        </StandardTooltipContent>
      </Tooltip>
    </td>
  );
}
