import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';
import { HasNameDto } from '../../api/dtos/HasNameDtoSchema';
import { Context, PropsWithChildren, useContext } from 'react';
import { RatingEditContext } from '../contexts/providerRoles/rating-edit-context';
import {
  RatingTableHeader,
  RatingTableHeaderCell,
  RatingTableMain
} from './rating-table-components';
import { RatingTableRatings } from './rating-table-ratings';

export interface AccessorFunction<O, P> {
  (object: O): P;
}

export type RatingValueAccessor<T> = AccessorFunction<T, number>;
export type RatingListAccessor<E, R> = AccessorFunction<E, R[] | undefined>;
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
}

export default function RatingTable<
  R extends HasNumberIdDto,
  E extends HasNumberIdDto,
  C extends HasNumberIdDto & HasNameDto
>({
  ratingCategories,
  ratingCategoryDescriptor,
  children
}: RatingTableProps<R, E, C> & PropsWithChildren) {
  return (
    <RatingTableMain>
      <RatingTableHeader ratingCategoryDescriptor={ratingCategoryDescriptor}>
        {ratingCategories.map((category) => (
          <RatingTableHeaderCell key={category.id}>
            {category.name}
          </RatingTableHeaderCell>
        ))}
      </RatingTableHeader>
      <tbody>{children}</tbody>
    </RatingTableMain>
  );
}
