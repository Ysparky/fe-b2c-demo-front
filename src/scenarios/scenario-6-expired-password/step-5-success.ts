import { BaseUI } from '@core/base/BaseUI';
import { SuccessScreen } from '@components/SuccessScreen/SuccessScreen';

class Step5SuccessUI extends BaseUI {
  private successScreen!: SuccessScreen;

  constructor(container: HTMLElement) {
    super(container);
  }

  render(): void {
    this.initComponents();
  }

  /**
   * Inicializa los componentes
   */
  private initComponents(): void {
    const successContainer = this.getElement<HTMLElement>('#successScreen');

    this.successScreen = new SuccessScreen(successContainer, {
      title: '¡Cambio de contraseña exitoso!',
      message: 'Ahora podrás ingresar a la Web Empresa y disfrutar de todas sus funcionalidades',
      buttonText: 'Continuar',
      onContinue: () => {
        this.handleContinue();
      },
    });
  }

  /**
   * Maneja el click en continuar
   */
  private handleContinue(): void {
    console.log('Password change completed! Redirecting to application...');
    
    // En producción, B2C redirigirá automáticamente
    if (import.meta.env.DEV) {
      alert('¡Cambio exitoso! En producción, serías redirigido a la aplicación.');
      // window.location.href = 'https://your-app.com/dashboard';
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.success-container') as HTMLElement;
  if (container) {
    const ui = new Step5SuccessUI(container);
    ui.render();
  }
});
