import { ButtonSurroundTransformer } from '../components/list-disclosure-panel';
import { StudentDTO } from '../api/dto-interfaces';
import React, { useContext } from 'react';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { FillableButton, PinIcons } from '../components/fillable-button';

export const ButtonSurroundStudent: ButtonSurroundTransformer<StudentDTO> = ({
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
    <>
      <FillableButton
        pinIcon={PinIcons.arrowLeftCircle}
        className="z-20"
        isPinned={id == userRoleId}
        setPinned={() => handleRadioClick(id)}
      ></FillableButton>

      {children}

      <FillableButton
        pinIcon={PinIcons.mapPin}
        className="z-20"
        isPinned={pinnedStudents.has(id)}
        setPinned={() => handlePinnedStudent(id)}
      ></FillableButton>
      <FillableButton
        pinIcon={PinIcons.mortarBoard}
        className={`mr-1`}
        isPinned={false}
        setPinned={() => handleMortarBoardClick(id)}
      ></FillableButton>
    </>
  );
};
