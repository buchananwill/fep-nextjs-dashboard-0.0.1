'use client';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ProviderContext } from '../contexts/providerRoles/provider-context';
import DisclosureListPanel from '../../components/disclosure-list/disclosure-list-panel';
import {
  FillableButton,
  PinIcons
} from '../../components/buttons/fillable-button';
import { produce } from 'immer';
import { ColorCoding } from '../../contexts/color-coding/context';
import {
  BASE_HSL,
  HSLA,
  HslColorContext,
  HslColorDispatchContext
} from '../../contexts/color/color-context';

import { Tooltip, TooltipTrigger } from '../../components/tooltips/tooltip';
import { StandardTooltipContent } from '../../components/tooltips/standard-tooltip-content';
import { SkillEditContext } from '../contexts/providerRoles/rating-edit-context';
import { ProviderRoleSelectionContext } from '../contexts/providerRoles/provider-role-selection-context';
import { ProviderRoleDto } from '../../api/dtos/ProviderRoleDtoSchema';
import { RatingList } from './rating-list';
import {
  useWorkTaskCompetencyListController,
  useWorkTaskCompetencyListListener
} from '../../components/selective-context/typed/work-task-competency-list-selective-context-provider';
import { EmptySchemasArray } from '../../curriculum/delivery-models/functions/use-schema-detail-memo';
import { WorkTaskCompetencyDto } from '../../api/dtos/WorkTaskCompetencyDtoSchema';
import { useProviderRoleStringMapContext } from '../contexts/providerRoles/provider-role-string-map-context-creator';

const lighten = (hslObject: HSLA): HSLA => {
  const { h, s, l, a } = hslObject;
  const lighterL = 100 - (100 - l) * 0.5;
  const lessSaturated = s * 0.7;
  const lighterHSL = `hsl(${h}, ${s}%, ${lighterL}%, ${a})`;
  return { ...hslObject, l: lighterL, cssHSLA: lighterHSL };
};

function ProviderRoleLabel({
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

function ProviderRoleButtonCluster({ data }: { data: ProviderRoleDto }) {
  const [isPinned, setPinned] = useState(false);

  const { selectedProviders, toggleProviderSelection } = useContext(
    ProviderRoleSelectionContext
  );
  const { current } = useContext(HslColorContext);
  const { id, partyName } = data;

  useEffect(() => {
    const selected = selectedProviders.some(({ id: mechId }) => mechId == id);
    setPinned(selected);
  }, [setPinned, selectedProviders, id]);

  const handlePinClick = () => {
    toggleProviderSelection({ name: data.partyName, id: data.id });
  };

  return (
    <Tooltip placement={'right'}>
      <TooltipTrigger>
        <div
          className="px-1 flex items-center h-full"
          style={{ borderColor: `${current.cssHSLA}` }}
        >
          <FillableButton
            pinIcon={PinIcons.arrowLeftCircle}
            isPinned={isPinned}
            setPinned={handlePinClick}
            id={`teacher:${id}`}
          />
        </div>
      </TooltipTrigger>

      <StandardTooltipContent>
        Click to show teacher in main area.
      </StandardTooltipContent>
    </Tooltip>
  );
}

export const EmptyArray: any[] = [];

function TeacherPanelTransformer(props: { data: ProviderRoleDto }) {
  const { data } = props;
  const { id } = data;
  const { currentState } = useWorkTaskCompetencyListListener({
    contextKey: `${id}`,
    listenerKey: `teacher-label`,
    initialValue: EmptyArray as WorkTaskCompetencyDto[]
  });

  return (
    <RatingList
      data={data}
      context={SkillEditContext}
      ratingList={currentState}
    />
  );
}

export default function TeacherDisclosureList() {
  const { providerRoleDtoStringMap } = useProviderRoleStringMapContext();

  const providers = useMemo(() => {
    return Object.values(providerRoleDtoStringMap).sort((a1, a2) =>
      a1.name.localeCompare(a2.name)
    );
  }, [providerRoleDtoStringMap]);

  return (
    <>
      {providerRoleDtoStringMap && (
        <DisclosureListPanel
          data={providers}
          buttonCluster={ProviderRoleButtonCluster}
          disclosureLabelTransformer={ProviderRoleLabel}
          panelTransformer={TeacherPanelTransformer}
        />
      )}
    </>
  );
}
