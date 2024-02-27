import { SimulationNodeDatum } from 'd3';
import { DataNode } from '../../api/zod-mods';
import { ProductComponentStateDto } from '../../api/dtos/ProductComponentStateDtoSchema';

export function getLog10Function(factor: number, constant: number) {
  return (d: SimulationNodeDatum) =>
    Math.log10((d as DataNode<ProductComponentStateDto>).distanceFromRoot + 1) *
      factor +
    constant;
}

export function negativeLogTen(forceStrength: number) {
  return Math.pow(10, -4 + forceStrength / 50);
}
