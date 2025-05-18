interface RegisterForm {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  export function validateRegister(form: RegisterForm): string | null {
    const { name, email, password, confirmPassword } = form;
  
    if (!name || !email || !password || !confirmPassword)
      return 'Por favor, completa todos los campos.';
  
    if (!email.includes('@')) return 'Correo inválido.';
  
    if (password.length < 6)
      return 'La contraseña debe tener al menos 6 caracteres.';
  
    if (password !== confirmPassword)
      return 'Las contraseñas no coinciden.';
  
    return null;
  }
  