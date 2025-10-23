import { BaseComponent } from '@core/base/BaseComponent';
import { ValidationService } from '@core/services/ValidationService';
import './DocumentInput.css';

export type DocumentType = 'DNI' | 'CE';

interface DocumentConfig {
  maxLength: string;
  inputMode: 'numeric' | 'text';
  placeholder: string;
}

const DOCUMENT_CONFIGS: Record<DocumentType, DocumentConfig> = {
  DNI: {
    maxLength: '8',
    inputMode: 'numeric',
    placeholder: 'Ingresa tu DNI',
  },
  CE: {
    maxLength: '9',
    inputMode: 'numeric',
    placeholder: 'Ingresa tu Carnet de Extranjería',
  },
};

export class DocumentInput extends BaseComponent {
  private documentType: DocumentType = 'DNI';

  constructor(
    private input: HTMLInputElement,
    private select: HTMLSelectElement
  ) {
    super();
    this.init();
  }

  protected init(): void {
    this.documentType = this.select.value as DocumentType;
    this.applyConfig();
    this.attachEvents();
  }

  /**
   * Aplica la configuración según el tipo de documento
   */
  private applyConfig(): void {
    const config = DOCUMENT_CONFIGS[this.documentType];
    
    this.input.setAttribute('maxlength', config.maxLength);
    this.input.setAttribute('inputmode', config.inputMode);
    this.input.placeholder = config.placeholder;
    
    // Agregar clases CSS
    this.input.classList.add('document-input');
    this.select.classList.add('document-select');
  }

  /**
   * Adjunta event listeners
   */
  private attachEvents(): void {
    // Cambio de tipo de documento
    this.addEventListener(this.select, 'change', () => {
      this.handleTypeChange();
    });

    // Input de documento
    this.addEventListener(this.input, 'input', () => {
      this.handleInput();
    });

    // Validación al perder foco
    this.addEventListener(this.input, 'blur', () => {
      this.validateInput();
    });
  }

  /**
   * Maneja el cambio de tipo de documento
   */
  private handleTypeChange(): void {
    this.documentType = this.select.value as DocumentType;
    this.input.value = '';
    this.applyConfig();
    this.clearError();
  }

  /**
   * Maneja el input del usuario
   */
  private handleInput(): void {
    // Sanitizar: solo números
    this.input.value = this.input.value.replace(/[^0-9]/g, '');
    
    // Validar en tiempo real si alcanzó la longitud máxima
    const config = DOCUMENT_CONFIGS[this.documentType];
    if (this.input.value.length === parseInt(config.maxLength)) {
      this.validateInput();
    } else {
      this.clearError();
    }
  }

  /**
   * Valida el input
   */
  private async validateInput(): Promise<boolean> {
    const result = await ValidationService.validateDocument(
      this.documentType,
      this.input.value
    );

    if (!result.valid && result.error) {
      this.showError(result.error);
      return false;
    }

    this.clearError();
    return true;
  }

  /**
   * Muestra un error
   */
  private showError(message: string): void {
    this.input.classList.add('error');
    
    // Buscar o crear contenedor de error
    let errorContainer = this.input.parentElement?.querySelector('.form-error');
    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.className = 'form-error';
      this.input.parentElement?.appendChild(errorContainer);
    }

    errorContainer.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 13H7v-2h2v2zm0-3H7V4h2v6z"/>
      </svg>
      <span>${message}</span>
    `;
  }

  /**
   * Limpia el error
   */
  private clearError(): void {
    this.input.classList.remove('error');
    const errorContainer = this.input.parentElement?.querySelector('.form-error');
    if (errorContainer) {
      errorContainer.remove();
    }
  }

  /**
   * Obtiene el valor del documento
   */
  getValue(): { type: DocumentType; number: string } {
    return {
      type: this.documentType,
      number: this.input.value,
    };
  }

  /**
   * Establece el valor del documento
   */
  setValue(value: { type?: DocumentType; number: string }): void {
    if (value.type) {
      this.select.value = value.type;
      this.documentType = value.type;
      this.applyConfig();
    }
    this.input.value = value.number;
  }

  /**
   * Valida el componente
   */
  async isValid(): Promise<boolean> {
    return this.validateInput();
  }

  /**
   * Habilita el componente
   */
  enable(): void {
    this.input.disabled = false;
    this.select.disabled = false;
  }

  /**
   * Deshabilita el componente
   */
  disable(): void {
    this.input.disabled = true;
    this.select.disabled = true;
  }

  /**
   * Resetea el componente
   */
  reset(): void {
    this.input.value = '';
    this.select.value = 'DNI';
    this.documentType = 'DNI';
    this.applyConfig();
    this.clearError();
  }
}
