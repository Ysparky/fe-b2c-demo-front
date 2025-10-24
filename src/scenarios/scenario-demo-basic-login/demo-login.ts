/**
 * Demo Login - Adaptación del login básico de Azure B2C
 * Sin captcha, diseño moderno basado en Figma
 */

import './demo-login.css';

interface FormElements {
  form: HTMLFormElement;
  documentType: HTMLSelectElement;
  documentNumber: HTMLInputElement;
  password: HTMLInputElement;
  togglePassword: HTMLButtonElement;
  loginBtn: HTMLButtonElement;
  forgotPasswordLink: HTMLAnchorElement;
  registerLink: HTMLAnchorElement;
  globalError: HTMLDivElement;
}

class DemoLoginPage {
  private elements!: FormElements;
  private isSubmitting = false;

  constructor() {
    this.init();
  }

  private init(): void {
    this.cacheElements();
    this.attachEventListeners();
    this.focusFirstInput();
  }

  private cacheElements(): void {
    this.elements = {
      form: document.getElementById('demoLoginForm') as HTMLFormElement,
      documentType: document.getElementById('documentType') as HTMLSelectElement,
      documentNumber: document.getElementById('documentNumber') as HTMLInputElement,
      password: document.getElementById('password') as HTMLInputElement,
      togglePassword: document.getElementById('togglePassword') as HTMLButtonElement,
      loginBtn: document.getElementById('loginBtn') as HTMLButtonElement,
      forgotPasswordLink: document.getElementById('forgotPasswordLink') as HTMLAnchorElement,
      registerLink: document.getElementById('registerBtn') as HTMLAnchorElement,
      globalError: document.getElementById('globalError') as HTMLDivElement,
    };
  }

