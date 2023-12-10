import { StudentDTO } from '../api/dto-interfaces';
import { checkAssignment } from './checkElectiveAssignments';
import React, { useContext } from 'react';
import { PanelTransformer } from '../components/list-disclosure-panel';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { OptionBlockChooser } from './option-block-chooser';
import { ToggleElectivePreferenceActive } from './toggle-elective-preference-active';

export const StudentPanelTransformer: PanelTransformer<StudentDTO> = ({
  data: { id, name }
}) => {
  const { electivePreferences, electiveDtoMap } = useContext(ElectiveContext);
  useContext(ElectiveDispatchContext);
  const electivePreferenceList = electivePreferences.get(id);

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
            className="flex grow-0 w-full justify-between"
          >
            <span>{electivePreference.courseName} </span>
            <span className="grow"></span>
            <div className="indicator">
              {getAssignmentIndicator(
                checkAssignment(
                  electiveDtoMap,
                  electivePreferenceList,
                  electivePreference.preferencePosition
                )
              )}
              <OptionBlockChooser electivePreference={electivePreference} />
            </div>
            <ToggleElectivePreferenceActive
              electivePreferenceDTOS={electivePreferenceList}
              electivePreference={electivePreference}
            />
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
