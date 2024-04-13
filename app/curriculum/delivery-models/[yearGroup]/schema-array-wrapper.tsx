import SelectiveListenerArrayGenerator from '../../../playground/dto-component-array-generator';
import { CurriculumDeliveryModel } from '../curriculum-delivery-model';
import { WorkProjectSeriesSchemaDto } from '../../../api/dtos/WorkProjectSeriesSchemaDtoSchema';

export default function SchemaArrayWrapper() {
  return (
    <SelectiveListenerArrayGenerator<WorkProjectSeriesSchemaDto>
      entityName={'workProjectSeriesSchema'}
      renderEachAs={CurriculumDeliveryModel}
    />
  );
}
