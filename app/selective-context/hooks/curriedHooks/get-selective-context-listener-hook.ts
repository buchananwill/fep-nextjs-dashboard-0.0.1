import { GenericSelectiveContextProps } from '../../components/base/generic-selective-context-manager';
import { UseSelectiveContextParams } from '../generic/use-selective-context-controller';
import { useSelectiveContextListener } from '../generic/use-selective-context-listener';

export default function getSelectiveContextListenerHook<T>({
  latestValueRefContext,
  listenerRefContext
}: GenericSelectiveContextProps<T>) {
  return ({
    contextKey,
    listenerKey,
    initialValue
  }: UseSelectiveContextParams<T>) => {
    const { currentState } = useSelectiveContextListener(
      contextKey,
      listenerKey,
      initialValue,
      listenerRefContext,
      latestValueRefContext
    );

    return { currentState };
  };
}
