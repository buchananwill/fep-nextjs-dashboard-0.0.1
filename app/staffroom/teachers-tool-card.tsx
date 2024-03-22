'use client';

import TeacherDisclosureList from './teachers/teacher-disclosure-list';
import React, { useContext } from 'react';
import ToolCard from '../components/tool-card/tool-card';

export function TeachersToolCard() {
  return (
    <ToolCard height={600}>
      <ToolCard.UpperSixth>
        <div
          className={
            'w-full  h-full px-2 cursor-default select-none flex items-center justify-center overflow-hidden'
          }
        >
          Mechanics
        </div>
      </ToolCard.UpperSixth>

      <ToolCard.LowerFiveSixths>
        <TeacherDisclosureList />
      </ToolCard.LowerFiveSixths>
    </ToolCard>
  );
}
