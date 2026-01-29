import qs from 'query-string';
import { type Status } from '@reflet/http';

import { getAccessToken } from '@/common/auth';

export type ApiError = {
  status: (typeof Status)[keyof typeof Status];
  message: string;
  details?: Record<string, string>;
};

export const getURL = (path: string, params?: Record<string, unknown>) =>
  import.meta.env.VITE_API_URL +
  path +
  (params && Object.keys(params).length > 0 ? `?${qs.stringify(params)}` : '');

export const getAuthorizationHeader = (token?: string) => {
  const t = token ?? getAccessToken();
  return t ? { Authorization: `Bearer ${t}` } : undefined;
};
