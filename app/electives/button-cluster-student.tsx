import { ButtonClusterTransformer } from '../components/list-disclosure-panel';
import { StudentDTO } from '../api/dto-interfaces';
import React, { useContext } from 'react';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { FillableButton, PinIcons } from '../components/fillable-button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../components/tooltips/tooltip';
import TooltipsContext from '../components/tooltips/tooltips-context';
import { StandardTooltipContentOld } from '../components/tooltips/standard-tooltip-content-old';

export const ButtonClusterStudent: ButtonClusterTransformer<StudentDTO> = ({
  data: { id },
  className,
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
    <div className="flex align-baseline">
      <Tooltip enabled={showTooltips}>
        <TooltipTrigger>
          <FillableButton
            pinIcon={PinIcons.arrowLeftCircle}
            className="z-20 py-1"
            isPinned={id == userRoleId}
            setPinned={() => handleRadioClick(id)}
          ></FillableButton>
        </TooltipTrigger>
        <TooltipContent>
          <StandardTooltipContentOld>
            Click the <strong>arrow</strong> to show options enrolled by this
            student.
          </StandardTooltipContentOld>
        </TooltipContent>
      </Tooltip>

      {children}

      <Tooltip enabled={showTooltips}>
        <TooltipTrigger>
          <FillableButton
            pinIcon={PinIcons.mapPin}
            className="z-20 py-1"
            isPinned={pinnedStudents.has(id)}
            setPinned={() => handlePinnedStudent(id)}
          ></FillableButton>
        </TooltipTrigger>
        <TooltipContent>
          <StandardTooltipContentOld>
            Click the <strong>pin</strong> to keep this student in the filtered
            list.
          </StandardTooltipContentOld>
        </TooltipContent>
      </Tooltip>

      <Tooltip enabled={showTooltips}>
        <TooltipTrigger>
          <FillableButton
            pinIcon={PinIcons.mortarBoard}
            className={`mr-1 py-1`}
            isPinned={false}
            setPinned={() => handleMortarBoardClick(id)}
          ></FillableButton>
        </TooltipTrigger>
        <TooltipContent>
          <StandardTooltipContentOld>
            Click the <strong>mortar board</strong> to show all the options
            delivering the student{"'"}s active elective preferences.
          </StandardTooltipContentOld>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
