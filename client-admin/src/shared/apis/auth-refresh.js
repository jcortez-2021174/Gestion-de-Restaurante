import { getJwtRole } from '../../features/auth/jwt.claims.js';

const PUBLIC_AUTH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
];

export const isPublicAuthRequest = (url = '') =>
  PUBLIC_AUTH_PATHS.some((path) => url.endsWith(path));

export const shouldAttemptTokenRefresh = ({
  status,
  url = '',
  isRetry = false,
}) => (
  status === 401
  && !isRetry
  && !isPublicAuthRequest(url)
);

export const rotatePersistedTokens = (
  persistedAuth,
  accessToken,
  refreshToken,
) => {
  if (!persistedAuth?.state || !accessToken) {
    return persistedAuth;
  }

  const nextState = {
    ...persistedAuth.state,
    token: accessToken,
    refreshToken: refreshToken || persistedAuth.state.refreshToken,
  };

  if (persistedAuth.state.user) {
    nextState.user = {
      ...persistedAuth.state.user,
      role: getJwtRole(accessToken) || persistedAuth.state.user.role,
    };
  }

  return {
    ...persistedAuth,
    state: nextState,
  };
};
