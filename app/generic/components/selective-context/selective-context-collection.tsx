import { PropsWithChildren } from 'react';
import SelectiveContextManagerBoolean from './selective-context-manager-boolean';
import SelectiveContextManagerNumber from './selective-context-manager-number';
import SelectiveContextManagerString from './selective-context-manager-string';
import SelectiveContextManagerStringList from './selective-context-manager-string-list';
import SelectiveContextManagerNumberList from './selective-context-manager-number-list';
import SelectiveContextManagerFunction from './selective-context-manager-function';
import AssetSuitabilityListSelectiveContextProvider from '../../../contexts/selective-context/asset-suitability-list-selective-context-provider';
import WorkTaskCompetencyListSelectiveContextProvider from '../../../contexts/selective-context/work-task-competency-list-selective-context-provider';

export default function SelectiveContextCollection({
  children
}: PropsWithChildren) {
  return (
    <SelectiveContextManagerBoolean>
      <SelectiveContextManagerNumber>
        <SelectiveContextManagerString>
          <SelectiveContextManagerStringList>
            <SelectiveContextManagerNumberList>
              <SelectiveContextManagerFunction>
                <AssetSuitabilityListSelectiveContextProvider>
                  <WorkTaskCompetencyListSelectiveContextProvider>
                    {children}
                  </WorkTaskCompetencyListSelectiveContextProvider>
                </AssetSuitabilityListSelectiveContextProvider>
              </SelectiveContextManagerFunction>
            </SelectiveContextManagerNumberList>
          </SelectiveContextManagerStringList>
        </SelectiveContextManagerString>
      </SelectiveContextManagerNumber>
    </SelectiveContextManagerBoolean>
  );
}
