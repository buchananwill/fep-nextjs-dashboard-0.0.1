import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';
import { HasNameDto } from '../../api/dtos/HasNameDtoSchema';
import { RatingTableCell } from './rating-table-cell';
import { Context, useContext } from 'react';
import { RatingEditContext } from '../contexts/providerRoles/rating-edit-context';
import {
  RatingTableHeader,
  RatingTableHeaderCell,
  RatingTableMain
} from './rating-table-components';

export interface AccessorFunction<O, P> {
  (object: O): P;
}

export type RatingValueAccessor<T> = AccessorFunction<T, number>;
export type RatingListAccessor<E, R> = AccessorFunction<E, R[]>;
export type RatingCategoryLabelAccessor<R> = AccessorFunction<R, string>;
export type RatingCategoryIdAccessor<R> = AccessorFunction<R, number>;

export interface RatingAccessorProps<R> {
  ratingCategoryLabelAccessor: RatingCategoryLabelAccessor<R>;
  ratingValueAccessor: RatingValueAccessor<R>;
  ratingCategoryIdAccessor: RatingCategoryIdAccessor<R>;
}

export interface ModalTriggerFunction<R, E> {
  (rating: R, ratedElement: E): void;
}

export interface RatingTableProps<R, E, C> {
  ratedElements: E[];
  ratingCategories: C[];
  ratingCategoryDescriptor: React.ReactNode;
  ratingEditContext: Context<RatingEditContext<R, E>>;
}

export default function RatingTable<
  R extends HasNumberIdDto,
  E extends HasNumberIdDto,
  C extends HasNumberIdDto & HasNameDto
>({
  ratedElements,
  ratingCategories,
  ratingCategoryDescriptor,
  ratingEditContext
}: RatingTableProps<R, E, C>) {
  const { elementLabelAccessor, ratingListAccessor, ratingCategoryIdAccessor } =
    useContext(ratingEditContext);

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
            <td className="text-sm px-2">
              {elementLabelAccessor(ratedElement)}
            </td>
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
                  ratingEditContext={ratingEditContext}
                ></RatingTableCell>
              ))}
          </tr>
        ))}
      </tbody>
    </RatingTableMain>
  );
}
