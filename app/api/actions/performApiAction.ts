'use server';
import { ActionResponse, ActionResponsePromise } from './actionResponse';

export async function performApiAction<T>(
  action: () => ActionResponsePromise<T>
): ActionResponsePromise<T> {
  try {
    return await action();
  } catch (error) {
    const errorMessage = error?.toString() || 'Unknown Error';
    console.error(error);
    return ActionResponse.error(errorMessage);
  }
}
