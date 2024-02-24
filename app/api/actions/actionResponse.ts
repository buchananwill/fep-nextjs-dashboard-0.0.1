export type ActionResponsePromise<T> = Promise<ActionResponse<T>>;

export class ActionResponse<T> {
  status: number;
  data?: T;
  message?: string;

  constructor(status: number, data?: T, message?: string) {
    this.status = status;
    this.data = data;
    this.message = message;
  }

  // Static convenience methods
  static success<T>(data: T, message?: string): ActionResponse<T> {
    return new ActionResponse(200, data, message);
  }

  static error<T>(message: string, data?: T): ActionResponse<T> {
    return new ActionResponse(500, data, message);
  }

  // Add more static methods for other common responses if needed
}
