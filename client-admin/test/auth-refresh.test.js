import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isPublicAuthRequest,
  rotatePersistedTokens,
  shouldAttemptTokenRefresh,
} from '../src/shared/apis/auth-refresh.js';

test('refreshes protected requests only after an initial 401', () => {
  assert.equal(shouldAttemptTokenRefresh({
    status: 401,
    url: '/pedido/mis-pedidos',
  }), true);
  assert.equal(shouldAttemptTokenRefresh({
    status: 401,
    url: '/pedido',
    isRetry: true,
  }), false);
  assert.equal(shouldAttemptTokenRefresh({
    status: 403,
    url: '/pedido',
  }), false);
});

test('does not refresh public authentication requests', () => {
  assert.equal(isPublicAuthRequest('/auth/login'), true);
  assert.equal(shouldAttemptTokenRefresh({
    status: 401,
    url: '/auth/login',
  }), false);
  assert.equal(shouldAttemptTokenRefresh({
    status: 401,
    url: '/auth/register',
  }), false);
  assert.equal(shouldAttemptTokenRefresh({
    status: 401,
    url: '/auth/refresh',
  }), false);
});

test('persists both rotated access and refresh tokens', () => {
  const persisted = {
    state: {
      token: 'expired-access',
      refreshToken: 'old-refresh',
      isAuthenticated: true,
    },
    version: 0,
  };

  assert.deepEqual(
    rotatePersistedTokens(persisted, 'new-access', 'new-refresh'),
    {
      state: {
        token: 'new-access',
        refreshToken: 'new-refresh',
        isAuthenticated: true,
      },
      version: 0,
    },
  );
});
