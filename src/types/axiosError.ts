export interface AxiosErrorData {
  message?: string;
  [key: string]: unknown;
}

export interface AppAxiosError {
  response?: {
    data?: AxiosErrorData;
    status?: number;
    [key: string]: unknown;
  };
  message?: string;
  [key: string]: unknown;
}