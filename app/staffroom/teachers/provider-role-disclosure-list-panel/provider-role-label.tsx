import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
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
import { useAssetSuitabilityStringMapContext } from '../../../premises/asset-suitability-context-creator';
import { IdStringFromNumberAccessor } from '../../../premises/classroom-suitability/rating-table-accessor-functions';
import { useAssetSuitabilityListController } from '../../../contexts/selective-context/asset-suitability-list-selective-context-provider';
import { useWorkTaskCompetencyListStringMapContext } from '../skills/work-task-competency-context-creator';

export function ProviderRoleLabel({
  data: { partyName, knowledgeDomainName, id },
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

  const { workTaskCompetencyListStringMap } =
    useWorkTaskCompetencyListStringMapContext();
  const workTaskCompetencyStringMapElement =
    workTaskCompetencyListStringMap[id.toString()];
  const stringMapFromContext = useRef(workTaskCompetencyStringMapElement);

  const contextKey = useMemo(() => `${id}`, [id]);
  const { dispatchUpdate } = useWorkTaskCompetencyListController({
    contextKey: contextKey,
    listenerKey: 'provider-role-label',
    initialValue: workTaskCompetencyStringMapElement
  });

  useEffect(() => {
    if (stringMapFromContext.current !== workTaskCompetencyStringMapElement) {
      dispatchUpdate({ contextKey, value: workTaskCompetencyStringMapElement });
      stringMapFromContext.current = workTaskCompetencyStringMapElement;
    }
  }, [
    stringMapFromContext,
    dispatchUpdate,
    workTaskCompetencyStringMapElement,
    contextKey
  ]);

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
