import { checkAssignment } from './checkElectiveAssignments';
import React, { useContext } from 'react';

import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { OptionBlockChooser } from './option-block-chooser';
import { ToggleElectivePreferenceActive } from './toggle-elective-preference-active';
import {
  Tooltip,
  TooltipTrigger
} from '../generic/components/tooltips/tooltip';
import TooltipsContext from '../generic/components/tooltips/tooltips-context';
import { StudentDTO } from '../api/dtos/StudentDTOSchema';
import { PanelTransformer } from '../generic/components/disclosure-list/disclosure-list-panel';
import { Badge } from '@nextui-org/badge';
import { StandardTooltipContent } from '../generic/components/tooltips/standard-tooltip-content';

export const StudentPanelTransformer: PanelTransformer<StudentDTO> = ({
  data: { id, name }
}) => {
  const { electivePreferences, electiveDtoMap } = useContext(ElectiveContext);
  useContext(ElectiveDispatchContext);
  const electivePreferenceList = electivePreferences.get(id);

  const { showTooltips } = useContext(TooltipsContext);

  if (!electivePreferenceList)
    return (
      <>
        No preference list found for <p>Name : {name}</p>
        <p>ID: {id}</p>{' '}
      </>
    );

  return (
    <>
      {electivePreferenceList.map((electivePreference) => {
        return (
          <div
            key={`${id}-${electivePreference.preferencePosition}`}
            className="flex grow-0 w-full justify-between p-0 m-0 align-middle items-center"
          >
            <span className={'text-xs truncate ...'}>
              {electivePreference.courseName}{' '}
            </span>
            <span className="grow"></span>
            <Tooltip enabled={showTooltips}>
              <TooltipTrigger className="p-0 m-0 border-0 outline-0 h-full">
                <Badge
                  isInvisible={checkAssignment(
                    electiveDtoMap,
                    electivePreferenceList,
                    electivePreference.preferencePosition
                  )}
                  content={'!'}
                  color={'danger'}
                >
                  <OptionBlockChooser electivePreference={electivePreference} />
                </Badge>
              </TooltipTrigger>
              <StandardTooltipContent>
                Select in which <strong>option block</strong> this{' '}
                <strong>student</strong> will attend this{' '}
                <strong>course</strong>.
              </StandardTooltipContent>
            </Tooltip>
            <Tooltip enabled={showTooltips}>
              <TooltipTrigger className="border-0 outline-0 items-center text-xs leading-none">
                <ToggleElectivePreferenceActive
                  electivePreferenceDTOS={electivePreferenceList}
                  electivePreference={electivePreference}
                />
              </TooltipTrigger>
              <StandardTooltipContent>
                Toggle whether this <strong>elective enrollment</strong> is
                active.
              </StandardTooltipContent>
            </Tooltip>
          </div>
        );
      })}
    </>
  );
};
