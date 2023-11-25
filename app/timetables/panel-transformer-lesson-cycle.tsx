'use client';
import { PanelTransformer } from '../components/filtered-disclosure-panel';
import { LessonCycle } from '../api/state-types';
import React from 'react';

export const PanelTransformerConcrete: PanelTransformer<LessonCycle> = ({
  data
}) => {
  return (
    <>
      <p>Lesson Cycle ID: {data.id}</p>
      <p>Teachers Role ID: {data.assignedTeacherIds}</p>
    </>
  );
};
