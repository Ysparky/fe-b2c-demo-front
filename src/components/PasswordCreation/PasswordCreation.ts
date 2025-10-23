import { BaseComponent } from '@core/base/BaseComponent';
import { PasswordField } from '@components/PasswordField/PasswordField';
import { ValidationService } from '@core/services/ValidationService';
import './PasswordCreation.css';

interface PasswordRequirement {
  id: string;
  label: string;
  validator: (password: string) => boolean;
  met: boolean;
}

export class PasswordCreation extends BaseComponent {
  private passwordField!: PasswordField;
  private confirmPasswordField!: PasswordField;
  private requirements: PasswordRequirement[] = [];
  private requirementsContainer!: HTMLElement;

  constructor(
    private passwordInput: HTMLInputElement,
    private confirmPasswordInput: HTMLInputElement,
    private requirementsContainerId: string
  ) {
    super();
    this.init();
  }

  protected init(): void {
    this.passwordField = new PasswordField(this.passwordInput);
    this.confirmPasswordField = new PasswordField(this.confirmPasswordInput);
    
    this.requirementsContainer = document.getElementById(this.requirementsContainerId)!;
    
    this.initRequirements();
    this.renderRequirements();
    this.attachEvents();
  }

  /**
   * Inicializa los requisitos de contraseña
   */
  private initRequirements(): void {
    this.requirements = [
      {
        id: 'length',
        label: 'Debe tener al menos 8 caracteres.',
        validator: (pwd) => pwd.length >= 8,
        met: false,
      },
      {
        id: 'number',
        label: 'Debe tener al menos un número.',
        validator: (pwd) => /[0-9]/.test(pwd),
        met: false,
      },
      {
        id: 'lowercase',
        label: 'Debe tener al menos una letra minúscula.',
        validator: (pwd) => /[a-z]/.test(pwd),
        met: false,
      },
      {
        id: 'uppercase',
        label: 'Debe tener al menos una letra mayúscula.',
        validator: (pwd) => /[A-Z]/.test(pwd),
        met: false,
      },
      {
        id: 'symbol',
        label: 'Debe tener al menos un símbolo.',
        validator: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
        met: false,
      },
    ];
  }

  /**
   * Renderiza los requisitos
   */
  private renderRequirements(): void {
    const html = `
      <ul class="password-requirements">
        ${this.requirements.map((req) => `
          <li class="password-requirement" data-requirement="${req.id}">
            <svg class="requirement-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path class="icon-unchecked" d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z"/>
              <path class="icon-checked" d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm-1.7 11.3L3 8l1.4-1.4 2 2 4.3-4.3L12 5.7l-5.7 5.6z" style="display: none;"/>
            </svg>
            <span>${req.label}</span>
          </li>
        `).join('')}
      </ul>
    `;

    this.requirementsContainer.innerHTML = html;
  }

  /**
   * Adjunta event listeners
   */
  private attachEvents(): void {
    // Validar en tiempo real mientras escribe
    this.passwordField.on('password:change', (password: string) => {
      this.validatePassword(password);
    });

    // Validar confirmación
    this.addEventListener(this.confirmPasswordInput, 'input', () => {
      this.validateConfirmation();
    });

    this.addEventListener(this.confirmPasswordInput, 'blur', () => {
      this.validateConfirmation();
    });
  }

  /**
   * Valida la contraseña contra los requisitos
   */
  private validatePassword(password: string): void {
    this.requirements.forEach((req) => {
      req.met = req.validator(password);
      this.updateRequirementUI(req);
    });

    this.emit('password:validation', {
      valid: this.areAllRequirementsMet(),
      requirements: this.requirements,
    });
  }

  /**
   * Actualiza la UI de un requisito
   */
  private updateRequirementUI(requirement: PasswordRequirement): void {
    const element = this.requirementsContainer.querySelector(
      `[data-requirement="${requirement.id}"]`
    );

    if (!element) return;

    if (requirement.met) {
      element.classList.add('met');
      element.querySelector('.icon-unchecked')?.setAttribute('style', 'display: none;');
      element.querySelector('.icon-checked')?.setAttribute('style', 'display: block;');
    } else {
      element.classList.remove('met');
      element.querySelector('.icon-unchecked')?.setAttribute('style', 'display: block;');
      element.querySelector('.icon-checked')?.setAttribute('style', 'display: none;');
    }
  }

  /**
   * Valida que las contraseñas coincidan
   */
  private validateConfirmation(): void {
    const password = this.passwordField.getValue();
    const confirm = this.confirmPasswordField.getValue();

    if (!confirm) {
      this.clearConfirmError();
      return;
    }

    if (password !== confirm) {
      this.showConfirmError('Las contraseñas no coinciden');
    } else {
      this.clearConfirmError();
    }
  }

  /**
   * Muestra error en confirmación
   */
  private showConfirmError(message: string): void {
    this.confirmPasswordInput.classList.add('error');
    
    let errorContainer = this.confirmPasswordInput.parentElement?.querySelector('.form-error');
    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.className = 'form-error';
      this.confirmPasswordInput.parentElement?.appendChild(errorContainer);
    }

    errorContainer.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 13H7v-2h2v2zm0-3H7V4h2v6z"/>
      </svg>
      <span>${message}</span>
    `;
  }

  /**
   * Limpia error de confirmación
   */
  private clearConfirmError(): void {
    this.confirmPasswordInput.classList.remove('error');
    const errorContainer = this.confirmPasswordInput.parentElement?.querySelector('.form-error');
    if (errorContainer) {
      errorContainer.remove();
    }
  }

  /**
   * Verifica si todos los requisitos se cumplen
   */
  private areAllRequirementsMet(): boolean {
    return this.requirements.every((req) => req.met);
  }

  /**
   * Valida el componente completo
   */
  async isValid(): Promise<boolean> {
    const password = this.passwordField.getValue();
    const confirm = this.confirmPasswordField.getValue();

    // Validar requisitos
    if (!this.areAllRequirementsMet()) {
      return false;
    }

    // Validar coincidencia
    if (password !== confirm) {
      this.showConfirmError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  }

  /**
   * Obtiene el valor de la contraseña
   */
  getValue(): string {
    return this.passwordField.getValue();
  }

  /**
   * Establece el valor
   */
  setValue(value: string): void {
    this.passwordField.setValue(value);
    this.confirmPasswordField.setValue(value);
  }

  /**
   * Resetea el componente
   */
  reset(): void {
    this.passwordField.reset();
    this.confirmPasswordField.reset();
    this.requirements.forEach((req) => {
      req.met = false;
      this.updateRequirementUI(req);
    });
    this.clearConfirmError();
  }
}
