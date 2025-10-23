import { BaseComponent } from '@core/base/BaseComponent';
import './LoadingSpinner.css';

export interface LoadingSpinnerOptions {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export class LoadingSpinner extends BaseComponent {
  private message: string;
  private size: 'sm' | 'md' | 'lg';

  constructor(
    private container: HTMLElement,
    options: LoadingSpinnerOptions = {}
  ) {
    super();
    this.message = options.message || 'Cargando...';
    this.size = options.size || 'md';
    this.init();
  }

  protected init(): void {
    this.render();
  }

  /**
   * Renderiza el spinner
   */
  private render(): void {
    const html = `
      <div class="loading-spinner-container">
        <div class="spinner spinner-${this.size}"></div>
        ${this.message ? `<p class="loading-message">${this.message}</p>` : ''}
      </div>
    `;

    this.container.innerHTML = html;
  }

  /**
   * Actualiza el mensaje
   */
  setMessage(message: string): void {
    this.message = message;
    const messageEl = this.container.querySelector('.loading-message');
    if (messageEl) {
      messageEl.textContent = message;
    }
  }

  /**
   * Muestra el spinner
   */
  show(): void {
    this.container.classList.remove('hidden');
  }

  /**
   * Oculta el spinner
   */
  hide(): void {
    this.container.classList.add('hidden');
  }

  getValue(): any {
    return null;
  }

  setValue(value: any): void {
    // No aplicable
  }
}
