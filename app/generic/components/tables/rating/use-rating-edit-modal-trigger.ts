import {
  GenericFunctionWrapper,
  ObjectPlaceholder,
  useSelectiveContextListenerFunction
} from '../../selective-context/selective-context-manager-function';
import { RatingEditModalTriggerProps } from '../../modals/rating-edit-modal';

export function useRatingEditModalTrigger<E, R>({
  listenerKey
}: {
  listenerKey: string;
}) {
  const {
    currentFunction: { cachedFunction }
  } = useSelectiveContextListenerFunction<
    RatingEditModalTriggerProps<R, E>,
    void
  >(
    'prepare-rating-modal',
    listenerKey,
    ObjectPlaceholder as GenericFunctionWrapper<any, any>
  );
  return cachedFunction;
}
