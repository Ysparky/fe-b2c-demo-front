/**
 * BaseComponent - Clase base abstracta para componentes reutilizables
 * 
 * Proporciona funcionalidad común para:
 * - Inicialización de componentes
 * - Manejo de estado
 * - Validación
 * - Eventos personalizados
 */
export abstract class BaseComponent<T = any> {
  protected state: T | null = null;
  protected eventListeners: Array<{
    element: HTMLElement;
    event: string;
    handler: EventListener;
  }> = [];

  /**
   * Inicializa el componente
   */
  protected abstract init(): void;

  /**
   * Obtiene el valor actual del componente
   */
  abstract getValue(): any;

  /**
   * Establece el valor del componente
   */
  abstract setValue(value: any): void;

  /**
   * Valida el componente
   */
  async isValid(): Promise<boolean> {
    return true;
  }

  /**
   * Obtiene el estado del componente
   */
  getState(): T | null {
    return this.state;
  }

  /**
   * Establece el estado del componente
   */
  setState(state: T): void {
    this.state = state;
  }

  /**
   * Adjunta un event listener
   */
  protected addEventListener(
    element: HTMLElement,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): void {
    element.addEventListener(event, handler, options);
    this.eventListeners.push({ element, event, handler });
  }

  /**
   * Emite un evento personalizado
   */
  protected emit(eventName: string, detail?: any): void {
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event);
  }

  /**
   * Escucha un evento personalizado
   */
  protected on(eventName: string, handler: EventListener): void {
    window.addEventListener(eventName, handler);
    this.eventListeners.push({
      element: window as any,
      event: eventName,
      handler,
    });
  }

  /**
   * Habilita el componente
   */
  enable(): void {
    // Implementación por defecto vacía
  }

  /**
   * Deshabilita el componente
   */
  disable(): void {
    // Implementación por defecto vacía
  }

  /**
   * Resetea el componente a su estado inicial
   */
  reset(): void {
    this.state = null;
  }

  /**
   * Limpia los event listeners
   */
  protected cleanup(): void {
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];
  }

  /**
   * Destruye el componente
   */
  destroy(): void {
    this.cleanup();
    this.state = null;
  }
}
