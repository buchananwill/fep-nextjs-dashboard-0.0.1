import { Context, useContext } from 'react';
import { RatingEditContext } from '../contexts/providerRoles/rating-edit-context';
import { HUE_OPTIONS } from '../../contexts/color/color-context';
import { Tooltip, TooltipTrigger } from '../../components/tooltips/tooltip';
import { StandardTooltipContent } from '../../components/tooltips/standard-tooltip-content';
import {
  RatingValueAccessor,
  RatingCategoryLabelAccessor
} from './rating-table';

interface RatingTableCellProps<R, E> {
  rating: R;

  ratedElement: E;

  ratingEditContext: Context<RatingEditContext<R, E>>;
}

export function RatingTableCell<R, E>({
  rating,
  ratedElement,
  ratingEditContext
}: RatingTableCellProps<R, E>) {
  const {
    triggerModal,
    ratingCategoryLabelAccessor,
    ratingValueAccessor,
    useRatingListListenerHook
  } = useContext(ratingEditContext);

  console.log('rendering table cell');

  return (
    <td
      className={`border bg-${
        HUE_OPTIONS[ratingValueAccessor(rating)].id
      }-400 cursor-pointer`}
      onClick={() => {
        triggerModal(rating, ratedElement);
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
