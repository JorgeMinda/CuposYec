export interface ResponseHttpModel {
  data: object | boolean | number | string;
  message: string | string[];
  title: string;
  pagination?: any;
}

export interface ErrorResponseHttpModel {
  data?: any;
  error: string;
  message: string | string[];
  statusCode: number;
}
