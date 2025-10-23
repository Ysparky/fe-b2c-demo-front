import * as yup from 'yup';

/**
 * ValidationService - Servicio centralizado para validaciones
 * 
 * Proporciona:
 * - Validación con Yup
 * - Schemas reutilizables
 * - Mensajes de error personalizados
 */

// Configurar mensajes en español
yup.setLocale({
  mixed: {
    required: 'Este campo es obligatorio',
    notType: 'Formato inválido',
  },
  string: {
    email: 'Ingresa un correo electrónico válido',
    min: 'Debe tener al menos ${min} caracteres',
    max: 'Debe tener máximo ${max} caracteres',
    length: 'Debe tener exactamente ${length} caracteres',
  },
  number: {
    min: 'Debe ser mayor o igual a ${min}',
    max: 'Debe ser menor o igual a ${max}',
  },
});

export class ValidationService {
  /**
   * Schemas comunes reutilizables
   */
  static schemas = {
    // DNI: 8 dígitos numéricos
    dni: yup
      .string()
      .required()
      .matches(/^\d{8}$/, 'El DNI debe tener 8 dígitos'),

    // Carnet de Extranjería: 9 dígitos
    ce: yup
      .string()
      .required()
      .matches(/^\d{9}$/, 'El CE debe tener 9 dígitos'),

    // Email
    email: yup
      .string()
      .required()
      .email(),

    // Contraseña con requisitos
    password: yup
      .string()
      .required()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .matches(/[0-9]/, 'Debe contener al menos un número')
      .matches(/[a-z]/, 'Debe contener al menos una letra minúscula')
      .matches(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Debe contener al menos un símbolo'
      ),

    // Confirmación de contraseña
    passwordConfirm: (fieldName: string = 'password') =>
      yup
        .string()
        .required()
        .oneOf([yup.ref(fieldName)], 'Las contraseñas no coinciden'),

    // Código OTP: 6 dígitos
    otp: yup
      .string()
      .required()
      .matches(/^\d{6}$/, 'El código debe tener 6 dígitos'),

    // Teléfono: 9 dígitos
    phone: yup
      .string()
      .required()
      .matches(/^9\d{8}$/, 'Ingresa un número de celular válido'),

    // Póliza/Contrato
    policy: yup
      .string()
      .required()
      .min(5, 'Ingresa un número de póliza válido'),

    // Términos y condiciones
    terms: yup
      .boolean()
      .required()
      .oneOf([true], 'Debes aceptar los términos y condiciones'),
  };

  /**
   * Valida un valor contra un schema
   */
  static async validate<T>(
    schema: yup.Schema<T>,
    value: any
  ): Promise<{ valid: boolean; errors?: string[] }> {
    try {
      await schema.validate(value, { abortEarly: false });
      return { valid: true };
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        return {
          valid: false,
          errors: err.errors,
        };
      }
      return { valid: false, errors: ['Error de validación'] };
    }
  }

  /**
   * Valida múltiples campos
   */
  static async validateFields<T extends Record<string, any>>(
    schema: yup.ObjectSchema<any>,
    values: T
  ): Promise<{
    valid: boolean;
    errors?: Record<string, string>;
  }> {
    try {
      await schema.validate(values, { abortEarly: false });
      return { valid: true };
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
        return { valid: false, errors };
      }
      return { valid: false };
    }
  }

  /**
   * Crea un schema para documento (DNI o CE)
   */
  static createDocumentSchema(documentType: 'DNI' | 'CE') {
    return documentType === 'DNI' ? this.schemas.dni : this.schemas.ce;
  }

  /**
   * Valida un documento según su tipo
   */
  static async validateDocument(
    documentType: 'DNI' | 'CE',
    value: string
  ): Promise<{ valid: boolean; error?: string }> {
    const schema = this.createDocumentSchema(documentType);
    const result = await this.validate(schema, value);
    
    return {
      valid: result.valid,
      error: result.errors?.[0],
    };
  }

  /**
   * Valida una contraseña
   */
  static async validatePassword(
    password: string
  ): Promise<{ valid: boolean; errors?: string[] }> {
    return this.validate(this.schemas.password, password);
  }

  /**
   * Valida código OTP
   */
  static async validateOTP(
    otp: string
  ): Promise<{ valid: boolean; error?: string }> {
    const result = await this.validate(this.schemas.otp, otp);
    return {
      valid: result.valid,
      error: result.errors?.[0],
    };
  }
}

export default ValidationService;
