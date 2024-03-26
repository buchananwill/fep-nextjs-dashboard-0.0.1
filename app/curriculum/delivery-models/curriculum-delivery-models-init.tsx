'use client';
import { PropsWithChildren } from 'react';
import {
  CurriculumDeliveryModelEditingProps,
  useCurriculumDeliveryModelAndWorkTaskDependency
} from './use-curriculum-delivery-model-and-work-task-dependency';

export function CurriculumDeliveryModelsInit({
  taskTypeList,
  workProjectSeriesSchemaDtos
}: PropsWithChildren & CurriculumDeliveryModelEditingProps) {
  const {} = useCurriculumDeliveryModelAndWorkTaskDependency(
    workProjectSeriesSchemaDtos,
    taskTypeList
  );

  return <></>;
}
