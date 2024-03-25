import { GenericSelectiveContextProps } from './generic-selective-context-manager';
import { UseSelectiveContextParams } from '../use-selective-context-controller';
import { useSelectiveContextListener } from '../use-selective-context-listener';

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
