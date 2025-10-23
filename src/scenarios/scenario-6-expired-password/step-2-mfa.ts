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

  private initComponents(): void {
    const mfaContainer = this.getElement<HTMLElement>('#mfaOptions');
    
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

  private attachEvents(): void {
    this.addEventListener(this.continueBtn, 'click', () => {
      this.handleContinue();
    });

    this.mfaSelection.on('mfa:change', (method) => {
      console.log('MFA method selected:', method);
    });
  }

  private handleContinue(): void {
    const selectedMethod = this.mfaSelection.getValue();
    
    if (!selectedMethod) {
      alert('Por favor selecciona un método de verificación');
      return;
    }

    StorageService.set('mfa_method', selectedMethod, 10);
    B2CService.setClaim('extension_mfaMethod', selectedMethod);

    console.log('MFA method confirmed (Scenario 6)');

    // Redirigir al paso 3 del escenario 6
    if (import.meta.env.DEV) {
      setTimeout(() => {
        window.location.href = './step-3-otp.html';
      }, 500);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.mfa-container') as HTMLElement;
  if (container) {
    const ui = new Step2MFAUI(container);
    ui.render();
  }
});
