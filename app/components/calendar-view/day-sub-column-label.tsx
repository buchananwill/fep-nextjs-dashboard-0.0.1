'use client';
import {
  ColorCoding,
  ModalColorSelectContext
} from '../../contexts/color-coding/context';
import React, { useContext } from 'react';
import { HoverWidth } from '../hover-width/hover-width';
import { BASE_HSL } from '../../contexts/color/color-context';
import {
  Tooltip,
  TooltipTrigger
} from '../../generic/components/tooltips/tooltip';
import { StandardTooltipContent } from '../../generic/components/tooltips/standard-tooltip-content';
import { useCalendarScaledZoom } from './columns/time-column';

export function DaySubColumnLabel({ labelText }: { labelText: string }) {
  const colorCodingState = useContext(ColorCoding);
  const { x } = useCalendarScaledZoom();
  const { setModalText, openModal } = useContext(ModalColorSelectContext);

  const colorCodingStateElement = colorCodingState[labelText];
  const { hue } = colorCodingStateElement;
  const { h, s, l, a } = BASE_HSL[hue.id];

  return (
    <div
      className={`flex relative text-xs text-center items-center justify-center hover:z-30 cursor-pointer `}
      style={{ height: `30px`, width: `${x}px` }}
      onClick={() => {
        setModalText(labelText);
        openModal();
      }}
    >
      <Tooltip>
        <HoverWidth className={'group'} width={x}>
          <TooltipTrigger>
            <div
              className={`max-w-full overflow-hidden outline-2 outline rounded-md hover:z-40  h-full px-2 leading-[30px] align-middle whitespace-nowrap text-ellipsis text-center bg-${hue.id}-200`}
              style={{ outlineColor: `hsl(${h} ${s}% ${l}% / ${a})` }}
            >
              {labelText}
            </div>
          </TooltipTrigger>
        </HoverWidth>

        <StandardTooltipContent>
          Click to choose colour coding.
        </StandardTooltipContent>
      </Tooltip>
    </div>
  );
}
