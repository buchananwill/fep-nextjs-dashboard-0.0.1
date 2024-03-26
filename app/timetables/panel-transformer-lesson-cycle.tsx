'use client';

import { LessonCycle } from '../api/state-types';
import React from 'react';
import { PanelTransformer } from '../generic/components/disclosure-list/disclosure-list-panel';

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
