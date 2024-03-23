'use client';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { ProviderContext } from '../contexts/providerRoles/provider-context';
import ListDisclosurePanel from '../../components/list-disclosure-panel';
import { FillableButton, PinIcons } from '../../components/fillable-button';
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
import { SkillEditContext } from '../contexts/providerRoles/skill-edit-context';
import { ProviderRoleSelectionContext } from '../contexts/providerRoles/provider-role-selection-context';
import { ProviderRoleDto } from '../../api/dtos/ProviderRoleDtoSchema';

const competencyColors: { [key: string]: string } = {
  '0': 'gray-200',
  '1': 'red-300',
  '2': 'amber-300',
  '3': 'amber-400',
  '4': 'green-300',
  '5': 'green-500'
};
const lighten = (hslObject: HSLA): HSLA => {
  const { h, s, l, a } = hslObject;
  const lighterL = 100 - (100 - l) * 0.5;
  const lessSaturated = s * 0.7;
  const lighterHSL = `hsl(${h}, ${s}%, ${lighterL}%, ${a})`;
  return { ...hslObject, l: lighterL, cssHSLA: lighterHSL };
};

function ProviderRoleLabel({
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

  useEffect(() => {
    const hueId = colorCodingStateElement?.hue.id || 'gray';
    const darker = BASE_HSL[hueId];
    const base = lighten(darker);
    const lighter = lighten(base);
    const current = base;

    setHslaColorState({
      darker: darker,
      base: base,
      current: current,
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
          />
        </div>
      </TooltipTrigger>

      <StandardTooltipContent>
        Click to show mechanic in main area.
      </StandardTooltipContent>
    </Tooltip>
  );
}

function TeacherPanelTransformer(props: { data: ProviderRoleDto }) {
  const { data } = props;
  const { workTaskCompetencyDtoList, id, partyName } = data;
  const { triggerModal } = useContext(SkillEditContext);

  function getCompetencyColor(competencyRating: number) {
    return competencyColors[competencyRating.toString()];
  }

  return (
    <ul className={'divide-y'}>
      {workTaskCompetencyDtoList.map((wtComp, index) => (
        <li
          key={`${id}-${wtComp.id}`}
          className={`text-${getCompetencyColor(
            wtComp.competencyRating
          )} pb-1 hover:bg-gray-100 cursor-pointer`}
          onClick={() => triggerModal(wtComp, data)}
        >
          {wtComp.workTaskType} : {wtComp.competencyRating}
        </li>
      ))}
    </ul>
  );
}

export default function TeacherDisclosureList() {
  const { providers, workTaskTypes } = useContext(ProviderContext);

  return (
    <>
      {providers && (
        <ListDisclosurePanel
          data={providers}
          buttonCluster={ProviderRoleButtonCluster}
          disclosureLabelTransformer={ProviderRoleLabel}
          panelTransformer={TeacherPanelTransformer}
        />
      )}
    </>
  );
}
