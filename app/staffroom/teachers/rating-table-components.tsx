import { PropsWithChildren } from 'react';

export function RatingTableHeaderCell({ children }: PropsWithChildren) {
  return (
    <th className={`overflow-visible align-bottom relative`}>
      <div
        className={`group/skill overflow-visible align-bottom`}
        style={{ width: '24px', height: '200px' }}
      >
        <div
          className={`text-xs absolute origin-left left-3 -bottom-2 group-hover/skill:-translate-y-3 group-hover/skill:z-10 group-hover/skill:-translate-x-3  -rotate-90 group-hover/skill:rotate-0 transition-transform duration-200 align-bottom bg-gray-100 rounded-lg w-48 py-1 font-medium opacity-50 group-hover/skill:opacity-100 truncate ...`}
        >
          {children}
        </div>
      </div>
    </th>
  );
}

export function RatingTableHeader({
  ratingCategoryDescriptor,
  children
}: {
  ratingCategoryDescriptor: React.ReactNode;
} & PropsWithChildren) {
  return (
    <thead className="text-sm ">
      <tr className="h-32 overflow-visible">
        <th className="px-2 w-40 h-[160px]">
          <div
            className={
              'h-full min-h-max max-h-full flex flex-col items-stretch justify-between'
            }
          >
            <div className={'text-right'}>{ratingCategoryDescriptor}</div>
            <div
              className={
                'grow divide-y-2 flex flex-col justify-center rotate-45'
              }
            >
              <div></div>
              <div></div>
            </div>
            <div className={'text-left'}>Name</div>
          </div>
        </th>
        {children}
      </tr>
    </thead>
  );
}

export function RatingTableMain({ children }: PropsWithChildren) {
  return (
    <div className="m-2 p-2 border-2 rounded-lg">
      <table className="table-fixed ">{children}</table>
    </div>
  );
}
