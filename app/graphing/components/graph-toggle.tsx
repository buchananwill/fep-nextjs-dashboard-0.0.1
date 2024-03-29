'use client';
import React, { useContext } from 'react';
import { GraphContext } from '../graph/graph-context-creator';
import {
  Tooltip,
  TooltipTrigger
} from '../../generic/components/tooltips/tooltip';
import { SelectiveContextDispatcherBoolean } from '../../selective-context/components/typed/selective-context-dispatcher-boolean';
import { StandardTooltipContent } from '../../generic/components/tooltips/standard-tooltip-content';

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
