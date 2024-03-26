'use client';
import { useContext, useState } from 'react';
import HueSelector, { HueOption } from './hue-selector';
import LightnessSelector, { LightnessOption } from './lightness-selector';
import {
  ColorContext,
  ColorState,
  HUE_OPTIONS,
  LIGHTNESS_OPTIONS
} from './color-context';
import TooltipsContext from '../tooltips/tooltips-context';
import { Tooltip, TooltipTrigger } from '../tooltips/tooltip';
import { StandardTooltipContent } from '../tooltips/standard-tooltip-content';
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

            <StandardTooltipContent>
              Select color <strong>lightness</strong>.
            </StandardTooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <HueSelector selectionList={HUE_OPTIONS} />
            </TooltipTrigger>

            <StandardTooltipContent>
              Select color <strong>hue</strong>.
            </StandardTooltipContent>
          </Tooltip>
        </div>
      </ColorContext.Provider>
    </>
  );
}
