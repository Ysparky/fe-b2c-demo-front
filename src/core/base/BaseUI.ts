/**
 * BaseUI - Clase base abstracta para todas las UIs/Páginas
 * 
 * Proporciona funcionalidad común para:
 * - Selección de elementos del DOM
 * - Manejo de eventos
 * - Ciclo de vida (render, cleanup)
 * - Gestión de estado básico
 */
export abstract class BaseUI {
  protected elements: Map<string, HTMLElement> = new Map();
  protected eventListeners: Array<{
    element: HTMLElement;
    event: string;
    handler: EventListener;
  }> = [];

  constructor(protected container: HTMLElement) {
    if (!container) {
      throw new Error('Container element is required');
    }
  }

  /**
   * Método abstracto que cada UI debe implementar
   * Aquí se inicializan componentes y se adjuntan eventos
   */
  abstract render(): void;

  /**
   * Obtiene un elemento del DOM y lo cachea
   */
  protected getElement<T extends HTMLElement>(
    selector: string,
    required: boolean = true
  ): T | null {
    // Buscar en caché primero
    const cached = this.elements.get(selector);
    if (cached) return cached as T;

    // Buscar en el DOM
    const element = this.container.querySelector<T>(selector);
    
    if (!element && required) {
      throw new Error(`Required element not found: ${selector}`);
    }

    if (element) {
      this.elements.set(selector, element);
    }

    return element;
  }

  /**
   * Obtiene múltiples elementos del DOM
   */
  protected getElements<T extends HTMLElement>(
    selector: string
  ): NodeListOf<T> {
    return this.container.querySelectorAll<T>(selector);
  }

  /**
   * Adjunta un event listener y lo registra para limpieza posterior
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
   * Adjunta múltiples eventos al mismo elemento
   */
  protected addEventListeners(
    element: HTMLElement,
    events: Array<{ event: string; handler: EventListener; options?: AddEventListenerOptions }>
  ): void {
    events.forEach(({ event, handler, options }) => {
      this.addEventListener(element, event, handler, options);
    });
  }

  /**
   * Muestra un elemento
   */
  protected show(element: HTMLElement): void {
    element.classList.remove('hidden');
  }

  /**
   * Oculta un elemento
   */
  protected hide(element: HTMLElement): void {
    element.classList.add('hidden');
  }

  /**
   * Alterna la visibilidad de un elemento
   */
  protected toggle(element: HTMLElement): void {
    element.classList.toggle('hidden');
  }

  /**
   * Habilita un elemento (remueve disabled)
   */
  protected enable(element: HTMLButtonElement | HTMLInputElement): void {
    element.disabled = false;
    element.classList.remove('disabled');
  }

  /**
   * Deshabilita un elemento
   */
  protected disable(element: HTMLButtonElement | HTMLInputElement): void {
    element.disabled = true;
    element.classList.add('disabled');
  }

  /**
   * Agrega una clase CSS
   */
  protected addClass(element: HTMLElement, className: string): void {
    element.classList.add(className);
  }

  /**
   * Remueve una clase CSS
   */
  protected removeClass(element: HTMLElement, className: string): void {
    element.classList.remove(className);
  }

  /**
   * Alterna una clase CSS
   */
  protected toggleClass(element: HTMLElement, className: string): void {
    element.classList.toggle(className);
  }

  /**
   * Establece el contenido HTML de un elemento
   */
  protected setHTML(element: HTMLElement, html: string): void {
    element.innerHTML = html;
  }

  /**
   * Establece el texto de un elemento
   */
  protected setText(element: HTMLElement, text: string): void {
    element.textContent = text;
  }

  /**
   * Limpia todos los event listeners registrados
   */
  protected cleanup(): void {
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];
    this.elements.clear();
  }

  /**
   * Destruye la UI y limpia recursos
   */
  public destroy(): void {
    this.cleanup();
  }
}
