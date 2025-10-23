import { BaseUI } from '@core/base/BaseUI';
import { PasswordCreation } from '@components/PasswordCreation/PasswordCreation';
import B2CService from '@core/services/B2CService';

class Step4ExpiredUI extends BaseUI {
  private passwordCreation!: PasswordCreation;
  private continueBtn!: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
  }

  render(): void {
    this.initComponents();
    this.attachEvents();
  }

  /**
   * Inicializa los componentes
   */
  private initComponents(): void {
    const newPasswordInput = this.getElement<HTMLInputElement>('#newPassword');
    const confirmPasswordInput = this.getElement<HTMLInputElement>('#confirmPassword');

    this.passwordCreation = new PasswordCreation(
      newPasswordInput,
      confirmPasswordInput,
      'passwordRequirements'
    );

    this.continueBtn = this.getElement<HTMLButtonElement>('#continueBtn');
  }

  /**
   * Adjunta event listeners
   */
  private attachEvents(): void {
    // Escuchar validación de contraseña
    this.passwordCreation.on('password:validation', (data: any) => {
      if (data.valid) {
        this.enable(this.continueBtn);
      } else {
        this.disable(this.continueBtn);
      }
    });

    // Botón continuar
    this.addEventListener(this.continueBtn, 'click', () => {
      this.handleContinue();
    });
  }

  /**
   * Maneja el click en continuar
   */
  private async handleContinue(): Promise<void> {
    const isValid = await this.passwordCreation.isValid();

    if (!isValid) {
      return;
    }

    const password = this.passwordCreation.getValue();

    // Guardar en claims de B2C
    B2CService.setClaim('extension_newPassword', password);

    console.log('New password set');

    // Redirigir al siguiente paso
    if (import.meta.env.DEV) {
      setTimeout(() => {
        window.location.href = './step-5-success.html';
      }, 500);
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.expired-container') as HTMLElement;
  if (container) {
    const ui = new Step4ExpiredUI(container);
    ui.render();
  }
});
