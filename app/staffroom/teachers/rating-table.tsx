import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';
import { HasNameDto } from '../../api/dtos/HasNameDtoSchema';
import { NameAccessor } from '../../curriculum/delivery-models/add-new-curriculum-model-card';
import { RatingTableCell } from './rating-table-cell';
import { Context } from 'react';
import { RatingEditContext } from '../contexts/providerRoles/rating-edit-context';

export interface AccessorFunction<O, P> {
  (object: O): P;
}

export type RatingAccessor<T> = AccessorFunction<T, number>;
export type RatingListAccessor<E, R> = AccessorFunction<E, R[]>;
export type RatingCategoryLabelAccessor<R> = AccessorFunction<R, string>;
export type RatingCategoryIdAccessor<R> = AccessorFunction<R, number>;

export interface RatingAccessorProps<R> {
  ratingCategoryLabelAccessor: RatingCategoryLabelAccessor<R>;
  ratingValueAccessor: RatingAccessor<R>;
  ratingCategoryIdAccessor: RatingCategoryIdAccessor<R>;
}

export interface ModalTriggerFunction<R, E> {
  (rating: R, ratedElement: E): void;
}

export interface RatingTableProps<R, E, C> extends RatingAccessorProps<R> {
  ratedElements: E[];
  labelAccessor: NameAccessor<E>;
  ratingListAccessor: RatingListAccessor<E, R>;
  ratingCategories: C[];
  ratingCategoryDescriptor: React.ReactNode;
  ratingEditContext: Context<RatingEditContext<R, E>>;
}

export default function RatingTable<
  R extends HasNumberIdDto,
  E extends HasNumberIdDto,
  C extends HasNumberIdDto & HasNameDto
>({
  ratingValueAccessor,
  ratingCategoryLabelAccessor,
  ratingCategoryIdAccessor,
  ratedElements,
  labelAccessor,
  ratingListAccessor,
  ratingCategories,
  ratingCategoryDescriptor,
  ratingEditContext
}: RatingTableProps<R, E, C>) {
  console.log('rendering rating table');

  return (
    <div className="m-2 p-2 border-2 rounded-lg">
      <table className="table-fixed ">
        <thead className="text-sm ">
          <tr className="h-32 overflow-visible">
            <th className="px-2 w-40 h-[160px]">
              <div
                className={
                  'h-full min-h-max max-h-full flex flex-col items-stretch justify-between'
                }
              >
                <div className={'text-right'}>{ratingCategoryDescriptor}</div>
                <div
                  className={
                    'grow divide-y-2 flex flex-col justify-center rotate-45'
                  }
                >
                  <div></div>
                  <div></div>
                </div>
                <div className={'text-left'}>Name</div>
              </div>
            </th>
            {ratingCategories.map((category) => (
              <th
                className={`overflow-visible align-bottom relative`}
                key={category.id}
              >
                <div
                  className={`group/skill overflow-visible align-bottom`}
                  style={{ width: '24px', height: '200px' }}
                >
                  <div
                    className={`text-xs absolute origin-left left-3 -bottom-2 group-hover/skill:-translate-y-3 group-hover/skill:z-10 group-hover/skill:-translate-x-3  -rotate-90 group-hover/skill:rotate-0 transition-transform duration-200 align-bottom bg-gray-100 rounded-lg w-48 py-1 font-medium opacity-50 group-hover/skill:opacity-100 truncate ...`}
                  >
                    {category.name}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ratedElements.map((ratedElement) => (
            <tr key={ratedElement.id} className="">
              <td className="text-sm px-2">{labelAccessor(ratedElement)}</td>
              {ratingListAccessor(ratedElement)
                .filter((rating) =>
                  ratingCategories.some(
                    (cat) => cat.id === ratingCategoryIdAccessor(rating)
                  )
                )
                .map((rating) => (
                  <RatingTableCell
                    key={rating.id}
                    ratedElement={ratedElement}
                    rating={rating}
                    ratingCategoryLabelAccessor={ratingCategoryLabelAccessor}
                    ratingEditContext={ratingEditContext}
                    ratingValueAccessor={ratingValueAccessor}
                  ></RatingTableCell>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
