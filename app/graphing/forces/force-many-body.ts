import * as D3 from 'd3';
import * as d3 from 'd3';
import { Simulation, SimulationNodeDatum } from 'd3';
import { DataLink, DataNode } from '../../api/zod-mods';
import { updateForce } from './force-link';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';

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

export function getManyBodyStrengthFunction<T extends HasNumberIdDto>(
  nodesMutable: DataNode<T>[],
  maxDepth: number
) {
  return (
    node: SimulationNodeDatum,
    index: number,
    data: SimulationNodeDatum[]
  ) => {
    const distanceFromRoot = nodesMutable[index].distanceFromRoot;

    // return -50 - 50 * Math.pow((maxDepth - distanceFromRoot) / maxDepth, 2);
    return -50;
  };
}

export function updateManyBodyForce<T extends HasNumberIdDto>(
  currentSim: Simulation<DataNode<T>, DataLink<T>>,
  manyBodyStrength: number,
  manyBodyTheta: number,
  manyBodyMinDistance: number,
  manyBodyMaxDistance: number
) {
  function consumerCharge(forceManyBody: d3.ForceManyBody<DataNode<T>>) {
    const strength = manyBodyStrength - 100;
    const theta = manyBodyTheta < 10 ? 0.1 : manyBodyTheta / 100;

    forceManyBody
      .strength(strength)
      .distanceMin(manyBodyMinDistance)
      .distanceMax(manyBodyMaxDistance)
      .theta(theta);
  }
  updateForce(currentSim, 'charge', consumerCharge);
}
