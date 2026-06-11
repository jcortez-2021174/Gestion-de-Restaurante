import test from 'node:test';
import assert from 'node:assert/strict';
import { authorizeRole } from '../middlewares/authorize-role.js';

const runMiddleware = (role) => {
  let responseStatus;
  let responseBody;
  let nextCalled = false;
  const req = { auth: { role } };
  const res = {
    status(status) {
      responseStatus = status;
      return this;
    },
    json(body) {
      responseBody = body;
      return this;
    },
  };

  authorizeRole('ADMIN_ROLE')(req, res, () => {
    nextCalled = true;
  });

  return { responseStatus, responseBody, nextCalled };
};

test('allows administrators to manage orders', () => {
  assert.equal(runMiddleware('ADMIN_ROLE').nextCalled, true);
});

test('normalizes the AuthService administrator role before comparison', () => {
  assert.equal(runMiddleware(' admin_role ').nextCalled, true);
});

test('accepts an administrator role emitted as an array', () => {
  assert.equal(runMiddleware(['ADMIN_ROLE']).nextCalled, true);
});

test('rejects customer access to admin order actions', () => {
  const result = runMiddleware('USER_ROLE');
  assert.equal(result.responseStatus, 403);
  assert.equal(result.responseBody.code, 'AUTH_ROLE_FORBIDDEN');
  assert.equal(result.nextCalled, false);
});
