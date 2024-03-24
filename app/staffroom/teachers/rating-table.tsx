import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';
import { HasNameDto } from '../../api/dtos/HasNameDtoSchema';
import { NameAccessor } from '../../curriculum/delivery-models/add-new-curriculum-model-card';
import { RatingTableCell } from './rating-table-cell';
import { Context } from 'react';
import { RatingEditContext } from '../contexts/providerRoles/rating-edit-context';
import {
  RatingTableHeader,
  RatingTableHeaderCell,
  RatingTableMain
} from './rating-table-components';

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
    <RatingTableMain>
      <RatingTableHeader ratingCategoryDescriptor={ratingCategoryDescriptor}>
        {ratingCategories.map((category) => (
          <RatingTableHeaderCell key={category.id}>
            {category.name}
          </RatingTableHeaderCell>
        ))}
      </RatingTableHeader>
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
    </RatingTableMain>
  );
}
