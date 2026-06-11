import test from "node:test";
import assert from "node:assert/strict";
import {
  getRegistrationErrorMessage,
  validateRegistration,
} from "../src/features/auth/registration.validation.js";
import { createRegistrationFormData } from "../src/features/auth/registration.contract.js";
import { getAuthenticatedHome } from "../src/features/auth/auth.navigation.js";

const validRegistration = {
  name: "Ana",
  surname: "Lopez",
  username: "ana.lopez",
  email: "ana@example.com",
  phone: "55551234",
  password: "Segura123",
  confirmPassword: "Segura123",
  profilePicture: null,
};

test("accepts a valid registration", () => {
  assert.deepEqual(validateRegistration(validRegistration), {});
});

test("rejects an invalid password and password mismatch", () => {
  const errors = validateRegistration({
    ...validRegistration,
    password: "debil",
    confirmPassword: "otra",
  });

  assert.match(errors.password, /8 caracteres/);
  assert.match(errors.confirmPassword, /no coinciden/);
});

test("rejects invalid email, username, and phone values", () => {
  const errors = validateRegistration({
    ...validRegistration,
    username: "a",
    email: "correo-invalido",
    phone: "123",
  });

  assert.ok(errors.username);
  assert.ok(errors.email);
  assert.ok(errors.phone);
});

test("maps duplicate email and username server codes", () => {
  assert.match(
    getRegistrationErrorMessage({ errorCode: "EMAIL_ALREADY_EXISTS" }),
    /correo electronico/,
  );
  assert.match(
    getRegistrationErrorMessage({ errorCode: "USERNAME_ALREADY_EXISTS" }),
    /usuario/,
  );
});

test("uses the first ASP.NET validation message", () => {
  const message = getRegistrationErrorMessage({
    errors: { Password: ["The Password field must be at least 8 characters."] },
  });

  assert.equal(message, "The Password field must be at least 8 characters.");
});

test("builds the exact .NET registration form contract", () => {
  const formData = createRegistrationFormData(validRegistration);

  assert.deepEqual(
    [...formData.keys()],
    ["name", "surname", "username", "email", "password", "phone"],
  );
  assert.equal(formData.get("confirmPassword"), null);
});

test("redirects authenticated users to the correct home", () => {
  assert.equal(getAuthenticatedHome("ADMIN_ROLE"), "/dashboard");
  assert.equal(getAuthenticatedHome("USER_ROLE"), "/home");
});
