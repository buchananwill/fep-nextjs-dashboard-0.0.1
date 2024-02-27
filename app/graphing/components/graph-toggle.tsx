'use client';
import React, { useContext } from 'react';
import { GraphContext } from '../graph/graph-context-creator';
import { Tooltip, TooltipTrigger } from '../../components/tooltips/tooltip';
import { SelectiveContextDispatcherBoolean } from '../../components/selective-context/selective-context-dispatcher-boolean';
import { StandardTooltipContentOld } from '../../components/tooltips/standard-tooltip-content-old';
import { StandardTooltipContent } from '../../components/tooltips/standard-tooltip-content';

export interface GraphToggleProps {
  toggleKey: string;
  tooltipContent: string;
}

export function GraphToggle({ toggleKey, tooltipContent }: GraphToggleProps) {
  const { uniqueGraphName } = useContext(GraphContext);

  const selfKey = `${toggleKey}-${uniqueGraphName}`;

  return (
    <Tooltip>
      <TooltipTrigger>
        <SelectiveContextDispatcherBoolean
          uniqueKey={selfKey}
          listenerKey={selfKey}
          initialValue={true}
        ></SelectiveContextDispatcherBoolean>
      </TooltipTrigger>
      <StandardTooltipContent>{tooltipContent}</StandardTooltipContent>
    </Tooltip>
  );
}
