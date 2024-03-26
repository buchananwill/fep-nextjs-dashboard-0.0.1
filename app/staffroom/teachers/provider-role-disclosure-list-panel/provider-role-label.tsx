import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';
import React, { useContext, useEffect } from 'react';
import { ColorCoding } from '../../../generic/components/color/color-coding-context';
import {
  BASE_HSL,
  HslColorContext,
  HslColorDispatchContext
} from '../../../generic/components/color/color-context';
import { useWorkTaskCompetencyListController } from '../../../contexts/selective-context/work-task-competency-list-selective-context-provider';
import { lighten } from '../../../generic/components/color/lighten';
import { produce } from 'immer';
import {
  Tooltip,
  TooltipTrigger
} from '../../../generic/components/tooltips/tooltip';
import { StandardTooltipContent } from '../../../generic/components/tooltips/standard-tooltip-content';

export function ProviderRoleLabel({
  data: { partyName, knowledgeDomainName, id, workTaskCompetencyDtoList },
  children
}: {
  data: ProviderRoleDto;
  children?: React.ReactNode;
  className?: string;
}) {
  const colorCodingState = useContext(ColorCoding);
  const colorCodingStateElement = colorCodingState[partyName];
  const { setHslaColorState } = useContext(HslColorDispatchContext);
  const hslaColorState = useContext(HslColorContext);

  useWorkTaskCompetencyListController({
    contextKey: `${id}`,
    listenerKey: `teacher-label`,
    initialValue: workTaskCompetencyDtoList
  });

  useEffect(() => {
    const hueId = colorCodingStateElement?.hue.id || 'gray';
    const darker = BASE_HSL[hueId];
    const base = lighten(darker);
    const lighter = lighten(base);
    setHslaColorState({
      darker: darker,
      base: base,
      current: base,
      lighter: lighter
    });
  }, [setHslaColorState, colorCodingStateElement]);

  const setCurrentToLighter = () => {
    const colorState = produce(hslaColorState, (draft) => {
      draft.current = draft.lighter;
    });
    setHslaColorState(colorState);
  };
  const setCurrentToBase = () => {
    const colorState = produce(hslaColorState, (draft) => {
      draft.current = draft.base;
    });
    setHslaColorState(colorState);
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className="font-medium p-2 flex items-center min-w-fit whitespace-nowrap"
          onMouseOver={() => setCurrentToLighter()}
          onMouseOut={() => setCurrentToBase()}
          style={{ backgroundColor: `${hslaColorState.current.cssHSLA}` }}
        >
          {children}
          {partyName}: {knowledgeDomainName}
        </div>
      </TooltipTrigger>

      <StandardTooltipContent>
        Show teacher skill details.
      </StandardTooltipContent>
    </Tooltip>
  );
}
