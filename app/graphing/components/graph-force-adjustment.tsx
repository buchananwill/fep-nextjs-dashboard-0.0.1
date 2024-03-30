'use client';

import React, { useContext, useEffect } from 'react';
import { ForceGraphAttributesDto } from '../../api/dtos/ForceGraphAttributesDtoSchema';
import { SelectiveContextRangeSlider } from '../../generic/components/range-input/selective-context-range-slider';
import {
  useSelectiveContextControllerBoolean,
  useSelectiveContextListenerBoolean
} from '../../selective-context/components/typed/selective-context-manager-boolean';
import { GraphContext } from '../graph/graph-context-creator';
import {
  forceAttributesInitial,
  forceAttributesMax,
  forceAttributesMin
} from './force-attributes-meta-data';

import { ShowForceAdjustmentsKey } from '../graph/show-force-adjustments';
import { DisclosureThatGrowsOpen } from '../../generic/components/disclosures/disclosure-that-grows-open';

export default function GraphForceAdjustment() {
  const { uniqueGraphName } = useContext(GraphContext);
  const readyToGraph = `${uniqueGraphName}-ready`;
  const { currentState, dispatchUpdate } = useSelectiveContextControllerBoolean(
    readyToGraph,
    readyToGraph,
    false
  );

  const { isTrue: show } = useSelectiveContextListenerBoolean(
    ShowForceAdjustmentsKey,
    'graph-adjuster',
    false
  );

  useEffect(() => {
    if (!currentState) {
      dispatchUpdate({ contextKey: readyToGraph, update: true });
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
            className={'max-w-[50%]'}
            contextKey={stringKey}
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
    <div className={`${show ? '' : 'hidden'}`}>
      <DisclosureThatGrowsOpen
        label={'Adjust Forces'}
        heightWhenOpen={'h-60'}
        showBorder={true}
      >
        <div className={'h-60 overflow-auto border-slate-300 '}>
          <ul className={' p-2 '}>{...sliders}</ul>
        </div>
      </DisclosureThatGrowsOpen>
    </div>
  );
}
