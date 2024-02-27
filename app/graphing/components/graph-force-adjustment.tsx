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

const forceAttributes: ForceGraphAttributesDto = {
  id: 1,
  forceXStrength: 1,
  forceYStrength: 1,
  linkStrength: 0,
  linkDistance: 100,
  centerStrength: 1,
  collideStrength: 0.3,
  manyBodyStrength: 0,
  manyBodyMinDistance: 0,
  manyBodyMaxDistance: 400,
  manyBodyTheta: 0.9,
  forceRadialStrength: 0,
  forceRadialXRelative: 1,
  forceRadialYRelative: 1
};

export default function GraphForceAdjustment({ children }: PropsWithChildren) {
  const { uniqueGraphName } = useContext(GraphContext);
  const readyToGraph = `${uniqueGraphName}-ready`;
  const showAdjustments = `${uniqueGraphName}-show-adjustments`;
  const { isTrue, dispatchUpdate } = useSelectiveContextDispatchBoolean(
    readyToGraph,
    false,
    readyToGraph
  );
  const [showSliders, setShowSliders] = useState(false);

  useEffect(() => {
    if (!isTrue) {
      dispatchUpdate({ contextKey: readyToGraph, value: true });
    }
  }, [dispatchUpdate, isTrue, readyToGraph]);

  const sliders = Object.entries(forceAttributes).map((entry) => {
    if (entry[0] === 'id') {
      return null;
    }
    const stringKey = `${uniqueGraphName}-${entry[0]}`;
    const initial = entry[1] <= 1 ? entry[1] * 100 : entry[1];
    const max = initial == 0 ? 200 : initial * 2;
    return (
      <li key={stringKey}>
        <div className={'flex items-center w-full justify-between'}>
          <label htmlFor={stringKey}>{entry[0]}</label>
          <SelectiveContextRangeSlider
            dispatchKey={stringKey}
            listenerKey={stringKey}
            minValue={0}
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
