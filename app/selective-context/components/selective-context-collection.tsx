import { PropsWithChildren } from 'react';
import SelectiveContextManagerBoolean from './typed/selective-context-manager-boolean';
import SelectiveContextManagerNumber from './typed/selective-context-manager-number';
import SelectiveContextManagerString from './typed/selective-context-manager-string';
import SelectiveContextManagerStringList from './typed/selective-context-manager-string-list';
import SelectiveContextManagerNumberList from './typed/selective-context-manager-number-list';
import SelectiveContextManagerFunction from './typed/selective-context-manager-function';
import AssetSuitabilityListSelectiveContextProvider from '../../contexts/selective-context/asset-suitability-list-selective-context-provider';
import WorkTaskCompetencyListSelectiveContextProvider from '../../contexts/selective-context/work-task-competency-list-selective-context-provider';
import SelectiveContextManagerGlobal from './global/selective-context-manager-global';

export default function SelectiveContextCollection({
  children
}: PropsWithChildren) {
  return (
    <SelectiveContextManagerGlobal>
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
    </SelectiveContextManagerGlobal>
  );
}
