import { useSelectiveContextListenerNumber } from '../generic/components/selective-context/selective-context-manager-number';

export function useSvgZoom(uniqueElementKey: string, rootSvgKey: string) {
  const { currentState: zoomScale } = useSelectiveContextListenerNumber(
    `zoom-${rootSvgKey}`,
    `${uniqueElementKey}-drag-scale`,
    1
  );
  return zoomScale;
}
