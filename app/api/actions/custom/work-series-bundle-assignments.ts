'use server';
import { ActionResponsePromise } from '../actionResponse';
import { WorkSeriesBundleAssignmentDto } from '../../dtos/WorkSeriesBundleAssignmentDtoSchema';
import {
  getWithoutBody,
  postEntitiesWithDifferentReturnType
} from '../template-actions';
import { API_V2_URL } from '../../main';
import { LongLongTuple } from '../../dtos/LongLongTupleSchema';

const ASSIGNMENTS_ENDPOINT = `${API_V2_URL}/workProjectSeriesSchemas/bundleAssignments`;

export async function getBundleAssignmentsByOrgType(
  orgType: number
): ActionResponsePromise<WorkSeriesBundleAssignmentDto[]> {
  const url = `${ASSIGNMENTS_ENDPOINT}/byOrganizationType/${orgType}`;

  return await getWithoutBody<WorkSeriesBundleAssignmentDto[]>(url);
}

export async function postBundleDeliveries(
  bundleAssignments: LongLongTuple[]
): ActionResponsePromise<WorkSeriesBundleAssignmentDto[]> {
  const bundlePostUrl = `${ASSIGNMENTS_ENDPOINT}/byLongLongTupleList`;
  return postEntitiesWithDifferentReturnType<
    LongLongTuple[],
    WorkSeriesBundleAssignmentDto[]
  >(bundleAssignments, bundlePostUrl);
}
