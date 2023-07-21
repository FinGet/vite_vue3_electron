import { useUserStore } from '@renderer/store/user';
import axios, { type AxiosProgressEvent, AxiosResponse, GenericAbortSignal } from 'axios';
import { ElMessage } from 'element-plus';

export interface HttpOption {
  url: string;
  data?: any;
  method?: string;
  headers?: any;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
  signal?: GenericAbortSignal;
  beforeRequest?: () => void;
  afterRequest?: () => void;
  showSuccess?: boolean;
  showError?: boolean;
}

export interface Response<T = any> {
  data: T;
  msg: string;
  code: number;
  message?: string;
}

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API as string,
  timeout: 5000
});

service.interceptors.request.use((config) => {
  const token = useUserStore().token;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

service.interceptors.response.use((response: AxiosResponse) => {
  return response.data;
});
const tokenError = [4001003, 4001004, 4001005];
function http<T = any>({
  url,
  data,
  method,
  headers,
  onDownloadProgress,
  signal,
  beforeRequest,
  afterRequest,
  showSuccess,
  showError
}: HttpOption) {
  const successHandler = (res: AxiosResponse<Response<T>>) => {
    // Error code 2 at the beginning of identity as a special business, can be dealt with according to the success
    if (res.data.code === 0 || String(res.data.code)[0] === '2') {
      if (showSuccess) {
        ElMessage.success(res.data.msg);
      }
      return res.data;
    }
    if (tokenError.includes(res.data.code)) {
      useUserStore().removeToken();
      window.location.reload();
      return Promise.reject(res.data);
    } else {
      if (showError) {
        const msg = 'Login failed, please log in again.';
        ElMessage.error(tokenError.includes(res.data.code) ? msg : res.data.msg);
      }
      return Promise.reject(res.data);
    }
  };

  const failHandler = (error: Response<Error>) => {
    afterRequest?.();
    throw new Error(error.message || 'Error');
  };

  beforeRequest?.();

  method = method || 'GET';

  const params = Object.assign(typeof data === 'function' ? data() : data ?? {}, {});

  if (method === 'GET') {
    return service
      .get(url, { params, signal, onDownloadProgress })
      .then(successHandler, failHandler);
  } else if (method === 'PUT') {
    return service
      .put(url, params, { headers, signal, onDownloadProgress })
      .then(successHandler, failHandler);
  } else if (method === 'DELETE') {
    return service
      .delete(url, { params, headers, signal, onDownloadProgress })
      .then(successHandler, failHandler);
  } else if (method === 'POST') {
    return service
      .post(url, params, { headers, signal, onDownloadProgress })
      .then(successHandler, failHandler);
  } else {
    return service
      .patch(url, params, { headers, signal, onDownloadProgress })
      .then(successHandler, failHandler);
  }
}

const createRequest = <T = any>(method: string, options: HttpOption) => {
  return http<T>({
    method,
    showSuccess: false,
    showError: true,
    ...options
  });
};

export const get = <T = any>(options: HttpOption) => createRequest<T>('GET', options);
export const post = <T = any>(options: HttpOption) => createRequest<T>('POST', options);
export const put = <T = any>(options: HttpOption) => createRequest<T>('PUT', options);
export const del = <T = any>(options: HttpOption) => createRequest<T>('DELETE', options);
export const patch = <T = any>(options: HttpOption) => createRequest<T>('PATCH', options);

export default service;
