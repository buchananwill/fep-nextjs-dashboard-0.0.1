'use client';
import { createContext, useContext, useState } from 'react';
import HueSelector, { HueOption } from './hue-selector';
import LightnessSelector, { LightnessOption } from './lightness-selector';
import {
  ColorContext,
  ColorState,
  HUE_OPTIONS,
  LIGHTNESS_OPTIONS
} from './color-context';
import TooltipsContext from '../generic/components/tooltips/tooltips-context';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../generic/components/tooltips/tooltip';
import { StandardTooltipContentOld } from '../generic/components/tooltips/standard-tooltip-content-old';

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

export function useColorState(initialState?: {
  hue: HueOption;
  lightness: LightnessOption;
}) {
  const initialHue = initialState ? initialState.hue : HUE_OPTIONS[0];
  const initialLightness = initialState
    ? initialState.lightness
    : LIGHTNESS_OPTIONS[0];
  const [hue, setHue] = useState(initialHue);
  const [lightness, setLightness] = useState(initialLightness);

  return {
    hue,
    setHue,
    lightness,
    setLightness
  };
}

export default function ColorSelector({
  colorState: { hue, setHue, lightness, setLightness }
}: {
  colorState: ColorState;
}) {
  const { showTooltips } = useContext(TooltipsContext);

  const colorContext = {
    hue: hue,
    setHue: setHue,
    lightness: lightness,
    setLightness: setLightness
  };

  return (
    <>
      <ColorContext.Provider value={colorContext}>
        <div>
          <Tooltip enabled={showTooltips}>
            <TooltipTrigger>
              <LightnessSelector selectionList={LIGHTNESS_OPTIONS} />
            </TooltipTrigger>
            <TooltipContent>
              <StandardTooltipContentOld>
                Select color <strong>lightness</strong>.
              </StandardTooltipContentOld>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <HueSelector selectionList={HUE_OPTIONS} />
            </TooltipTrigger>
            <TooltipContent>
              <StandardTooltipContentOld>
                Select color <strong>hue</strong>.
              </StandardTooltipContentOld>
            </TooltipContent>
          </Tooltip>
        </div>
      </ColorContext.Provider>
    </>
  );
}
