import { useMemo } from 'react';
import { atom, useAtom, useAtomValue } from 'jotai';

import { store } from '@/app/providers/Jotai';

export type AuthState = {
  userId: string;
  accessToken: string | undefined;
  refreshToken: string | undefined;
};

const initialValue: AuthState = {
  userId: '',
  accessToken: undefined,
  refreshToken: undefined,
};

const userIdAtom = atom(initialValue.userId);

// Atom lưu trữ thô lấy từ localStorage
const baseAuthAtom = atom({
  accessToken: localStorage.getItem('accessToken') ?? undefined,
  refreshToken: localStorage.getItem('refreshToken') ?? undefined,
});

// Atom có ghi (writable atom) để đồng bộ với localStorage
const authTokensAtom = atom(
  (get) => get(baseAuthAtom),
  (_, set, update: { accessToken: string | undefined; refreshToken: string | undefined }) => {
    set(baseAuthAtom, update);

    // Xử lý Access Token
    if (update.accessToken === undefined) {
      localStorage.removeItem('accessToken');
    } else {
      localStorage.setItem('accessToken', update.accessToken);
    }

    // Xử lý Refresh Token
    if (update.refreshToken === undefined) {
      localStorage.removeItem('refreshToken');
    } else {
      localStorage.setItem('refreshToken', update.refreshToken);
    }
  },
);

const isLoggedInAtom = atom(
  (get) => get(userIdAtom) !== initialValue.userId && get(authTokensAtom).accessToken !== undefined,
);

export const useAuthState = () => {
  const [userId, setUserId] = useAtom(userIdAtom);
  const [tokens, setTokens] = useAtom(authTokensAtom);
  const isLoggedIn = useAtomValue(isLoggedInAtom);

  return useMemo(
    () =>
      [
        { userId, ...tokens, isLoggedIn },
        (newState: AuthState = initialValue) => {
          setUserId(newState.userId);
          setTokens({
            accessToken: newState.accessToken,
            refreshToken: newState.refreshToken,
          });
        },
      ] as const,
    [userId, tokens, isLoggedIn, setUserId, setTokens],
  );
};

// Cập nhật hàm helper để lấy token nhanh (thường dùng trong API client)
export const getAccessToken = () => store.get(authTokensAtom).accessToken;
export const getRefreshToken = () => store.get(authTokensAtom).refreshToken;

export const setToken = (accessToken?: string, refreshToken?: string) => {
  const currentTokens = store.get(authTokensAtom);

  store.set(authTokensAtom, {
    ...currentTokens,
    ...(accessToken && { accessToken }),
    ...(refreshToken && { refreshToken }),
  });
};

export const handleLogout = () => {
  store.set(userIdAtom, '');
  store.set(authTokensAtom, { accessToken: undefined, refreshToken: undefined });
};
