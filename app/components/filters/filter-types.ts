import { HasNumberId, Nameable } from '../../api/dto-interfaces';

export type Predicate<T> = (element: T) => boolean;

type LogicalOperator = 'AND' | 'OR';

function invertPredicate<T>(predicate: Predicate<T>): Predicate<T> {
  return (element: T) => !predicate(element);
}

function combinePredicates<T>(
  predicate: Predicate<T>,
  otherPredicate: Predicate<T>,
  operator: LogicalOperator
): Predicate<T> {
  return operator === 'AND'
    ? (element: T) => predicate(element) && otherPredicate(element)
    : (element: T) => predicate(element) || otherPredicate(element);
}

export interface PredicateRequest<T> extends HasNumberId, Nameable {
  predicateFactoryList: PredicateFactory<T>[];
  operator: LogicalOperator;
  inversion?: boolean;
}

type PredicateReducer<T> = (
  reductionRequest: PredicateRequest<T>
) => Predicate<T>;

const reducePredicates: PredicateReducer<any> = <T>({
  predicateFactoryList,
  operator,
  inversion
}: PredicateRequest<T>): Predicate<T> => {
  const reduced = predicateFactoryList
    .map((factory) => factory())
    .reduce((prev, curr) => combinePredicates(prev, curr, operator));
  return inversion ? invertPredicate(reduced) : reduced;
};

export type PredicateFactory<T> = () => Predicate<T>;

interface PredicateFactoryStack<T> extends Nameable, HasNumberId {
  masterFactory: PredicateFactory<T>;
}

export function packagePredicate<T>(
  predicate: Predicate<T>
): PredicateFactory<T> {
  return () => {
    return predicate;
  };
}

export function packageRequest<T>(
  request: PredicateRequest<T>,
  defaultValue: boolean = true
): PredicateFactory<T> {
  if (request.predicateFactoryList.length == 0)
    return packagePredicate((element) => defaultValue);
  return () => reducePredicates(request);
}
