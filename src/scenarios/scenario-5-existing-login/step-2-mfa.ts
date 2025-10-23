import { BaseUI } from '@core/base/BaseUI';
import { MFASelection, MFAOption } from '@components/MFASelection/MFASelection';
import StorageService from '@core/services/StorageService';
import B2CService from '@core/services/B2CService';

class Step2MFAUI extends BaseUI {
  private mfaSelection!: MFASelection;
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
    const mfaContainer = this.getElement<HTMLElement>('#mfaOptions');
    
    // Opciones de MFA (en producción, estas vendrían de B2C)
    const options: MFAOption[] = [
      {
        method: 'email',
        label: 'Enviar mail a',
        value: 'ejem****@ejemplo.com',
      },
      {
        method: 'sms',
        label: 'Enviar SMS a',
        value: '*******198',
      },
    ];

    this.mfaSelection = new MFASelection(mfaContainer, options);
    this.continueBtn = this.getElement<HTMLButtonElement>('#continueBtn');
  }

  /**
   * Adjunta event listeners
   */
  private attachEvents(): void {
    this.addEventListener(this.continueBtn, 'click', () => {
      this.handleContinue();
    });

    // Escuchar cambios en la selección de MFA
    this.mfaSelection.on('mfa:change', (method) => {
      console.log('MFA method selected:', method);
    });
  }

  /**
   * Maneja el click en continuar
   */
  private handleContinue(): void {
    const selectedMethod = this.mfaSelection.getValue();
    
    if (!selectedMethod) {
      alert('Por favor selecciona un método de verificación');
      return;
    }

    // Guardar método seleccionado
    StorageService.set('mfa_method', selectedMethod, 10); // 10 minutos

    // Guardar en claims de B2C
    B2CService.setClaim('extension_mfaMethod', selectedMethod);

    console.log('MFA method confirmed:', selectedMethod);

    // Redirigir al siguiente paso
    if (import.meta.env.DEV) {
      setTimeout(() => {
        window.location.href = './step-3-otp.html';
      }, 500);
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.mfa-container') as HTMLElement;
  if (container) {
    const ui = new Step2MFAUI(container);
    ui.render();
  }
});
