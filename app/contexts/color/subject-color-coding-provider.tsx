'use client';
import React, { ReactNode, useContext, useState } from 'react';
import {
  ModalColorSelectContext,
  ColorCoding,
  ColorCodingDispatch
} from './subject-color-coding-context';

import { produce } from 'immer';
import { useColorState } from '../../generic/components/color/color-selector';
import {
  ColorState,
  defaultColorState
} from '../../generic/components/color/color-context';
import {
  ColorSelectModal,
  useModal
} from '../../generic/components/color/color-select-modal';

const someSubjects = ['Maths', 'Art', 'Science'];

export default function SubjectColorCodingProvider({
  children
}: {
  children: ReactNode;
}) {
  const context = useContext(ColorCoding);
  const [lessonText, setLessonText] = useState<string>('');

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
    <ColorCoding.Provider value={subjectColorCoding}>
      <ColorCodingDispatch.Provider
        value={{ setColorCoding: setSubjectColorCoding }}
      >
        <ModalColorSelectContext.Provider
          value={{
            setModalText: setLessonText,
            openModal: openModal,
            onCancel: closeModal,
            onClose: closeModal,
            onConfirm: handleColorConfirm,
            stringKey: lessonText,
            ...modalInitialState
          }}
        >
          {children}
          <ColorSelectModal show={isOpen} initialState={modalInitialState}>
            {lessonText}
          </ColorSelectModal>
        </ModalColorSelectContext.Provider>
      </ColorCodingDispatch.Provider>
    </ColorCoding.Provider>
  );
}
