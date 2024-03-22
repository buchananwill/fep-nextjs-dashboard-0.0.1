'use client';
import {
  ColorCoding,
  ColorCodingState,
  ModalColorSelectContext
} from '../../contexts/color-coding/context';
import React, { Fragment, useContext, useState } from 'react';
import { ZoomScaleContext } from './scale/zoom-scale-context';
import { Transition } from '@headlessui/react';
import { HoverWidth } from '../../components/hover-width/hover-width';
import { BASE_HSL } from '../../contexts/color/color-context';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../../components/tooltips/tooltip';
import { StandardTooltipContent } from '../../components/tooltips/standard-tooltip-content';

export function DaySubColumnLabel({ labelText }: { labelText: string }) {
  const colorCodingState = useContext(ColorCoding);
  const { x } = useContext(ZoomScaleContext);
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
