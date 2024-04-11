'use server';
import { OrganizationTypeDto } from '../dtos/OrganizationTypeDtoSchema';
import { generateGraphEndpointSet } from '../actions/template-graph-endpoints';

export const { getGraph, getGraphByNodeList, getGraphByRootId, putGraph } =
 generateGraphEndpointSet<
  OrganizationTypeDto
>(
  '/api/v2/organizations/types'
);


