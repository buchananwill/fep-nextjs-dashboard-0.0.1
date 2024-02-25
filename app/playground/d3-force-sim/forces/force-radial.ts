import * as d3 from 'd3';
import { Simulation } from 'd3';
import { DataLink, DataNode } from '../../../api/zod-mods';
import { negativeLogTen } from './math-functions';

export function updateForceRadial<T>(
  currentSim: Simulation<DataNode<T>, DataLink<T>>,
  forceRadialStrength: number
) {
  const forceRadial = currentSim.force('radial') as d3.ForceRadial<DataNode<T>>;
  if (forceRadial) {
    const strength = negativeLogTen(forceRadialStrength);
    forceRadial.strength(strength > 0.001 ? strength : 0);
  }
}
