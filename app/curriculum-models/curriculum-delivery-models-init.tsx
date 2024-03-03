'use client';
import { PropsWithChildren } from 'react';
import {
  CurriculumDeliveryModelEditingProps,
  useCurriculumDeliveryModelEditing
} from './use-curriculum-delivery-model-editing';

export function CurriculumDeliveryModelsInit({
  children,
  taskTypeList,
  workProjectSeriesSchemaDtos
}: PropsWithChildren & CurriculumDeliveryModelEditingProps) {
  useCurriculumDeliveryModelEditing(workProjectSeriesSchemaDtos, taskTypeList);
  return <></>;
}
