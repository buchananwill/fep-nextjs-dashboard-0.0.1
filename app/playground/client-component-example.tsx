'use client';
import { WorkTaskTypeDto } from '../api/dtos/WorkTaskTypeDtoSchema';
import { ExampleRenderPropFunctionComponent } from './example-render-prop-function-component';
import SelectiveListenerArrayGenerator from './dto-component-array-generator';

export default function ClientComponentExample() {
  return (
    <SelectiveListenerArrayGenerator<WorkTaskTypeDto>
      entityName={'workTaskType'}
    >
      {(entity, dispatchWithoutControl) => (
        <ExampleRenderPropFunctionComponent<WorkTaskTypeDto>
          entity={entity}
          dispatchWithoutControl={dispatchWithoutControl}
        />
      )}
    </SelectiveListenerArrayGenerator>
  );
}
