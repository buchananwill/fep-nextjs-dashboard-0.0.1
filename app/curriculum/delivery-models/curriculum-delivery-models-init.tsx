'use client';
import { PropsWithChildren } from 'react';
import {
  CurriculumDeliveryModelEditingProps,
  useCurriculumDeliveryModelAndWorkTaskDependency
} from './use-curriculum-delivery-model-and-work-task-dependency';

export function CurriculumDeliveryModelsInit({
  children,
  taskTypeList,
  workProjectSeriesSchemaDtos
}: PropsWithChildren & CurriculumDeliveryModelEditingProps) {
  const b = useCurriculumDeliveryModelAndWorkTaskDependency(
    workProjectSeriesSchemaDtos,
    taskTypeList
  );

  return <></>;
}
