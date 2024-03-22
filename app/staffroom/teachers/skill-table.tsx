'use client';
import { useContext, useEffect, useState } from 'react';
import { ProviderContext } from '../contexts/providerRoles/provider-context';

import { HUE_OPTIONS } from '../../contexts/color/color-context';
import { PageTitleContext } from '../../contexts/page-title/page-title-context';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../../components/tooltips/tooltip';
import TooltipsContext from '../../components/tooltips/tooltips-context';
import { StandardTooltipContent } from '../../components/tooltips/standard-tooltip-content';
import { SkillEditContext } from '../contexts/providerRoles/skill-edit-context';
import { ProviderRoleSelectionContext } from '../contexts/providerRoles/provider-role-selection-context';

export default function SkillTable() {
  const { providers, workTaskTypes } = useContext(ProviderContext);
  const { selectedProviders } = useContext(ProviderRoleSelectionContext);
  const { setTitle } = useContext(PageTitleContext);
  useEffect(() => {
    setTitle('Skill Matrix');
  }, [setTitle]);
  const { triggerModal } = useContext(SkillEditContext);
  const firstMechanic = providers[0];

  if (!firstMechanic) {
    return (
      <div className={'w-full h-fit bg-gray-400 text-black rounded-lg p-2'}>
        No mechanics
      </div>
    );
  }

  const filterMechanics = providers.filter((mechanic) =>
    selectedProviders.some((id) => mechanic.id == id.id)
  );
  return (
    <div className="m-2 p-2 border-2 rounded-lg">
      <table className="table-fixed ">
        <thead className="text-sm ">
          <tr className="h-32 overflow-visible">
            <th className="px-2 w-40 h-[160px]">
              <div
                className={
                  'h-full min-h-max max-h-full flex flex-col items-stretch justify-between'
                }
              >
                <div className={'text-right'}>Skill</div>
                <div
                  className={
                    'grow divide-y-2 flex flex-col justify-center rotate-45'
                  }
                >
                  <div></div>
                  <div></div>
                </div>
                <div className={'text-left'}>Name</div>
              </div>
            </th>
            {workTaskTypes.map((skill) => (
              <th
                className={`overflow-visible align-bottom relative`}
                key={skill.id}
              >
                <div
                  className={`group/skill overflow-visible align-bottom`}
                  style={{ width: '24px', height: '200px' }}
                >
                  <div
                    className={`text-xs absolute origin-left left-3 -bottom-2 group-hover/skill:-translate-y-3 group-hover/skill:z-10 group-hover/skill:-translate-x-3  -rotate-90 group-hover/skill:rotate-0 transition-transform duration-200 align-bottom bg-gray-100 rounded-lg w-48 py-1 font-medium opacity-50 group-hover/skill:opacity-100 truncate ...`}
                  >
                    {skill.name}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filterMechanics.map((mechanicDto) => (
            <tr key={mechanicDto.id} className="">
              <td className="text-sm px-2">{mechanicDto.partyName}</td>
              {mechanicDto.workTaskCompetencyDtoList.map((skill) => (
                <td
                  className={`border bg-${
                    HUE_OPTIONS[skill.competencyRating].id
                  }-400 cursor-pointer`}
                  key={skill.id}
                  onClick={() => {
                    triggerModal(skill, mechanicDto);
                  }}
                >
                  <Tooltip placement={'bottom'}>
                    <TooltipTrigger>
                      <div className={'px-2'}>{skill.competencyRating}</div>
                    </TooltipTrigger>

                    <StandardTooltipContent>
                      <strong>{skill.workTaskType}</strong>: click to edit.
                    </StandardTooltipContent>
                  </Tooltip>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
