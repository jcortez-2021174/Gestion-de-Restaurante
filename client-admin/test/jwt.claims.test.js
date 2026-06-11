import test from 'node:test';
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { getJwtRole } from '../src/features/auth/jwt.claims.js';

const tokenWithPayload = (payload) => {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `header.${encoded}.signature`;
};

test('reads and normalizes the AuthService role claim', () => {
  assert.equal(getJwtRole(tokenWithPayload({ role: ' admin_role ' })), 'ADMIN_ROLE');
});

test('supports array role claims and rejects malformed tokens', () => {
  assert.equal(getJwtRole(tokenWithPayload({ roles: ['USER_ROLE'] })), 'USER_ROLE');
  assert.equal(getJwtRole('not-a-token'), null);
});
