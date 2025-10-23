import * as yup from 'yup';

/**
 * BaseForm - Clase base para manejo de formularios con validación
 * 
 * Proporciona:
 * - Validación con Yup
 * - Manejo de errores
 * - Serialización de datos
 * - Estados de formulario
 */
export abstract class BaseForm<T extends Record<string, any>> {
  protected schema: yup.ObjectSchema<any>;
  protected errors: Map<string, string> = new Map();
  protected touched: Set<string> = new Set();

  constructor(schema: yup.ObjectSchema<any>) {
    this.schema = schema;
  }

  /**
   * Obtiene los valores del formulario
   */
  abstract getValues(): T;

  /**
   * Valida el formulario completo
   */
  async validate(): Promise<boolean> {
    try {
      await this.schema.validate(this.getValues(), { abortEarly: false });
      this.clearErrors();
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        this.handleValidationErrors(err);
      }
      return false;
    }
  }

  /**
   * Valida un campo específico
   */
  async validateField(fieldName: keyof T): Promise<boolean> {
    try {
      const fieldSchema = this.schema.fields[fieldName as string];
      if (!fieldSchema) return true;

      const values = this.getValues();
      await fieldSchema.validate(values[fieldName]);
      
      this.clearFieldError(fieldName as string);
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        this.setFieldError(fieldName as string, err.message);
      }
      return false;
    }
  }

  /**
   * Maneja errores de validación de Yup
   */
  protected handleValidationErrors(err: yup.ValidationError): void {
    this.clearErrors();
    
    err.inner.forEach((error) => {
      if (error.path) {
        this.setFieldError(error.path, error.message);
      }
    });
  }

  /**
   * Establece un error para un campo
   */
  protected setFieldError(fieldName: string, message: string): void {
    this.errors.set(fieldName, message);
    this.displayFieldError(fieldName, message);
  }

  /**
   * Limpia el error de un campo
   */
  protected clearFieldError(fieldName: string): void {
    this.errors.delete(fieldName);
    this.hideFieldError(fieldName);
  }

  /**
   * Limpia todos los errores
   */
  protected clearErrors(): void {
    this.errors.forEach((_, fieldName) => {
      this.hideFieldError(fieldName);
    });
    this.errors.clear();
  }

  /**
   * Muestra el error de un campo en el DOM
   */
  protected displayFieldError(fieldName: string, message: string): void {
    const input = document.getElementById(fieldName);
    const errorContainer = document.getElementById(`${fieldName}_error`);

    if (input) {
      input.classList.add('error');
    }

    if (errorContainer) {
      errorContainer.innerHTML = `
        <p class="form-error">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 13H7v-2h2v2zm0-3H7V4h2v6z"/>
          </svg>
          <span>${message}</span>
        </p>
      `;
    }
  }

  /**
   * Oculta el error de un campo
   */
  protected hideFieldError(fieldName: string): void {
    const input = document.getElementById(fieldName);
    const errorContainer = document.getElementById(`${fieldName}_error`);

    if (input) {
      input.classList.remove('error');
    }

    if (errorContainer) {
      errorContainer.innerHTML = '';
    }
  }

  /**
   * Marca un campo como tocado
   */
  markAsTouched(fieldName: keyof T): void {
    this.touched.add(fieldName as string);
  }

  /**
   * Verifica si un campo ha sido tocado
   */
  isTouched(fieldName: keyof T): boolean {
    return this.touched.has(fieldName as string);
  }

  /**
   * Obtiene el error de un campo
   */
  getFieldError(fieldName: keyof T): string | undefined {
    return this.errors.get(fieldName as string);
  }

  /**
   * Verifica si el formulario tiene errores
   */
  hasErrors(): boolean {
    return this.errors.size > 0;
  }

  /**
   * Verifica si el formulario es válido (sin validar)
   */
  isValid(): boolean {
    return !this.hasErrors();
  }

  /**
   * Resetea el formulario
   */
  reset(): void {
    this.clearErrors();
    this.touched.clear();
  }
}
