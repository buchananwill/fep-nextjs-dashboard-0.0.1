import * as D3 from 'd3';
import * as d3 from 'd3';
import { Simulation, SimulationNodeDatum } from 'd3';
import { DataLink, DataNode } from '../../../api/zod-mods';

export function getForceManyBody(
  maxDist: number,
  minDist: number,
  strength: (
    d: SimulationNodeDatum,
    i: number,
    data: SimulationNodeDatum[]
  ) => number
) {
  return D3.forceManyBody()
    .strength(strength)
    .distanceMax(maxDist)
    .distanceMin(minDist);
}

export function getManyBody<T>(nodesMutable: DataNode<T>[], maxDepth: number) {
  return (
    node: SimulationNodeDatum,
    index: number,
    data: SimulationNodeDatum[]
  ) => {
    const distanceFromRoot = nodesMutable[index].distanceFromRoot;

    return -50 - 50 * Math.pow((maxDepth - distanceFromRoot) / maxDepth, 2);
  };
}

export function updateManyBodyForce<T>(
  currentSim: Simulation<DataNode<T>, DataLink<T>>,
  manyBodyStrength: number,
  manyBodyTheta: number,
  manyBodyMinDistance: number,
  manyBodyMaxDistance: number
) {
  const forceManyBody = currentSim.force('charge') as d3.ForceManyBody<
    DataNode<T>
  >;
  const strength = manyBodyStrength - 100;
  const theta = manyBodyTheta < 10 ? 0.1 : manyBodyTheta / 100;

  forceManyBody
    .strength(strength)
    .distanceMin(manyBodyMinDistance)
    .distanceMax(manyBodyMaxDistance)
    .theta(theta);
}
