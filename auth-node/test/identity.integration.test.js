import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import { createValidateJWT } from '../middlewares/validate-jwt.js';
import { createResolveCliente } from '../middlewares/resolve-cliente.js';

const JWT_CONFIG = {
  secret: 'integration-test-secret-with-at-least-32-characters',
  issuer: 'AuthService.Api',
  audience: 'GestorRestaurante.Clients',
};

const createToken = (subject = 'postgres-user-123') => jwt.sign(
  { role: 'USER_ROLE' },
  JWT_CONFIG.secret,
  {
    algorithm: 'HS256',
    issuer: JWT_CONFIG.issuer,
    audience: JWT_CONFIG.audience,
    subject,
    expiresIn: '5m',
  }
);

const startTestServer = async (findByAuthUserId) => {
  const app = express();
  app.get(
    '/identity',
    createValidateJWT(JWT_CONFIG),
    createResolveCliente({ findByAuthUserId }),
    (req, res) => {
      res.status(200).json({
        authUserId: req.auth.userId,
        clienteId: req.cliente._id,
      });
    }
  );

  const server = await new Promise((resolve) => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
  });
  const address = server.address();

  return {
    url: `http://127.0.0.1:${address.port}/identity`,
    close: () => new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    }),
  };
};

test('accepts a .NET-compatible JWT and resolves its Cliente', async (t) => {
  const server = await startTestServer(async (authUserId) => ({
    _id: 'mongo-cliente-456',
    authUserId,
  }));
  t.after(server.close);

  const response = await fetch(server.url, {
    headers: { Authorization: `Bearer ${createToken()}` },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    authUserId: 'postgres-user-123',
    clienteId: 'mongo-cliente-456',
  });
});

test('rejects a JWT with the wrong issuer', async (t) => {
  const server = await startTestServer(async () => null);
  t.after(server.close);
  const token = jwt.sign(
    { sub: 'postgres-user-123', role: 'USER_ROLE' },
    JWT_CONFIG.secret,
    {
      algorithm: 'HS256',
      issuer: 'UnexpectedIssuer',
      audience: JWT_CONFIG.audience,
      expiresIn: '5m',
    }
  );

  const response = await fetch(server.url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  assert.equal(response.status, 401);
  assert.equal((await response.json()).code, 'AUTH_TOKEN_INVALID');
});

test('returns CLIENTE_NOT_PROVISIONED when the JWT user has no Cliente', async (t) => {
  const server = await startTestServer(async () => null);
  t.after(server.close);

  const response = await fetch(server.url, {
    headers: { Authorization: `Bearer ${createToken('missing-user')}` },
  });

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), {
    success: false,
    code: 'CLIENTE_NOT_PROVISIONED',
    message: 'El usuario autenticado no tiene un cliente vinculado',
  });
});
