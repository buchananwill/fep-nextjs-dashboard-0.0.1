import * as D3 from 'd3';
import * as d3 from 'd3';
import { Simulation } from 'd3';
import { DataLink, DataNode } from '../../api/zod-mods';
import { negativeLogTen } from './math-functions';
import { updateForce } from './force-link';
import { useNormalizeForceRange } from '../components/force-attributes-meta-data';

export function getGridX(
  width: number,
  spacing: number = 30,
  strength: number
) {
  return D3.forceX((d, index) => {
    if (index == undefined || isNaN(index)) return width / 2;
    else return index * spacing;
  }).strength(strength);
}

export function updateForceX<T>(
  currentSim: Simulation<DataNode<T>, DataLink<T>>,
  forceXStrength: number
) {
  function consumerForceX(forceXDefined: d3.ForceX<DataNode<T>>) {
    const strength = forceXStrength;
    const finalStrength = strength > 0.001 ? strength : 0;
    forceXDefined.strength(finalStrength);
  }
  updateForce(currentSim, 'forceX', consumerForceX);
}