  private attachEventListeners(): void {
    // Form submit
    this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Toggle password visibility
    this.elements.togglePassword.addEventListener('click', () => this.togglePasswordVisibility());

    // Input validation on blur
    this.elements.documentNumber.addEventListener('blur', () => this.validateDocumentNumber());
    this.elements.password.addEventListener('blur', () => this.validatePassword());

    // Clear errors on input
    this.elements.documentNumber.addEventListener('input', () => this.clearError('documentNumber'));
    this.elements.password.addEventListener('input', () => this.clearError('password'));

    // Forgot password
    this.elements.forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleForgotPassword();
    });

    // Register link
    this.elements.registerLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleRegister();
    });

    // Enter key on inputs
    this.elements.documentNumber.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.elements.password.focus();
      }
    });
  }

  private focusFirstInput(): void {
    setTimeout(() => {
      this.elements.documentNumber.focus();
    }, 100);
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (this.isSubmitting) return;

    // Clear previous errors
    this.clearAllErrors();

    // Validate all fields
    const isValid = this.validateForm();

    if (!isValid) {
      return;
    }

    // Show loading state
    this.setLoadingState(true);

    try {
      // Simulate API call (replace with actual Azure B2C call)
      await this.performLogin();

      // Success - redirect or show success message
      console.log('Login successful!');
      
      // In production, Azure B2C will handle the redirect
      // For demo purposes, show success message
      this.showGlobalMessage('Inicio de sesión exitoso. Redirigiendo...', 'success');

      setTimeout(() => {
        // Azure B2C redirect would happen here
        window.location.href = '/dashboard';
      }, 1500);

    } catch (error) {
      this.handleLoginError(error);
    } finally {
      this.setLoadingState(false);
    }
  }

  private validateForm(): boolean {
    let isValid = true;

    if (!this.validateDocumentNumber()) {
      isValid = false;
    }

    if (!this.validatePassword()) {
      isValid = false;
    }

    return isValid;
  }

  private validateDocumentNumber(): boolean {
    const value = this.elements.documentNumber.value.trim();
    const errorElement = document.getElementById('documentNumber_error');

    if (!errorElement) return false;

    if (!value) {
      this.showError('documentNumber', 'El número de documento es obligatorio');
      return false;
    }

    // Validate only numbers
    if (!/^[0-9]+$/.test(value)) {
      this.showError('documentNumber', 'Ingrese solo números');
      return false;
    }

    // Validate length based on document type
    const docType = this.elements.documentType.value;
    if (docType === 'dni' && value.length !== 8) {
      this.showError('documentNumber', 'El DNI debe tener 8 dígitos');
      return false;
    }

    if (docType === 'ce' && (value.length < 9 || value.length > 12)) {
      this.showError('documentNumber', 'El CE debe tener entre 9 y 12 dígitos');
      return false;
    }

    return true;
  }

  private validatePassword(): boolean {
    const value = this.elements.password.value;
    const errorElement = document.getElementById('password_error');

    if (!errorElement) return false;

    if (!value) {
      this.showError('password', 'La contraseña es obligatoria');
      return false;
    }

    if (value.length < 6) {
      this.showError('password', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  }

  private showError(fieldId: string, message: string): void {
    const input = document.getElementById(fieldId) as HTMLInputElement;
    const errorElement = document.getElementById(`${fieldId}_error`);

    if (input && errorElement) {
      input.classList.add('error');
      errorElement.textContent = message;
      errorElement.classList.add('show');
      errorElement.setAttribute('aria-hidden', 'false');
    }
  }

  private clearError(fieldId: string): void {
    const input = document.getElementById(fieldId) as HTMLInputElement;
    const errorElement = document.getElementById(`${fieldId}_error`);

    if (input && errorElement) {
      input.classList.remove('error');
      errorElement.textContent = '';
      errorElement.classList.remove('show');
      errorElement.setAttribute('aria-hidden', 'true');
    }
  }

  private clearAllErrors(): void {
    this.clearError('documentNumber');
    this.clearError('password');
    this.hideGlobalMessage();
  }

  private showGlobalMessage(message: string, type: 'error' | 'success' = 'error'): void {
    this.elements.globalError.textContent = message;
    this.elements.globalError.style.display = 'block';
    this.elements.globalError.setAttribute('aria-hidden', 'false');
    
    if (type === 'success') {
      this.elements.globalError.style.backgroundColor = '#D4EDDA';
      this.elements.globalError.style.borderColor = '#28A745';
      this.elements.globalError.style.color = '#155724';
    } else {
      this.elements.globalError.style.backgroundColor = '#FFF5F5';
      this.elements.globalError.style.borderColor = '#E63946';
      this.elements.globalError.style.color = '#C1121F';
    }
  }

  private hideGlobalMessage(): void {
    this.elements.globalError.style.display = 'none';
    this.elements.globalError.setAttribute('aria-hidden', 'true');
  }

  private setLoadingState(isLoading: boolean): void {
    this.isSubmitting = isLoading;
    this.elements.loginBtn.disabled = isLoading;

    const btnText = this.elements.loginBtn.querySelector('.demo-btn-text') as HTMLElement;
    const btnLoader = this.elements.loginBtn.querySelector('.demo-btn-loader') as HTMLElement;

    if (btnText && btnLoader) {
      if (isLoading) {
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
      } else {
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
      }
    }
  }

  private togglePasswordVisibility(): void {
    const type = this.elements.password.type === 'password' ? 'text' : 'password';
    this.elements.password.type = type;

    const label = type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña';
    this.elements.togglePassword.setAttribute('aria-label', label);
  }

  private async performLogin(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In production, this would be replaced with actual Azure B2C API call
    const documentType = this.elements.documentType.value;
    const documentNumber = this.elements.documentNumber.value;
    const password = this.elements.password.value;

    console.log('Login attempt:', {
      documentType,
      documentNumber,
      passwordLength: password.length // Log length instead of actual password
    });

    // Simulate random success/failure for demo
    const isSuccess = Math.random() > 0.3;

    if (!isSuccess) {
      throw new Error('Credenciales incorrectas');
    }
  }

  private handleLoginError(error: unknown): void {
    console.error('Login error:', error);

    let errorMessage = 'Ocurrió un error al iniciar sesión. Por favor, intente nuevamente.';

    if (error instanceof Error) {
      if (error.message.includes('Credenciales incorrectas')) {
        errorMessage = 'Documento o contraseña incorrectos. Por favor, verifique sus datos.';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Error de conexión. Por favor, verifique su conexión a internet.';
      }
    }

    this.showGlobalMessage(errorMessage, 'error');
  }

  private handleForgotPassword(): void {
    console.log('Forgot password clicked');
    // In production, redirect to Azure B2C password reset flow
    alert('Redirigiendo a recuperación de contraseña...');
  }

  private handleRegister(): void {
    console.log('Register clicked');
    // In production, redirect to Azure B2C signup flow
    alert('Redirigiendo a registro...');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new DemoLoginPage();
  });
} else {
  new DemoLoginPage();
}

export default DemoLoginPage;
