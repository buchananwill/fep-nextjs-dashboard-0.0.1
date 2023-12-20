'use client';
import React, { ReactNode, useContext, useState } from 'react';
import {
  ModalColorSelectContext,
  SubjectColorCoding,
  SubjectColorCodingDispatch
} from './context';
import { useColorState } from '../components/color-selector';
import {
  ColorState,
  defaultColorState,
  HUE_OPTIONS,
  LIGHTNESS_OPTIONS
} from '../components/color-context';
import { ColorSelectModal, useModal } from '../components/color-select-modal';
import { produce } from 'immer';

const someSubjects = ['Maths', 'Art', 'Science'];

export default function SubjectColorCodingProvider({
  children
}: {
  children: ReactNode;
}) {
  const context = useContext(SubjectColorCoding);
  const [lessonText, setLessonText] = useState<string>('');

  someSubjects.forEach(
    (subject) =>
      (context[subject] = {
        hue: HUE_OPTIONS[1],
        lightness: LIGHTNESS_OPTIONS[1]
      })
  );
  const [subjectColorCoding, setSubjectColorCoding] = useState(context);

  const modalInitialState = { ...useColorState(defaultColorState) };

  const { isOpen, closeModal, openModal } = useModal();

  const handleColorConfirm = (updatedColorStateValue: ColorState) => {
    setSubjectColorCoding(() => {
      return produce(subjectColorCoding, (draft) => {
        draft[lessonText] = {
          hue: updatedColorStateValue.hue,
          lightness: updatedColorStateValue.lightness
        };
      });
    });
  };

  return (
    <SubjectColorCoding.Provider value={subjectColorCoding}>
      <SubjectColorCodingDispatch.Provider
        value={{ setSubjectColorCoding: setSubjectColorCoding }}
      >
        <ModalColorSelectContext.Provider
          value={{
            setLessonText: setLessonText,
            openModal: openModal,
            ...modalInitialState
          }}
        >
          {children}
          <ColorSelectModal
            show={isOpen}
            initialState={modalInitialState}
            onClose={closeModal}
            onConfirm={handleColorConfirm}
            onCancel={() => closeModal()}
          />
        </ModalColorSelectContext.Provider>
      </SubjectColorCodingDispatch.Provider>
    </SubjectColorCoding.Provider>
  );
}
