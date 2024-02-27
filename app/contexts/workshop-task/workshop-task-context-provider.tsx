// 'use client';
// import {
//   PropsWithChildren,
//   useContext,
//   useEffect,
//   useReducer,
//   useState
// } from 'react';
// import {
//   IWorkshopTaskContext,
//   WorkshopTaskContext,
//   WorkshopTaskDispatchContext
// } from './workshop-task-context';
// import { WorkTaskDto } from '../../api/zod-mods';
// import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
// import { useRouter } from 'next/navigation';
//
//
//
//
// export interface AddEditedTask {
//   type: 'addEditedTask';
//   editedTask: WorkTaskDto;
// }
//
// export interface RemoveEditedTask {
//   type: 'removeEditedTask';
//   editedTask: WorkTaskDto;
// }
//
// export interface ClearEditedTasks {
//   type: 'clearEditedTasks';
// }
//
// interface TriggerUpdate {
//   type: 'triggerUpdate';
// }
//
// export type TaskDispatch = AddEditedTask | ClearEditedTasks | RemoveEditedTask;
// const reducer = (state: WorkTaskDto[], action: TaskDispatch) => {
//   switch (action.type) {
//     case 'addEditedTask': {
//       const { editedTask } = action;
//       if (state.some((task) => task.id == editedTask.id)) {
//         return state.map((task) =>
//           task.id == action.editedTask.id ? action.editedTask : task
//         );
//       } else {
//         return [...state, editedTask];
//       }
//     }
//     case 'clearEditedTasks':
//       return [];
//     case 'removeEditedTask':
//       return state.filter((task) => task.id != action.editedTask.id);
//   }
// };
//
// export default function WorkshopTaskContextProvider({
//   children
// }: PropsWithChildren) {
//   const [state, dispatch] = useReducer(reducer, []);
//   const [openModal, setOpenModal] = useState(false);
//   const eventsDispatch = useContext(EventsDispatch);
//   const appRouterInstance = useRouter();
//
//   useEffect(() => {
//     let timeOutId: NodeJS.Timeout;
//     if (state.length > 0) {
//       const propagate = async () => {
//         const workshopTaskUpdate: WorkTaskDto[] = await Promise.all(
//           state.map(patchWorkshopTask)
//         );
//         dispatch({ type: 'clearEditedTasks' });
//         for (const task of workshopTaskUpdate) {
//           const events = task.events;
//           if (events) {
//             const map = await Promise.all(events.map(parseEvent));
//             map.forEach((event) => {
//
//               eventsDispatch({
//                 type: 'setEvent',
//                 event: event
//               });
//             });
//           }
//         }
//       };
//       timeOutId = setTimeout(() => {
//         propagate().then(() => {
//           console.log('refreshing...');
//           appRouterInstance.refresh();
//         });
//       }, 3000);
//     }
//     return () => {
//       if (timeOutId) {
//         clearTimeout(timeOutId);
//       }
//     };
//   }, [eventsDispatch, state, appRouterInstance]);
//
//   const transactionalModal: TransactionalModalInterface = {
//     open: openModal,
//     confirm: () => {},
//     cancel: () => {
//       setOpenModal(false);
//     }
//   };
//
//   return (
//     <WorkshopTaskContext.Provider value={{ editedTasks: state }}>
//       <WorkshopTaskDispatchContext.Provider value={{ dispatch: dispatch }}>
//         {children}
//         {state.length > 0 && (
//           <div
//             className={
//               'z-40 flex items-center border-gray-200 shadow-lg border-2 bg-gray-100 fixed top-16 right-16 p-2 rounded-md hover:bg-gray-50 group cursor-pointer'
//             }
//             onClick={() => setOpenModal(true)}
//           >
//             Unsaved Changes{' '}
//             <ExclamationTriangleIcon
//               className={
//                 'p-1 h-8 w-8 text-red-500 group-hover:opacity-100 opacity-50 '
//               }
//             ></ExclamationTriangleIcon>
//           </div>
//         )}
//         <TransactionModal
//           title={'Update Tasks database'}
//           context={transactionalModal}
//         >
//           <div>Send updated task info to database?</div>
//         </TransactionModal>
//       </WorkshopTaskDispatchContext.Provider>
//     </WorkshopTaskContext.Provider>
//   );
// }
