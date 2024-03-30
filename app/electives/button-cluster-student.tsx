import React, { useContext } from 'react';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../generic/components/tooltips/tooltip';
import TooltipsContext from '../generic/components/tooltips/tooltips-context';
import { StandardTooltipContentOld } from '../generic/components/tooltips/standard-tooltip-content-old';
import { StudentDTO } from '../api/dtos/StudentDTOSchema';
import { ButtonClusterTransformer } from '../generic/components/disclosure-list/disclosure-list-panel';
import {
  FillableButton,
  PinIcons
} from '../generic/components/buttons/fillable-button';
import { StandardTooltipContent } from '../generic/components/tooltips/standard-tooltip-content';

export const ButtonClusterStudent: ButtonClusterTransformer<StudentDTO> = ({
  data: { id },
  children
}) => {
  const {
    userRoleId,
    pinnedStudents,
    highlightedCourses,
    electivePreferences
  } = useContext(ElectiveContext);
  const dispatch = useContext(ElectiveDispatchContext);

  const { showTooltips } = useContext(TooltipsContext);

  function handleRadioClick(clickedId: number) {
    dispatch({
      type: 'focusStudent',
      studentId: clickedId
    });
  }

  function handlePinnedStudent(id: number) {
    dispatch({
      type: 'setPinnedStudent',
      id: id
    });
  }

  function handleMortarBoardClick(id: number) {
    highlightedCourses.forEach((course) =>
      dispatch({
        type: 'setHighlightedCourses',
        id: course
      })
    );
    const activePreferencesThisStudent = electivePreferences
      .get(id)
      ?.filter((preference) => preference.active);

    activePreferencesThisStudent?.forEach((preference) =>
      dispatch({
        type: 'setHighlightedCourses',
        id: preference.courseId
      })
    );
  }

  return (
    <div className="flex items-center h-fit">
      <Tooltip enabled={showTooltips}>
        <TooltipTrigger>
          <FillableButton
            pinIcon={PinIcons.arrowLeftCircle}
            isPinned={id == userRoleId}
            setPinned={() => handleRadioClick(id)}
            id={`student:selected:${id}`}
          ></FillableButton>
        </TooltipTrigger>
        <StandardTooltipContent>
          Click the <strong>arrow</strong> to show options enrolled by this
          student.
        </StandardTooltipContent>
      </Tooltip>

      {children}

      <Tooltip enabled={showTooltips}>
        <TooltipTrigger>
          <FillableButton
            pinIcon={PinIcons.mapPin}
            isPinned={pinnedStudents.has(id)}
            setPinned={() => handlePinnedStudent(id)}
            id={`student:pinned:${id}`}
          ></FillableButton>
        </TooltipTrigger>
        <StandardTooltipContent>
          Click the <strong>pin</strong> to keep this student in the filtered
          list.
        </StandardTooltipContent>
      </Tooltip>

      <Tooltip enabled={showTooltips}>
        <TooltipTrigger>
          <FillableButton
            className={'h-fit'}
            pinIcon={PinIcons.mortarBoard}
            isPinned={false}
            setPinned={() => handleMortarBoardClick(id)}
            id={`student:highlight-courses:${id}`}
          ></FillableButton>
        </TooltipTrigger>
        <StandardTooltipContent>
          Click the <strong>mortar board</strong> to show all the options
          delivering the student{"'"}s active elective preferences.
        </StandardTooltipContent>
      </Tooltip>
    </div>
  );
};
