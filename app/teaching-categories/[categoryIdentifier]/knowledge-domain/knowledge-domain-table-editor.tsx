import { ServiceCategoryDto } from '../../../api/dtos/ServiceCategoryDtoSchema';
import { KnowledgeDomainNameCell } from './knowledge-domain-name-cell';
import { NewKnowledgeDomainButton } from './new-knowledge-domain-button';
import { KnowledgeDomainDependencies } from './knowledge-domain-dependencies';
import { HasNameDto } from '../../../api/dtos/HasNameDtoSchema';
import {
  KnowledgeCategoryTable,
  KnowledgeCategoryTableBody,
  KnowledgeCategoryTableCell,
  KnowledgeCategoryTableHeader,
  KnowledgeCategoryTableHeaderCell,
  KnowledgeCategoryTableRow
} from '../components/knowledge-category-table';
import { DataNotFoundCard } from '../../../timetables/students/[schedule]/data-not-found-card';
import { getDtoListByExampleList } from '../../../api/READ-ONLY-generated-actions/KnowledgeDomain';

export function getNameList<T extends HasNameDto>(namedDtoArray: T[]) {
  return namedDtoArray.map((dto) => dto.name);
}

export default async function KnowledgeDomainTableEditor({
  category
}: {
  category: ServiceCategoryDto;
}) {
  const { data: knowledgeDomains } = await getDtoListByExampleList([
    { serviceCategoryId: category.id }
  ]);

  if (knowledgeDomains === undefined) {
    return (
      <DataNotFoundCard>
        Knowledge domain data not found for category: {category.name}
      </DataNotFoundCard>
    );
  }
  const nameList = getNameList(knowledgeDomains);

  return (
    <KnowledgeCategoryTable>
      <KnowledgeCategoryTableHeader>
        <KnowledgeCategoryTableHeaderCell>
          {category.knowledgeDomainDescriptor}
          <NewKnowledgeDomainButton
            className={
              'flex relative m-0 p-0 min-h-fit max-h-fit h-6 leading-none overflow-hidden'
            }
            serviceCategory={category}
            knowledgeDomainServiceCategoryNameList={nameList}
          />
        </KnowledgeCategoryTableHeaderCell>
        <KnowledgeCategoryTableHeaderCell>
          <div className={'h-full'}>Work Task Types</div>
        </KnowledgeCategoryTableHeaderCell>
      </KnowledgeCategoryTableHeader>
      <KnowledgeCategoryTableBody>
        {knowledgeDomains.map((kd) => {
          return (
            <KnowledgeCategoryTableRow key={kd.id}>
              <KnowledgeCategoryTableCell>
                <KnowledgeDomainNameCell kd={kd} nameList={nameList} />
              </KnowledgeCategoryTableCell>
              <KnowledgeCategoryTableCell>
                <KnowledgeDomainDependencies kd={kd} />
              </KnowledgeCategoryTableCell>
            </KnowledgeCategoryTableRow>
          );
        })}
      </KnowledgeCategoryTableBody>
    </KnowledgeCategoryTable>
  );
}
