import * as d3 from 'd3';
import { Simulation, SimulationNodeDatum } from 'd3';
import { DataLink, DataNode } from '../../api/zod-mods';
import { updateForce } from './force-link';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';

export function getModulusGridY<T extends HasNumberIdDto>(
  spacing: number,
  height: number = 600,

  strength?: (
    d: SimulationNodeDatum,
    i: number,
    data: SimulationNodeDatum[]
  ) => number
) {
  return d3
    .forceY((_d: DataNode<T>, i) => {
      if (i == undefined || isNaN(i)) return height / 2;
      else return (i * spacing) % height;
    })
    .strength(strength || 0.05);
}

export function updateForceY<T extends HasNumberIdDto>(
  currentSim: Simulation<DataNode<T>, DataLink<T>>,
  forceYStrength: number
) {
  function consumer(forceY: d3.ForceY<DataNode<T>>) {
    const strength = forceYStrength;
    const finalStrength = strength > 0.001 ? strength : 0;
    forceY.strength(finalStrength);
  }

  updateForce(currentSim, 'forceY', consumer);
}
