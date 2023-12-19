'use client';
import { useState } from 'react';
import StateSelector from '../../../components/state-selector';

const dummyColor = { name: 'ruby', id: 'ruby-500' };

export default function LessonColorSelector({}: {}) {
  const [selected, setSelected] = useState(dummyColor);
  return (
    <StateSelector
      selectedState={selected}
      selectionList={[dummyColor]}
      updateSelectedState={setSelected}
      selectionDescriptor={'Color'}
    />
  );
}
