import { checkAssignment } from './checkElectiveAssignments';
import React, { useContext } from 'react';
import { PanelTransformer } from '../components/disclosure-list/disclosure-list-panel';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { OptionBlockChooser } from './option-block-chooser';
import { ToggleElectivePreferenceActive } from './toggle-elective-preference-active';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../components/tooltips/tooltip';
import TooltipsContext from '../components/tooltips/tooltips-context';
import { StandardTooltipContentOld } from '../components/tooltips/standard-tooltip-content-old';
import { StudentDTO } from '../api/dtos/StudentDTOSchema';

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
            <span>{electivePreference.courseName} </span>
            <span className="grow"></span>
            <Tooltip enabled={showTooltips}>
              <TooltipTrigger className="p-0 m-0 border-0 outline-0 h-full">
                <div className="indicator">
                  <OptionBlockChooser electivePreference={electivePreference} />
                  {getAssignmentIndicator(
                    checkAssignment(
                      electiveDtoMap,
                      electivePreferenceList,
                      electivePreference.preferencePosition
                    )
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <StandardTooltipContentOld>
                  Select in which <strong>option block</strong> this{' '}
                  <strong>student</strong> will attend this{' '}
                  <strong>course</strong>.
                </StandardTooltipContentOld>
              </TooltipContent>
            </Tooltip>
            <Tooltip enabled={showTooltips}>
              <TooltipTrigger className="border-0 outline-0 items-center text-xs leading-none">
                <ToggleElectivePreferenceActive
                  electivePreferenceDTOS={electivePreferenceList}
                  electivePreference={electivePreference}
                />
              </TooltipTrigger>
              <TooltipContent>
                <StandardTooltipContentOld>
                  Toggle whether this <strong>elective enrollment</strong> is
                  active.
                </StandardTooltipContentOld>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      })}
    </>
  );
};

function getAssignmentIndicator(assignmentCheck: boolean) {
  const indicator = 'rose-400';

  return assignmentCheck ? (
    <></>
  ) : (
    <span className={`indicator-item badge bg-${indicator} text-xs`}>!</span>
  );
}
