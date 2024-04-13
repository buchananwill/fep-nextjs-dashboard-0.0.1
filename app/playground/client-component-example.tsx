'use client';
import { WorkTaskTypeDto } from '../api/dtos/WorkTaskTypeDtoSchema';
import { RenameEntity } from './rename-entity';
import SelectiveListenerArrayGenerator from './dto-component-array-generator';

export default function ClientComponentExample() {
  return (
    <SelectiveListenerArrayGenerator<WorkTaskTypeDto>
      entityName={'workTaskType'}
      renderEachAs={RenameEntity<WorkTaskTypeDto>}
    />
  );
}
