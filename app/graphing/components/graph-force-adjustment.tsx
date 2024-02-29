'use client';

import { PropsWithChildren, useContext, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';
import { DataLink, DataNode } from '../../api/zod-mods';
import { ForceGraphAttributesDto } from '../../api/dtos/ForceGraphAttributesDtoSchema';
import { SelectiveContextRangeSlider } from '../../components/selective-context/selective-context-range-slider';
import { useSelectiveContextDispatchBoolean } from '../../components/selective-context/selective-context-manager-boolean';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { GraphContext } from '../graph/graph-context-creator';
import {
  forceAttributesInitial,
  forceAttributesMax,
  forceAttributesMin
} from './force-attributes-meta-data';

export default function GraphForceAdjustment({ children }: PropsWithChildren) {
  const { uniqueGraphName } = useContext(GraphContext);
  const readyToGraph = `${uniqueGraphName}-ready`;
  const showAdjustments = `${uniqueGraphName}-show-adjustments`;
  const { currentState, dispatchUpdate } = useSelectiveContextDispatchBoolean(
    readyToGraph,
    readyToGraph,
    false
  );
  const [showSliders, setShowSliders] = useState(false);

  useEffect(() => {
    if (!currentState) {
      dispatchUpdate({ contextKey: readyToGraph, value: true });
    }
  }, [dispatchUpdate, currentState, readyToGraph]);

  const sliders = Object.entries(forceAttributesInitial).map((entry) => {
    if (entry[0] === 'id') {
      return null;
    }
    const stringKey = `${uniqueGraphName}-${entry[0]}`;
    const entryKey = entry[0] as keyof ForceGraphAttributesDto;
    const initial = forceAttributesInitial[entryKey];
    const min = forceAttributesMin[entryKey];
    const max = forceAttributesMax[entryKey];

    return (
      <li key={stringKey}>
        <div className={'flex items-center w-full justify-between'}>
          <label htmlFor={stringKey}>{entry[0]}</label>
          <SelectiveContextRangeSlider
            dispatchKey={stringKey}
            listenerKey={stringKey}
            minValue={min}
            maxValue={max}
            initialValue={initial}
          />
        </div>
      </li>
    );
  });

  return (
    <div className={'flex flex-col w-96 mt-2 '}>
      <button
        className={`btn ${showSliders ? 'btn-primary' : ''}`}
        onClick={() => setShowSliders(!showSliders)}
      >
        Adjust Forces
        <ChevronDownIcon
          className={`w-6 h-6 ${
            !showSliders ? 'rotate-90 transform' : ''
          } transition-transform duration-500`}
        ></ChevronDownIcon>
      </button>
      {children}

      <div
        className={`mt-2 border-2 rounded-lg border-slate-300 ${
          showSliders
            ? 'h-60 mb-2 overflow-auto border-opacity-100'
            : 'h-0 overflow-auto border-opacity-0'
        }`}
        style={{
          transition: '0.3s ease-in',
          transitionProperty: 'height, opacity '
        }}
      >
        <ul className={' p-2 '}>{...sliders}</ul>
      </div>
    </div>
  );
}

export interface GridForceProps {
  width: number;
  spacing: number;
  strength: number;
}

export interface ForceSimSettings<T> {
  radialStrength?: number;
  centreStrength?: number;
  width?: number;
  height?: number;
  viewportXRatio?: number;
  viewportYRatio?: number;
  forceX?: d3.ForceX<DataNode<T>>;
  forceY?: d3.ForceY<DataNode<T>>;
  forceManyBody?: d3.ForceManyBody<DataNode<T>>;
  forceLink?: d3.ForceLink<SimulationNodeDatum, DataLink<T>>;
  forceCollide?: d3.ForceCollide<DataNode<T>>;
  forceCenter?: d3.ForceCenter<SimulationNodeDatum>;
}
