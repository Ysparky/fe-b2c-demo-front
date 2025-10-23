import { BaseComponent } from '@core/base/BaseComponent';
import './SuccessScreen.css';

export interface SuccessScreenOptions {
  title: string;
  message: string;
  buttonText?: string;
  onContinue?: () => void;
}

export class SuccessScreen extends BaseComponent {
  private options: SuccessScreenOptions;

  constructor(
    private container: HTMLElement,
    options: SuccessScreenOptions
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
   * Renderiza la pantalla de éxito
   */
  private render(): void {
    const html = `
      <div class="success-screen">
        <div class="success-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="40" fill="#10B981" opacity="0.1"/>
            <circle cx="40" cy="40" r="32" fill="#10B981" opacity="0.2"/>
            <path d="M25 40L35 50L55 30" stroke="#10B981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="success-title">${this.options.title}</h1>
        <p class="success-message">${this.options.message}</p>
        ${this.options.buttonText ? `
          <button type="button" class="btn btn-primary btn-lg success-button">
            ${this.options.buttonText}
          </button>
        ` : ''}
      </div>
    `;

    this.container.innerHTML = html;
  }

  /**
   * Adjunta event listeners
   */
  private attachEvents(): void {
    if (this.options.buttonText && this.options.onContinue) {
      const button = this.container.querySelector('.success-button') as HTMLButtonElement;
      if (button) {
        this.addEventListener(button, 'click', () => {
          this.options.onContinue?.();
        });
      }
    }
  }

  getValue(): any {
    return null;
  }

  setValue(value: any): void {
    // No aplicable
  }
}
