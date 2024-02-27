'use client';
import { GraphToggle, GraphToggleProps } from './graph-toggle';
import { Tooltip, TooltipTrigger } from '../../components/tooltips/tooltip';
import { SelectiveContextRangeSlider } from '../../components/selective-context/selective-context-range-slider';
import { StandardTooltipContentOld } from '../../components/tooltips/standard-tooltip-content-old';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { GraphContext } from '../graph/graph-context-creator';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { StandardTooltipContent } from '../../components/tooltips/standard-tooltip-content';

const graphToggles: GraphToggleProps[] = [
  {
    toggleKey: 'arrows-to-parents',
    tooltipContent: 'Show/Hide arrows to parent (dependency)'
  },
  {
    toggleKey: 'arrows-to-children',
    tooltipContent: 'Show/Hide arrows to children (dependent)'
  },
  {
    toggleKey: 'highlight-from-source',
    tooltipContent: 'Highlight edges from selected children (dependent)'
  },
  {
    toggleKey: 'highlight-from-target',
    tooltipContent: 'Highlight edges from selected parent (dependency)'
  },
  {
    toggleKey: 'lock-text-with-select',
    tooltipContent: 'Pin text in view for selected nodes.'
  }
];

export default function GraphViewOptions() {
  const { uniqueGraphName } = useContext(GraphContext);
  const [showSliders, setShowSliders] = useState(false);
  const [hideFromLayout, setHideFromLayout] = useState(false);
  const mutableRefObject = useRef<NodeJS.Timeout>();
  useEffect(() => {
    if (mutableRefObject.current) clearTimeout(mutableRefObject.current);
    if (showSliders) {
      setHideFromLayout(false);
    } else {
      mutableRefObject.current = setTimeout(() => setHideFromLayout(true), 500);
    }
    return () => {
      if (mutableRefObject.current) clearTimeout(mutableRefObject.current);
    };
  }, [showSliders]);
  return (
    <>
      <button
        className={`btn ${showSliders ? 'btn-primary' : ''}`}
        onClick={() => setShowSliders(!showSliders)}
      >
        View Options
        <ChevronDownIcon
          className={`w-6 h-6 ${
            !showSliders ? 'rotate-90 transform' : ''
          } transition-transform duration-500`}
        ></ChevronDownIcon>
      </button>
      <div
        className={`mt-2 h-fit w-fit flex flex-col gap-1 items-center transition-opacity duration-500 ${
          showSliders ? 'opacity-100' : 'opacity-0 -z-10 '
        } ${hideFromLayout ? 'hidden' : ''}`}
      >
        {graphToggles.map((toggleProps, index) => (
          <GraphToggle key={index} {...toggleProps} />
        ))}
        <Tooltip>
          <TooltipTrigger>
            <SelectiveContextRangeSlider
              dispatchKey={`zoom-${uniqueGraphName}`}
              listenerKey={`zoom-${uniqueGraphName}-slider`}
              maxValue={200}
              minValue={30}
              initialValue={60}
            ></SelectiveContextRangeSlider>
          </TooltipTrigger>
          <StandardTooltipContent>Zoom in/out</StandardTooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <SelectiveContextRangeSlider
              dispatchKey={`text-size-${uniqueGraphName}`}
              listenerKey={`text-size-${uniqueGraphName}-slider`}
              maxValue={200}
              minValue={1}
              initialValue={100}
            ></SelectiveContextRangeSlider>
          </TooltipTrigger>
          <StandardTooltipContent>Scale text size.</StandardTooltipContent>
        </Tooltip>
      </div>
    </>
  );
}
