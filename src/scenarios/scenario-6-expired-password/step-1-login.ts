import { BaseUI } from '@core/base/BaseUI';
import { DocumentInput } from '@components/DocumentInput/DocumentInput';
import { PasswordField } from '@components/PasswordField/PasswordField';
import StorageService from '@core/services/StorageService';
import B2CService from '@core/services/B2CService';
import * as yup from 'yup';
import { ValidationService } from '@core/services/ValidationService';

const loginSchema = yup.object({
  documentType: yup.string().required(),
  documentNumber: yup.string().when('documentType', {
    is: 'DNI',
    then: (schema) => ValidationService.schemas.dni,
    otherwise: (schema) => ValidationService.schemas.ce,
  }),
  password: yup.string().required('La contraseña es obligatoria'),
});

class Step1LoginUI extends BaseUI {
  private documentInput!: DocumentInput;
  private passwordField!: PasswordField;
  private loginBtn!: HTMLButtonElement;
  private registerBtn!: HTMLButtonElement;
  private forgotPasswordLink!: HTMLAnchorElement;

  constructor(container: HTMLElement) {
    super(container);
  }

  render(): void {
    this.initComponents();
    this.loadSavedData();
    this.attachEvents();
  }

  private initComponents(): void {
    const documentNumberInput = this.getElement<HTMLInputElement>('#documentNumber');
    const documentTypeSelect = this.getElement<HTMLSelectElement>('#documentType');
    const passwordInput = this.getElement<HTMLInputElement>('#password');

    this.documentInput = new DocumentInput(documentNumberInput, documentTypeSelect);
    this.passwordField = new PasswordField(passwordInput);

    this.loginBtn = this.getElement<HTMLButtonElement>('#loginBtn');
    this.registerBtn = this.getElement<HTMLButtonElement>('#registerBtn');
    this.forgotPasswordLink = this.getElement<HTMLAnchorElement>('#forgotPasswordLink');
  }

  private loadSavedData(): void {
    const savedDocument = StorageService.get<{ type: string; number: string }>('saved_document');
    if (savedDocument) {
      this.documentInput.setValue(savedDocument);
    }
  }

  private attachEvents(): void {
    const form = this.getElement<HTMLFormElement>('#loginForm');
    this.addEventListener(form, 'submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    this.addEventListener(this.registerBtn, 'click', () => {
      B2CService.navigateToSignup();
    });

    this.addEventListener(this.forgotPasswordLink, 'click', (e) => {
      e.preventDefault();
      B2CService.navigateToPasswordReset();
    });

    this.addEventListener(this.getElement('#documentNumber'), 'blur', async () => {
      await this.validateForm();
    });

    this.addEventListener(this.getElement('#password'), 'blur', async () => {
      await this.validateForm();
    });
  }

  private async validateForm(): Promise<boolean> {
    const documentData = this.documentInput.getValue();
    const password = this.passwordField.getValue();

    const data = {
      documentType: documentData.type,
      documentNumber: documentData.number,
      password,
    };

    try {
      await loginSchema.validate(data, { abortEarly: false });
      this.enable(this.loginBtn);
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        this.disable(this.loginBtn);
      }
      return false;
    }
  }

  private async handleSubmit(): Promise<void> {
    const isValid = await this.validateForm();
    
    if (!isValid) {
      return;
    }

    const documentData = this.documentInput.getValue();
    StorageService.set('saved_document', documentData, 30);

    B2CService.setClaim('extension_documentType', documentData.type);
    B2CService.setClaim('extension_documentNumber', documentData.number);

    console.log('Login submitted (Scenario 6)');

    // Redirigir al paso 2 del escenario 6
    if (import.meta.env.DEV) {
      setTimeout(() => {
        window.location.href = './step-2-mfa.html';
      }, 500);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.login-container') as HTMLElement;
  if (container) {
    const ui = new Step1LoginUI(container);
    ui.render();
  }
});
