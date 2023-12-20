'use client';
import { createContext, useContext, useState } from 'react';
import HueSelector, { HueOption } from './hue-selector';
import LightnessSelector, { LightnessOption } from './lightness-selector';
import { ColorContext, HUE_OPTIONS, LIGHTNESS_OPTIONS } from './color-context';

const lessonColors = {
  Free: 'gray-200',
  German: 'blue-400',
  French: 'blue-400',
  Computing: 'blue-400',
  'Classical Civ': 'blue-400',
  Latin: 'blue-400',
  Maths: 'fuchsia-400',
  Physics: 'emerald-400',
  Biology: 'emerald-400',
  Chemistry: 'emerald-400',
  English: 'yellow-600',
  Art: 'lime-500',
  'Design And T': 'lime-500',
  Geography: 'orange-400',
  History: 'orange-400',
  Registration: 'gray-300',
  Games: 'teal-400',
  Pe: 'teal-400',
  other: 'red-400'
};

export default function ColorSelector({}: {}) {
  const [selectedHue, setSelectedHue] = useState(HUE_OPTIONS[0]);
  const [selectedLightness, setSelectedLightness] = useState(
    LIGHTNESS_OPTIONS[0]
  );

  const colorContext = {
    hue: selectedHue,
    lightness: selectedLightness
  };

  console.log('Hue: ', selectedHue);
  console.log('Lightness: ', selectedLightness);

  return (
    <>
      <ColorContext.Provider value={colorContext}>
        <LightnessSelector
          selectedState={selectedLightness}
          selectionList={LIGHTNESS_OPTIONS}
          updateSelectedState={setSelectedLightness}
          selectionDescriptor={'L'}
        />
        <HueSelector
          selectedState={selectedHue}
          selectionList={HUE_OPTIONS}
          updateSelectedState={setSelectedHue}
          selectionDescriptor={'H'}
        />
      </ColorContext.Provider>
    </>
  );
}
