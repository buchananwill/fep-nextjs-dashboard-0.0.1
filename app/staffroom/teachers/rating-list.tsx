import React, { useContext } from 'react';
import { RatingEditContext } from '../contexts/providerRoles/rating-edit-context';

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
  context,
  ratingList,
  data
}: {
  data: E;
  ratingList: R[];
  context: React.Context<RatingEditContext<R, E>>;
}) {
  const {
    elementIdAccessor,
    ratingCategoryLabelAccessor,
    ratingCategoryIdAccessor,
    triggerModal,
    ratingValueAccessor
  } = useContext(context);
  return (
    <ul className={'divide-y'}>
      {ratingList.map((wtComp, index) => (
        <li
          key={`${elementIdAccessor(data)}-${ratingCategoryIdAccessor(wtComp)}`}
        >
          <button
            className={`text-${getCompetencyColor(
              ratingValueAccessor(wtComp)
            )} pb-1 hover:bg-gray-100 cursor-pointer w-full`}
            onClick={() => triggerModal(wtComp, data)}
          >
            {ratingCategoryLabelAccessor(wtComp)} :{' '}
            {ratingValueAccessor(wtComp)}
          </button>
        </li>
      ))}
    </ul>
  );
}
