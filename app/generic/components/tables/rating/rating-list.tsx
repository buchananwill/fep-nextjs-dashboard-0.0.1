import React, { useContext } from 'react';
import {
  GenericRatingEditContext,
  RatingEditContext
} from './rating-edit-context';
import { GenericButtonProps } from '../../buttons/rename-button';
import { useRatingEditModalTrigger } from './use-rating-edit-modal-trigger';

const competencyColors: { [key: string]: string } = {
  '0': 'gray-200',
  '1': 'red-300',
  '2': 'amber-300',
  '3': 'amber-400',
  '4': 'green-300',
  '5': 'green-500'
};

function getCompetencyColor(competencyRating: number) {
  return competencyColors[competencyRating.toString()];
}

export function RatingList<R, E>({
  ratingList,
  data
}: {
  data: E;
  ratingList: R[];
}) {
  const {
    elementIdAccessor,
    ratingCategoryLabelAccessor,
    ratingCategoryIdAccessor,
    ratingValueAccessor
  } = useContext(GenericRatingEditContext);

  return (
    <ul className={'divide-y'}>
      {ratingList.map((wtComp) => (
        <RatingListItem
          key={`${elementIdAccessor(data)}-${ratingCategoryIdAccessor(wtComp)}`}
          className={`text-${getCompetencyColor(
            ratingValueAccessor(wtComp)
          )} pb-1 hover:bg-gray-100 cursor-pointer w-full`}
          rating={wtComp}
          elementWithRating={data}
          uniqueListenerKey={`listItem:${elementIdAccessor(
            data
          )}-${ratingCategoryIdAccessor(wtComp)}`}
        >
          {ratingCategoryLabelAccessor(wtComp)} : {ratingValueAccessor(wtComp)}
        </RatingListItem>
      ))}
    </ul>
  );
}

function RatingListItem<R, E>({
  className,
  rating,
  elementWithRating,
  uniqueListenerKey,
  children
}: GenericButtonProps & {
  rating: R;
  elementWithRating: E;
  uniqueListenerKey: string;
}) {
  const cachedFunction = useRatingEditModalTrigger({
    listenerKey: uniqueListenerKey
  });
  return (
    <li>
      <button
        className={className}
        onClick={() => cachedFunction({ rating, elementWithRating })}
      >
        {children}
      </button>
    </li>
  );
}
