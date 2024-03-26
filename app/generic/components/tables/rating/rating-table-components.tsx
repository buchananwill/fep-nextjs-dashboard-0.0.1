import { PropsWithChildren, ReactNode } from 'react';

export function RatingTableHeaderCell({ children }: PropsWithChildren) {
  return (
    <th className={`overflow-visible align-bottom relative`}>
      <div
        className={`group/skill overflow-visible align-bottom`}
        style={{ width: '24px', height: '200px' }}
      >
        <div
          className={`text-xs absolute text-left origin-left left-3 -bottom-2 group-hover/skill:-translate-y-3 group-hover/skill:z-10 group-hover/skill:-translate-x-3  -rotate-90 group-hover/skill:rotate-0 transition-transform duration-200 align-bottom bg-gray-100 rounded-lg w-48 py-1 font-medium opacity-50 group-hover/skill:opacity-100 truncate ...`}
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
  ratingCategoryDescriptor: ReactNode;
} & PropsWithChildren) {
  return (
    <thead className="text-sm sticky top-0 bg-opacity-100 bg-white z-20">
      <tr className="overflow-visible">
        <th className="sticky left-0 z-10 p-0">
          <div
            className={
              ' w-[200px] h-[200px] flex flex-col items-stretch justify-between bg-white bg-opacity-100 m-0 overflow-hidden '
            }
          >
            <div className={'text-right p-2'}>{ratingCategoryDescriptor}</div>
            <div
              className={
                'grow divide-y-2 flex flex-col justify-center rotate-45'
              }
            >
              <div></div>
              <div></div>
            </div>
            <div className={'text-left p-2'}>Name</div>
          </div>
        </th>
        {children}
      </tr>
    </thead>
  );
}

export function RatingTableMain({ children }: PropsWithChildren) {
  return <table className="table-fixed ">{children}</table>;
}
