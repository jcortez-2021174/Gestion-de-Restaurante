export const REGISTRATION_LIMITS = {
  usernameMinLength: 3,
  usernameMaxLength: 50,
  passwordMinLength: 8,
  phoneLength: 8,
  profilePictureMaxBytes: 5 * 1024 * 1024,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export const validateRegistration = (values) => {
  const errors = {};
  const name = values.name?.trim() || "";
  const surname = values.surname?.trim() || "";
  const username = values.username?.trim() || "";
  const email = values.email?.trim() || "";
  const phone = values.phone?.trim() || "";
  const password = values.password || "";
  const confirmPassword = values.confirmPassword || "";
  const profilePicture = values.profilePicture;

  if (!name) {
    errors.name = "El nombre es obligatorio.";
  } else if (name.length > 25) {
    errors.name = "El nombre no puede superar 25 caracteres.";
  }

  if (!surname) {
    errors.surname = "El apellido es obligatorio.";
  } else if (surname.length > 25) {
    errors.surname = "El apellido no puede superar 25 caracteres.";
  }

  if (!username) {
    errors.username = "El nombre de usuario es obligatorio.";
  } else if (username.length < REGISTRATION_LIMITS.usernameMinLength) {
    errors.username = "El usuario debe tener al menos 3 caracteres.";
  } else if (username.length > REGISTRATION_LIMITS.usernameMaxLength) {
    errors.username = "El usuario no puede superar 50 caracteres.";
  } else if (!USERNAME_PATTERN.test(username)) {
    errors.username = "Usa solo letras, numeros, puntos, guiones o guion bajo.";
  }

  if (!email) {
    errors.email = "El correo electronico es obligatorio.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Ingresa un correo electronico valido.";
  }

  if (!phone) {
    errors.phone = "El telefono es obligatorio.";
  } else if (!/^\d{8}$/.test(phone)) {
    errors.phone = "El telefono debe contener exactamente 8 digitos.";
  }

  if (!password) {
    errors.password = "La contrasena es obligatoria.";
  } else if (password.length < REGISTRATION_LIMITS.passwordMinLength) {
    errors.password = "La contrasena debe tener al menos 8 caracteres.";
  } else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    errors.password = "Incluye una mayuscula, una minuscula y un numero.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirma tu contrasena.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Las contrasenas no coinciden.";
  }

  if (profilePicture) {
    if (!ALLOWED_IMAGE_TYPES.has(profilePicture.type)) {
      errors.profilePicture = "La foto debe ser JPG, PNG o WebP.";
    } else if (profilePicture.size > REGISTRATION_LIMITS.profilePictureMaxBytes) {
      errors.profilePicture = "La foto no puede superar 5 MB.";
    }
  }

  return errors;
};

export const getRegistrationErrorMessage = (responseData = {}) => {
  const errorCode = responseData.errorCode;

  if (errorCode === "EMAIL_ALREADY_EXISTS") {
    return "Ya existe una cuenta con este correo electronico.";
  }

  if (errorCode === "USERNAME_ALREADY_EXISTS") {
    return "Este nombre de usuario ya esta en uso.";
  }

  if (errorCode === "INVALID_FILE_FORMAT" || errorCode === "FILE_TOO_LARGE") {
    return "La foto de perfil no cumple con el formato o tamano permitido.";
  }

  const validationErrors = responseData.errors;
  if (validationErrors && typeof validationErrors === "object") {
    const firstMessage = Object.values(validationErrors).flat().find(Boolean);
    if (firstMessage) return firstMessage;
  }

  return responseData.message || responseData.detail || "No fue posible crear la cuenta. Intenta de nuevo.";
};
