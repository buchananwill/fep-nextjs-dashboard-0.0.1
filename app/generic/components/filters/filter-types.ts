import { HasNumberId, Nameable } from '../../../api/dto-interfaces';

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
  predicateProducerList: PredicateProducer<T>[];
  operator: LogicalOperator;
  inversion?: boolean;
}

type PredicateReducer<T> = (
  reductionRequest: PredicateRequest<T>
) => Predicate<T>;

const reducePredicates: PredicateReducer<any> = <T>({
  predicateProducerList,
  operator,
  inversion
}: PredicateRequest<T>): Predicate<T> => {
  const reduced = predicateProducerList
    .map((producer) => producer())
    .reduce((prev, curr) => combinePredicates(prev, curr, operator));
  return inversion ? invertPredicate(reduced) : reduced;
};

export type PredicateProducer<T> = () => Predicate<T>;

interface PredicateFactoryStack<T> extends Nameable, HasNumberId {
  masterFactory: PredicateProducer<T>;
}

export function packagePredicate<T>(
  predicate: Predicate<T>
): PredicateProducer<T> {
  return () => {
    return predicate;
  };
}

export function packageRequest<T>(
  request: PredicateRequest<T>,
  defaultValue: boolean = true
): PredicateProducer<T> {
  if (request.predicateProducerList.length == 0)
    return packagePredicate(() => defaultValue);
  return () => reducePredicates(request);
}

export type CurryPredicate<T> = (value: T) => Predicate<T>;
