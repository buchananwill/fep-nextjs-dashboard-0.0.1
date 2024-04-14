import DtoController from './dto-controller';
import DtoListController, {
  DtoListControllerProps
} from './dto-id-list-controller';
import { HasId } from '../../../api/main';

function getEntityNamespaceKey<T extends HasId>(entityName: string, dto: T) {
  return `${entityName}:${dto.id}`;
}

export default function DtoControllerArray<T extends HasId>({
  dtoList,
  entityName,
  updateServerAction,
  deleteServerAction
}: DtoListControllerProps<T>) {
  return (
    <>
      <DtoListController
        dtoList={dtoList}
        entityName={entityName}
        updateServerAction={updateServerAction}
        deleteServerAction={deleteServerAction}
      />
      {dtoList.map((dto) => (
        <DtoController
          key={getEntityNamespaceKey(entityName, dto)}
          dto={dto}
          entityName={entityName}
        />
      ))}
    </>
  );
}
