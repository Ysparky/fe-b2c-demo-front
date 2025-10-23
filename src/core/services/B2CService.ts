/**
 * B2CService - Servicio para interacción con Azure AD B2C
 * 
 * Proporciona:
 * - Manejo de parámetros de URL
 * - Navegación entre flujos
 * - Gestión de claims
 */

export interface B2CParams {
  client_id?: string;
  redirect_uri?: string;
  response_type?: string;
  scope?: string;
  state?: string;
  nonce?: string;
  prompt?: string;
  login_hint?: string;
  [key: string]: string | undefined;
}

export class B2CService {
  private static instance: B2CService;
  private params: B2CParams = {};

  private constructor() {
    this.parseURLParams();
  }

  /**
   * Obtiene la instancia singleton
   */
  static getInstance(): B2CService {
    if (!B2CService.instance) {
      B2CService.instance = new B2CService();
    }
    return B2CService.instance;
  }

  /**
   * Parsea los parámetros de la URL
   */
  private parseURLParams(): void {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.forEach((value, key) => {
      this.params[key] = value;
    });
  }

  /**
   * Obtiene todos los parámetros
   */
  getParams(): B2CParams {
    return { ...this.params };
  }

  /**
   * Obtiene un parámetro específico
   */
  getParam(key: string): string | undefined {
    return this.params[key];
  }

  /**
   * Establece un parámetro
   */
  setParam(key: string, value: string): void {
    this.params[key] = value;
  }

  /**
   * Construye una URL con parámetros
   */
  buildURL(baseURL: string, additionalParams?: Record<string, string>): string {
    const url = new URL(baseURL);
    const allParams = { ...this.params, ...additionalParams };

    Object.entries(allParams).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, value);
      }
    });

    return url.toString();
  }

  /**
   * Navega a un flujo de B2C
   */
  navigateToFlow(flowURL: string, additionalParams?: Record<string, string>): void {
    const url = this.buildURL(flowURL, additionalParams);
    window.location.href = url;
  }

  /**
   * Navega al flujo de login
   */
  navigateToLogin(): void {
    const loginURL = import.meta.env.VITE_B2C_URL_LOGIN;
    if (loginURL) {
      this.navigateToFlow(loginURL);
    }
  }

  /**
   * Navega al flujo de registro
   */
  navigateToSignup(): void {
    const signupURL = import.meta.env.VITE_B2C_URL_SIGNUP;
    if (signupURL) {
      this.navigateToFlow(signupURL);
    }
  }

  /**
   * Navega al flujo de recuperación de contraseña
   */
  navigateToPasswordReset(): void {
    const pwdURL = import.meta.env.VITE_B2C_URL_PWD;
    if (pwdURL) {
      this.navigateToFlow(pwdURL);
    }
  }

  /**
   * Obtiene el login_hint de la URL
   */
  getLoginHint(): string | undefined {
    return this.getParam('login_hint');
  }

  /**
   * Obtiene claims de elementos ocultos de B2C
   */
  getClaim(claimName: string): string | null {
    const element = document.getElementById(claimName) as HTMLInputElement;
    return element?.value || null;
  }

  /**
   * Establece un claim en un elemento oculto de B2C
   */
  setClaim(claimName: string, value: string): void {
    const element = document.getElementById(claimName) as HTMLInputElement;
    if (element) {
      element.value = value;
    }
  }

  /**
   * Verifica si estamos en un iframe de B2C
   */
  isInIframe(): boolean {
    return window.self !== window.top;
  }

  /**
   * Obtiene el error de B2C si existe
   */
  getB2CError(): string | null {
    const errorElement = document.getElementById('claimVerificationServerError');
    return errorElement?.textContent?.trim() || null;
  }

  /**
   * Limpia el error de B2C
   */
  clearB2CError(): void {
    const errorElement = document.getElementById('claimVerificationServerError');
    if (errorElement) {
      errorElement.textContent = '';
    }
  }
}

// Export singleton instance
export default B2CService.getInstance();
