import {
  GenericFunctionWrapper,
  useSelectiveContextListenerFunction
} from '../../../../selective-context/components/typed/selective-context-manager-function';
import { RatingEditModalTriggerProps } from '../../modals/rating-edit-modal';
import { ObjectPlaceholder } from '../../../../api/main';

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
