import * as D3 from 'd3';
import * as d3 from 'd3';
import { Simulation, SimulationNodeDatum } from 'd3';
import { DataLink, DataNode } from '../../api/zod-mods';
import { negativeLogTen } from './math-functions';
import { updateForce } from './force-link';

export function getModulusGridY<T>(
  spacing: number,
  height: number = 600,

  strength?: (
    d: SimulationNodeDatum,
    i: number,
    data: SimulationNodeDatum[]
  ) => number
) {
  return D3.forceY((d: DataNode<T>, i) => {
    if (i == undefined || isNaN(i)) return height / 2;
    else return (i * spacing) % height;
  }).strength(strength || 0.05);
}

export function updateForceY<T>(
  currentSim: Simulation<DataNode<T>, DataLink<T>>,
  forceYStrength: number
) {
  function consumer(forceY: d3.ForceY<DataNode<T>>) {
    const strength = negativeLogTen(forceYStrength);
    const finalStrength = strength > 0.001 ? strength : 0;
    forceY.strength(finalStrength);
  }

  updateForce(currentSim, 'forceY', consumer);
}
