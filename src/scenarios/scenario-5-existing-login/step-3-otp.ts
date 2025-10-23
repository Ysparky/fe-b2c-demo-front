import { BaseUI } from '@core/base/BaseUI';
import { OTPInput } from '@components/OTPInput/OTPInput';
import StorageService from '@core/services/StorageService';
import B2CService from '@core/services/B2CService';

class Step3OTPUI extends BaseUI {
  private otpInput!: OTPInput;
  private continueBtn!: HTMLButtonElement;
  private backBtn!: HTMLButtonElement;
  private resendBtn!: HTMLButtonElement;
  private timerElement!: HTMLElement;
  private timerInterval: number | null = null;
  private remainingSeconds: number = 177; // 2:57

  constructor(container: HTMLElement) {
    super(container);
  }

  render(): void {
    this.initComponents();
    this.attachEvents();
    this.startTimer();
  }

  /**
   * Inicializa los componentes
   */
  private initComponents(): void {
    const otpContainer = this.getElement<HTMLElement>('#otpInput');
    this.otpInput = new OTPInput(otpContainer);

    this.continueBtn = this.getElement<HTMLButtonElement>('#continueBtn');
    this.backBtn = this.getElement<HTMLButtonElement>('#backBtn');
    this.resendBtn = this.getElement<HTMLButtonElement>('#resendBtn');
    this.timerElement = this.getElement<HTMLElement>('#timer');

    // Focus en el primer input
    setTimeout(() => {
      this.otpInput.focus();
    }, 300);
  }

  /**
   * Adjunta event listeners
   */
  private attachEvents(): void {
    // Cuando se complete el OTP
    this.otpInput.on('otp:complete', (code: string) => {
      console.log('OTP completed:', code);
      this.enable(this.continueBtn);
    });

    // Botón continuar
    this.addEventListener(this.continueBtn, 'click', () => {
      this.handleContinue();
    });

    // Botón regresar
    this.addEventListener(this.backBtn, 'click', () => {
      window.history.back();
    });

    // Botón reenviar
    this.addEventListener(this.resendBtn, 'click', () => {
      this.handleResend();
    });
  }

  /**
   * Inicia el timer
   */
  private startTimer(): void {
    this.timerInterval = window.setInterval(() => {
      this.remainingSeconds--;

      if (this.remainingSeconds <= 0) {
        this.stopTimer();
        this.handleTimerExpired();
        return;
      }

      this.updateTimerDisplay();
    }, 1000);
  }

  /**
   * Detiene el timer
   */
  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Actualiza la visualización del timer
   */
  private updateTimerDisplay(): void {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    this.timerElement.textContent = display;
  }

  /**
   * Maneja la expiración del timer
   */
  private handleTimerExpired(): void {
    this.timerElement.textContent = '00:00';
    this.timerElement.style.color = 'var(--color-error)';
    this.otpInput.disable();
    this.disable(this.continueBtn);
    this.enable(this.resendBtn);
  }

  /**
   * Maneja el reenvío del código
   */
  private handleResend(): void {
    console.log('Resending OTP...');
    
    // Resetear
    this.otpInput.reset();
    this.otpInput.enable();
    this.remainingSeconds = 177;
    this.timerElement.style.color = '';
    this.disable(this.resendBtn);
    this.disable(this.continueBtn);
    
    // Reiniciar timer
    this.startTimer();
    this.updateTimerDisplay();
  }

  /**
   * Maneja el click en continuar
   */
  private async handleContinue(): Promise<void> {
    const code = this.otpInput.getValue();
    
    if (code.length !== 6) {
      alert('Por favor ingresa el código completo');
      return;
    }

    // Validar código
    const isValid = await this.otpInput.isValid();
    if (!isValid) {
      alert('Código inválido');
      return;
    }

    // Guardar código
    B2CService.setClaim('extension_otpCode', code);

    console.log('OTP verified:', code);

    // Detener timer
    this.stopTimer();

    // Redirigir al siguiente paso
    if (import.meta.env.DEV) {
      setTimeout(() => {
        window.location.href = './step-4-loading.html';
      }, 500);
    }
  }

  /**
   * Limpieza al destruir
   */
  destroy(): void {
    this.stopTimer();
    super.destroy();
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.otp-container') as HTMLElement;
  if (container) {
    const ui = new Step3OTPUI(container);
    ui.render();
  }
});
