import { User } from '@renderer/types';
import { post } from '@renderer/utils/request';

export const login = (data: any) => {
  return post<User>({
    url: '/api/login',
    data
  });
};
