import { PropsWithChildren, ReactNode, useContext } from 'react';
import TooltipsContext from '../../tooltips/tooltips-context';
import { Tooltip, TooltipTrigger } from '../../tooltips/tooltip';
import { StandardTooltipContent } from '../../tooltips/standard-tooltip-content';

export function TooltipWrapper({
  children,
  tooltipContent
}: { tooltipContent: ReactNode } & PropsWithChildren) {
  const { showTooltips } = useContext(TooltipsContext);
  if (!showTooltips) {
    return children;
  }
  return (
    <Tooltip placement={'bottom'}>
      <TooltipTrigger>{children}</TooltipTrigger>

      <StandardTooltipContent>{tooltipContent}</StandardTooltipContent>
    </Tooltip>
  );
}
