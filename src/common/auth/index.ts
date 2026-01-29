import { useMemo, useCallback, useState } from 'react';

import { type SignInPayload } from '@/api';
import { getMe, signIn as signInApi } from '@/api/endpoints';

import { getAccessToken, getRefreshToken, handleLogout, useAuthState } from './state';

export { default as RequireIsAnonymous } from './RequireIsAnonymous';
export { default as RequireIsLoggedIn } from './RequireIsLoggedIn';

export { getAccessToken, getRefreshToken } from './state';

export const useAuth = () => useAuthState()[0];

export const useSignIn = () => {
  const [isPending, setIsPending] = useState(false);

  const [, setAuthState] = useAuthState();

  const signIn = useCallback(
    async (payload: SignInPayload, opts?: { onError?: (error: unknown) => void }) => {
      try {
        setIsPending(true);
        const response = await signInApi(payload);

        if (response.success) {
          const { id, accessToken, refreshToken } = response.data;

          setAuthState({
            userId: id,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
        }
      } catch (error: unknown) {
        opts?.onError?.(error);
      } finally {
        setIsPending(false);
      }
    },
    [setAuthState, setIsPending],
  );

  return useMemo(() => ({ isPending, signIn }), [isPending, signIn]);
};

export const useRelogin = () => {
  const [isPending, setIsPending] = useState(false);

  const [, setAuthState] = useAuthState();

  const relogin = useCallback(async () => {
    try {
      setIsPending(true);
      const response = await getMe();

      if (response.success) {
        const { id } = response.data;
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();

        setAuthState({
          userId: id,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      }
    } catch {
      handleLogout();
    } finally {
      setIsPending(false);
    }
  }, [setAuthState, setIsPending]);

  return useMemo(() => ({ isPending, relogin }), [isPending, relogin]);
};
