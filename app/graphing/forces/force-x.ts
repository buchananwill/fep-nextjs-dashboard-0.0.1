import * as D3 from 'd3';
import * as d3 from 'd3';
import { Simulation } from 'd3';
import { DataLink, DataNode } from '../../api/zod-mods';
import { negativeLogTen } from './math-functions';

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
  let forceX = currentSim.force('forceX');
  if (forceX !== null && forceX !== undefined) {
    const forceXDefined = forceX as d3.ForceX<DataNode<T>>;
    const strength = negativeLogTen(forceXStrength);
    const finalStrength = strength > 0.001 ? strength : 0;
    forceXDefined.strength(finalStrength);
  }
}
