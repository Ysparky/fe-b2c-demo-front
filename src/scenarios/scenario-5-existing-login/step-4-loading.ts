import { BaseUI } from '@core/base/BaseUI';
import { LoadingSpinner } from '@components/LoadingSpinner/LoadingSpinner';

class Step4LoadingUI extends BaseUI {
  private loadingSpinner!: LoadingSpinner;

  constructor(container: HTMLElement) {
    super(container);
  }

  render(): void {
    this.initComponents();
    this.simulateLoading();
  }

  /**
   * Inicializa los componentes
   */
  private initComponents(): void {
    const spinnerContainer = this.getElement<HTMLElement>('#loadingSpinner');
    
    this.loadingSpinner = new LoadingSpinner(spinnerContainer, {
      message: 'Un momento, por favor',
      size: 'lg',
    });
  }

  /**
   * Simula el proceso de carga
   */
  private simulateLoading(): void {
    // Cambiar mensaje después de 2 segundos
    setTimeout(() => {
      this.loadingSpinner.setMessage('Estamos preparando todo para ti');
    }, 2000);

    // En producción, B2C redirigirá automáticamente
    // Para desarrollo, simulamos la redirección
    if (import.meta.env.DEV) {
      setTimeout(() => {
        console.log('Login completed! Redirecting to application...');
        // window.location.href = 'https://your-app.com/dashboard';
        alert('¡Login exitoso! En producción, serías redirigido a la aplicación.');
      }, 4000);
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.loading-container') as HTMLElement;
  if (container) {
    const ui = new Step4LoadingUI(container);
    ui.render();
  }
});
