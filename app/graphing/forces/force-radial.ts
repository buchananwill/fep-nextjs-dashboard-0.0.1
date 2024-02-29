import * as d3 from 'd3';
import { Simulation } from 'd3';
import { DataLink, DataNode } from '../../api/zod-mods';
import { negativeLogTen } from './math-functions';
import { updateForce } from './force-link';

export function updateForceRadial<T>(
  currentSim: Simulation<DataNode<T>, DataLink<T>>,
  forceRadialStrength: number
) {
  function consumerRadial(forceRadial: d3.ForceRadial<DataNode<T>>) {
    const strength = negativeLogTen(forceRadialStrength);
    forceRadial.strength(strength > 0.001 ? strength : 0);
  }

  updateForce(currentSim, 'radial', consumerRadial);
}
