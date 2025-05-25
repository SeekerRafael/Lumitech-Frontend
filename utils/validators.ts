const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
export interface PasswordResetErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export function validatePasswordReset(
  newPassword: string,
  confirmPassword: string
): PasswordResetErrors {
  const errors: PasswordResetErrors = {};

  if (!newPassword.trim()) {
    errors.newPassword = "Por favor ingresa una nueva contraseña";
  } else if (newPassword.length < 8) {
    errors.newPassword = "La contraseña debe tener al menos 8 caracteres";
  } else if (!passwordRegex.test(newPassword)) {
    errors.newPassword =
      "La contraseña debe incluir mayúsculas, minúsculas, números y símbolos";
  }

  if (!confirmPassword.trim()) {
    errors.confirmPassword = "Por favor confirma tu nueva contraseña";
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden";
  }

  return errors;
}

export const isValidEmail = (email: string): boolean =>
  /\S+@\S+\.\S+/.test(email);

export const isUUID = (val: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    val
  );

export interface EmailValidationErrors {
  email?: string;
}

export interface TokenValidationErrors {
  token?: string;
}

export function validateEmail(email: string): EmailValidationErrors {
  const errors: EmailValidationErrors = {};

  if (!email.trim()) {
    errors.email = "Por favor ingresa tu correo electrónico";
  } else if (!isValidEmail(email)) {
    errors.email = "Ingresa un correo válido";
  }

  return errors;
}

export function validateToken(token: string): TokenValidationErrors {
  const errors: TokenValidationErrors = {};

  if (!token.trim()) {
    errors.token = "Por favor ingresa el token de verificación";
  } else if (!isUUID(token)) {
    errors.token = "El token no es válido.";
  }

  return errors;
}











