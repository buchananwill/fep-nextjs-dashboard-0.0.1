'use client';

import {
  Fragment,
  PropsWithChildren,
  useContext,
  useEffect,
  useState
} from 'react';
import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';
import { DataLink, DataNode, GraphDto } from '../../api/zod-mods';

import { GenericNodeContext } from '../nodes/generic-node-context-creator';
import { GenericLinkContext } from '../links/generic-link-context-creator';
import { ForceGraphAttributesDto } from '../../api/dtos/ForceGraphAttributesDtoSchema';
import { SelectiveContextRangeSlider } from '../../components/selective-context/selective-context-range-slider';
import { useSelectiveContextDispatchBoolean } from '../../components/selective-context/selective-context-manager-boolean';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { transform } from 'sucrase';
import { GraphContext } from '../graph/graph-context-creator';

const forceAttributesInitial: ForceGraphAttributesDto = {
  id: 1,
  forceXStrength: 100,
  forceYStrength: 100,
  linkStrength: 80, // 80
  linkDistance: 100, // 100
  centerStrength: 50, // 50
  collideStrength: 3, // 3
  manyBodyStrength: 50, // 0
  manyBodyMinDistance: 10, // 5
  manyBodyMaxDistance: 400, // 400
  manyBodyTheta: 100, // 9
  forceRadialStrength: 1, // Must not be 0
  forceRadialXRelative: 100, // 100
  forceRadialYRelative: 100 // 100
};
const forceAttributesMin: ForceGraphAttributesDto = {
  id: 1,
  forceXStrength: 0,
  forceYStrength: 0,
  linkStrength: 0,
  linkDistance: 1,
  centerStrength: 0,
  collideStrength: 0,
  manyBodyStrength: 0,
  manyBodyMinDistance: 1,
  manyBodyMaxDistance: 0,
  manyBodyTheta: 0.1,
  forceRadialStrength: 0,
  forceRadialXRelative: 1,
  forceRadialYRelative: 1
};
const forceAttributesMax: ForceGraphAttributesDto = {
  id: 1,
  forceXStrength: 100,
  forceYStrength: 100,
  linkStrength: 150,
  linkDistance: 300,
  centerStrength: 100,
  collideStrength: 100,
  manyBodyStrength: 100,
  manyBodyMinDistance: 1000,
  manyBodyMaxDistance: 1000,
  manyBodyTheta: 100,
  forceRadialStrength: 200,
  forceRadialXRelative: 100,
  forceRadialYRelative: 100
};

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
