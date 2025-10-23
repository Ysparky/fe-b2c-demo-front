import { BaseComponent } from '@core/base/BaseComponent';
import './MFASelection.css';

export type MFAMethod = 'email' | 'sms';

export interface MFAOption {
  method: MFAMethod;
  label: string;
  value: string; // Email parcialmente oculto o teléfono
}

export class MFASelection extends BaseComponent {
  private selectedMethod: MFAMethod | null = null;
  private options: MFAOption[] = [];

  constructor(
    private container: HTMLElement,
    options: MFAOption[]
  ) {
    super();
    this.options = options;
    this.init();
  }

  protected init(): void {
    this.render();
    this.attachEvents();
  }

  /**
   * Renderiza las opciones de MFA
   */
  private render(): void {
    const html = `
      <div class="mfa-selection">
        <div class="mfa-options">
          ${this.options.map((option, index) => this.renderOption(option, index)).join('')}
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }

  /**
   * Renderiza una opción de MFA
   */
  private renderOption(option: MFAOption, index: number): string {
    const icon = option.method === 'email' ? this.getEmailIcon() : this.getSMSIcon();
    const label = option.method === 'email' ? 'Enviar mail a' : 'Enviar SMS a';

    return `
      <label class="mfa-option" data-method="${option.method}">
        <input 
          type="radio" 
          name="mfa-method" 
          value="${option.method}"
          id="mfa-${option.method}"
          ${index === 0 ? 'checked' : ''}
        />
        <div class="mfa-option-content">
          <div class="mfa-option-icon">${icon}</div>
          <div class="mfa-option-text">
            <div class="mfa-option-label">${label}</div>
            <div class="mfa-option-value">${option.value}</div>
          </div>
        </div>
      </label>
    `;
  }

  /**
   * Adjunta event listeners
   */
  private attachEvents(): void {
    const radios = this.container.querySelectorAll<HTMLInputElement>('input[name="mfa-method"]');
    
    radios.forEach((radio) => {
      this.addEventListener(radio, 'change', () => {
        this.selectedMethod = radio.value as MFAMethod;
        this.emit('mfa:change', this.selectedMethod);
      });
    });

    // Seleccionar el primero por defecto
    if (radios.length > 0 && radios[0]) {
      this.selectedMethod = radios[0].value as MFAMethod;
    }
  }

  /**
   * Obtiene el método seleccionado
   */
  getValue(): MFAMethod | null {
    return this.selectedMethod;
  }

  /**
   * Establece el método seleccionado
   */
  setValue(method: MFAMethod): void {
    const radio = this.container.querySelector<HTMLInputElement>(
      `input[value="${method}"]`
    );
    if (radio) {
      radio.checked = true;
      this.selectedMethod = method;
    }
  }

  /**
   * Valida que se haya seleccionado un método
   */
  async isValid(): Promise<boolean> {
    return this.selectedMethod !== null;
  }

  /**
   * Ícono de email
   */
  private getEmailIcon(): string {
    return `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    `;
  }

  /**
   * Ícono de SMS
   */
  private getSMSIcon(): string {
    return `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    `;
  }
}
