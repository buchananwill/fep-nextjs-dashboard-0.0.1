'use server';
import { OrganizationDto } from '../dtos/OrganizationDtoSchema';
import { generateGraphEndpointSet } from '../actions/template-graph-endpoints';

export const { getGraph, getGraphByNodeList, getGraphByRootId, putGraph } =
 generateGraphEndpointSet<
  OrganizationDto
>(
  '/api/v2/organizations'
);


