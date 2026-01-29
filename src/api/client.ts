import { getRefreshToken } from '@/common/auth';
import { createZodFetcher, type Schema } from 'zod-fetch';
import { getURL } from './utils';
import { refreshTokenResponseSchema } from './models';
import { getAccessToken, handleLogout, setToken } from '@/common/auth/state';

type FetchUrl = Parameters<typeof fetch>[0];

type FetchInit = Omit<NonNullable<Parameters<typeof fetch>[1]>, 'body'> & {
  body?: unknown;
};

// 1. Hàm hỗ trợ chuẩn hóa URL
const buildFullUrl = (url: FetchUrl): string => {
  const path = url instanceof URL ? url.pathname + url.search : String(url);
  return new URL(path, import.meta.env.VITE_API_URL).toString();
};

// 2. Hàm xử lý logic Refresh Token để tách khỏi luồng chính
const tryRefreshToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const refreshResp = await post(refreshTokenResponseSchema, getURL('/auth/refresh-token'), {
      body: { refreshToken },
    });

    if (refreshResp.success) {
      setToken(refreshResp.data.accessToken);
      return refreshResp.data.accessToken;
    }
  } catch (error) {
    console.error('Refresh token error:', error);
  }

  handleLogout();
  return null;
};

const apiClient = createZodFetcher(
  async <R>(url: FetchUrl, { body, headers, ...initRest }: FetchInit = {}) => {
    const fullUrl = buildFullUrl(url);

    const makeRequest = (token?: string) => {
      const init = {
        ...initRest,
        headers: {
          ...headers,
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
        body: body ? JSON.stringify(body) : null,
      };
      return fetch(fullUrl, init);
    };

    if (import.meta.env.DEV) {
      console.log('API client request:', { fullUrl });
    }

    let resp = await makeRequest(getAccessToken());

    // Xử lý retry nếu 410 (token expired)
    if (resp.status === 410) {
      const newToken = await tryRefreshToken();
      if (newToken) {
        resp = await makeRequest(newToken);
      }
    }

    const json = await resp.json();

    if (!resp.ok) {
      if (import.meta.env.DEV) {
        console.error('API client error:', json);
      }
      throw json;
    }

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return json as R;
  },
);

export const get = <R>(schema: Schema<R>, url: FetchUrl, init?: FetchInit) =>
  apiClient<R>(schema, url, {
    ...init,
    method: 'GET',
  });

export const post = <R>(schema: Schema<R>, url: FetchUrl, init?: FetchInit) =>
  apiClient<R>(schema, url, {
    ...init,
    method: 'POST',
  });

export const put = <R>(schema: Schema<R>, url: FetchUrl, init?: FetchInit) =>
  apiClient<R>(schema, url, {
    ...init,
    method: 'PUT',
  });

export const patch = <R>(schema: Schema<R>, url: FetchUrl, init?: FetchInit) =>
  apiClient<R>(schema, url, {
    ...init,
    method: 'PATCH',
  });

export const del = <R>(schema: Schema<R>, url: FetchUrl, init?: FetchInit) =>
  apiClient<R>(schema, url, {
    ...init,
    method: 'DELETE',
  });
