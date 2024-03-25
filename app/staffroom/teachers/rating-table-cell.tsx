import { Context, useContext } from 'react';
import { RatingEditContext } from '../contexts/providerRoles/rating-edit-context';
import { HUE_OPTIONS } from '../../contexts/color/color-context';
import { Tooltip, TooltipTrigger } from '../../components/tooltips/tooltip';
import { StandardTooltipContent } from '../../components/tooltips/standard-tooltip-content';
import {
  RatingValueAccessor,
  RatingCategoryLabelAccessor,
  AccessorFunction
} from './rating-table';
import {
  GenericFunctionWrapper,
  ObjectPlaceholder,
  useSelectiveContextListenerFunction
} from '../../components/selective-context/selective-context-manager-function';
import { RatingEditModalTriggerProps } from '../contexts/providerRoles/rating-edit-modal';

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
    elementIdAccessor: elementIdAccessor,
    ratedElement: ratedElement,
    ratingCategoryIdAccessor: ratingCategoryIdAccessor,
    rating: rating,
    listenerKey: `cell:${elementIdAccessor(
      ratedElement
    )}-${ratingCategoryIdAccessor(rating)}`
  });

  console.log('rendering table cell');

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
