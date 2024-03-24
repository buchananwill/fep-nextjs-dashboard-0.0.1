'use client';
import {
  ConfirmActionModal,
  ConfirmActionModalProps
} from '../../../components/confirm-action-modal';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import { HUE_OPTIONS } from '../../../contexts/color/color-context';
import { isNotUndefined } from '../../../graphing/editing/functions/graph-edits';
import { NameAccessor } from '../../../curriculum/delivery-models/add-new-curriculum-model-card';
import {
  RatingAccessorProps,
  RatingCategoryLabelAccessor
} from '../../teachers/rating-table';

export interface RatingEditModalProps<R, E> extends ConfirmActionModalProps {
  modifySkillValue?: (modifyAmount: number) => void;
  ratingCategoryLabelAccessor: RatingCategoryLabelAccessor<R>;
  elementWithRatingsInModal?: E;
  nameAccessor: NameAccessor<E>;
  ratingInModal?: R;
  modalRatingValue: number;
}

export function RatingEditModal<R, E>({
  modifySkillValue,
  elementWithRatingsInModal,
  nameAccessor,
  ratingInModal,
  ratingCategoryLabelAccessor,
  modalRatingValue,
  ...skillEditTransaction
}: RatingEditModalProps<R, E>) {
  console.log('rendering modal');

  return (
    <ConfirmActionModal title={'Change Skill Value'} {...skillEditTransaction}>
      <div className="p-2 bg-gray-100 rounded-lg">
        <div className="font-light">
          {elementWithRatingsInModal && nameAccessor(elementWithRatingsInModal)}
          :
        </div>
        <div className="font-light flex py-2">
          {ratingInModal && ratingCategoryLabelAccessor(ratingInModal)}:
          <div className="flex col px-2">
            <button
              className="border-2 rounded-md p-1 mx-1 hover:bg-gray-600 hover:text-gray-50"
              onClick={() => modifySkillValue && modifySkillValue(-1)}
            >
              <MinusIcon className=" h-4 w-4"></MinusIcon>
            </button>
            <div
              className={`w-7 rounded-md px-2 bg-${HUE_OPTIONS[modalRatingValue].id}-400 justify-center text-center`}
            >
              {modalRatingValue}
            </div>
            <button
              className="border-2 rounded-md p-1 mx-1 hover:bg-gray-600 hover:text-gray-50"
              onClick={() => modifySkillValue && modifySkillValue(1)}
            >
              <PlusIcon className=" h-4 w-4"></PlusIcon>
            </button>
          </div>
        </div>
      </div>
    </ConfirmActionModal>
  );
}
