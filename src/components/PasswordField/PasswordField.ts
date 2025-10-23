import { BaseComponent } from '@core/base/BaseComponent';
import { ValidationService } from '@core/services/ValidationService';
import './PasswordField.css';

export class PasswordField extends BaseComponent {
  private isVisible: boolean = false;
  private toggleButton: HTMLButtonElement | null = null;

  constructor(private input: HTMLInputElement) {
    super();
    this.init();
  }

  protected init(): void {
    this.input.type = 'password';
    this.input.classList.add('password-input');
    this.createToggleButton();
    this.attachEvents();
  }

  /**
   * Crea el botón de toggle
   */
  private createToggleButton(): void {
    const wrapper = document.createElement('div');
    wrapper.className = 'password-field-wrapper';
    
    this.toggleButton = document.createElement('button');
    this.toggleButton.type = 'button';
    this.toggleButton.className = 'password-toggle';
    this.toggleButton.innerHTML = this.getEyeIcon(false);
    this.toggleButton.setAttribute('aria-label', 'Mostrar contraseña');

    // Envolver el input
    this.input.parentNode?.insertBefore(wrapper, this.input);
    wrapper.appendChild(this.input);
    wrapper.appendChild(this.toggleButton);
  }

  /**
   * Adjunta event listeners
   */
  private attachEvents(): void {
    if (this.toggleButton) {
      this.addEventListener(this.toggleButton, 'click', () => {
        this.toggleVisibility();
      });
    }

    this.addEventListener(this.input, 'input', () => {
      this.emit('password:change', this.input.value);
    });
  }

  /**
   * Alterna la visibilidad de la contraseña
   */
  private toggleVisibility(): void {
    this.isVisible = !this.isVisible;
    this.input.type = this.isVisible ? 'text' : 'password';
    
    if (this.toggleButton) {
      this.toggleButton.innerHTML = this.getEyeIcon(this.isVisible);
      this.toggleButton.setAttribute(
        'aria-label',
        this.isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'
      );
    }
  }

  /**
   * Obtiene el ícono del ojo
   */
  private getEyeIcon(visible: boolean): string {
    if (visible) {
      // Ojo tachado
      return `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      `;
    }
    // Ojo normal
    return `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    `;
  }

  /**
   * Valida la contraseña
   */
  async isValid(): Promise<boolean> {
    const result = await ValidationService.validatePassword(this.input.value);
    return result.valid;
  }

  /**
   * Obtiene el valor
   */
  getValue(): string {
    return this.input.value;
  }

  /**
   * Establece el valor
   */
  setValue(value: string): void {
    this.input.value = value;
  }

  /**
   * Habilita el campo
   */
  enable(): void {
    this.input.disabled = false;
    if (this.toggleButton) {
      this.toggleButton.disabled = false;
    }
  }

  /**
   * Deshabilita el campo
   */
  disable(): void {
    this.input.disabled = true;
    if (this.toggleButton) {
      this.toggleButton.disabled = true;
    }
  }

  /**
   * Resetea el campo
   */
  reset(): void {
    this.input.value = '';
    this.isVisible = false;
    this.input.type = 'password';
    if (this.toggleButton) {
      this.toggleButton.innerHTML = this.getEyeIcon(false);
    }
  }
}
