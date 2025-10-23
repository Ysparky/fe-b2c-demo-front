import { BaseComponent } from '@core/base/BaseComponent';
import { ValidationService } from '@core/services/ValidationService';
import './OTPInput.css';

export class OTPInput extends BaseComponent {
  private inputs: HTMLInputElement[] = [];
  private readonly length: number = 6;

  constructor(private container: HTMLElement) {
    super();
    this.init();
  }

  protected init(): void {
    this.render();
    this.attachEvents();
  }

  /**
   * Renderiza los 6 inputs de OTP
   */
  private render(): void {
    const html = `
      <div class="otp-input-container">
        ${Array.from({ length: this.length }, (_, i) => `
          <input
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="otp-input"
            data-index="${i}"
            id="otp-${i}"
            autocomplete="off"
          />
        `).join('')}
      </div>
    `;

    this.container.innerHTML = html;
    this.inputs = Array.from(
      this.container.querySelectorAll<HTMLInputElement>('.otp-input')
    );
  }

  /**
   * Adjunta event listeners
   */
  private attachEvents(): void {
    this.inputs.forEach((input, index) => {
      // Input
      this.addEventListener(input, 'input', (e) => {
        this.handleInput(e as InputEvent, index);
      });

      // Paste
      this.addEventListener(input, 'paste', (e) => {
        this.handlePaste(e as ClipboardEvent);
      });

      // Keydown (para backspace y flechas)
      this.addEventListener(input, 'keydown', (e) => {
        this.handleKeyDown(e as KeyboardEvent, index);
      });

      // Focus
      this.addEventListener(input, 'focus', () => {
        input.select();
      });
    });
  }

  /**
   * Maneja el input del usuario
   */
  private handleInput(e: InputEvent, index: number): void {
    const input = e.target as HTMLInputElement;
    const value = input.value;

    // Solo permitir números
    input.value = value.replace(/[^0-9]/g, '');

    // Si ingresó un número, ir al siguiente input
    if (input.value && index < this.length - 1) {
      this.inputs[index + 1]?.focus();
    }

    // Emitir evento si completó todos los dígitos
    if (this.isFilled()) {
      this.emit('otp:complete', this.getValue());
    }
  }

  /**
   * Maneja el pegado de código
   */
  private handlePaste(e: ClipboardEvent): void {
    e.preventDefault();
    const pastedData = e.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/[^0-9]/g, '').slice(0, this.length);

    digits.split('').forEach((digit, index) => {
      if (this.inputs[index]) {
        this.inputs[index]!.value = digit;
      }
    });

    // Focus en el último input lleno o el siguiente vacío
    const nextEmptyIndex = digits.length < this.length ? digits.length : this.length - 1;
    this.inputs[nextEmptyIndex]?.focus();

    // Emitir evento si completó
    if (this.isFilled()) {
      this.emit('otp:complete', this.getValue());
    }
  }

  /**
   * Maneja teclas especiales
   */
  private handleKeyDown(e: KeyboardEvent, index: number): void {
    const input = e.target as HTMLInputElement;

    // Backspace
    if (e.key === 'Backspace') {
      if (!input.value && index > 0) {
        this.inputs[index - 1]?.focus();
      }
    }

    // Flecha izquierda
    if (e.key === 'ArrowLeft' && index > 0) {
      this.inputs[index - 1]?.focus();
    }

    // Flecha derecha
    if (e.key === 'ArrowRight' && index < this.length - 1) {
      this.inputs[index + 1]?.focus();
    }
  }

  /**
   * Verifica si todos los inputs están llenos
   */
  private isFilled(): boolean {
    return this.inputs.every((input) => input.value.length === 1);
  }

  /**
   * Obtiene el código OTP completo
   */
  getValue(): string {
    return this.inputs.map((input) => input.value).join('');
  }

  /**
   * Establece el valor del OTP
   */
  setValue(value: string): void {
    const digits = value.slice(0, this.length).split('');
    digits.forEach((digit, index) => {
      if (this.inputs[index]) {
        this.inputs[index]!.value = digit;
      }
    });
  }

  /**
   * Valida el OTP
   */
  async isValid(): Promise<boolean> {
    if (!this.isFilled()) {
      return false;
    }

    const result = await ValidationService.validateOTP(this.getValue());
    return result.valid;
  }

  /**
   * Habilita los inputs
   */
  enable(): void {
    this.inputs.forEach((input) => {
      input.disabled = false;
    });
  }

  /**
   * Deshabilita los inputs
   */
  disable(): void {
    this.inputs.forEach((input) => {
      input.disabled = true;
    });
  }

  /**
   * Resetea los inputs
   */
  reset(): void {
    this.inputs.forEach((input) => {
      input.value = '';
    });
    this.inputs[0]?.focus();
  }

  /**
   * Focus en el primer input
   */
  focus(): void {
    this.inputs[0]?.focus();
  }
}
