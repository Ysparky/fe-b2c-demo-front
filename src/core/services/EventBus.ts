/**
 * EventBus - Sistema de eventos para comunicación entre componentes
 * 
 * Implementa el patrón Observer/Pub-Sub
 */

type EventHandler = (data?: any) => void;

export class EventBus {
  private static instance: EventBus;
  private events: Map<string, EventHandler[]> = new Map();

  private constructor() {}

  /**
   * Obtiene la instancia singleton
   */
  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Suscribe un handler a un evento
   */
  on(eventName: string, handler: EventHandler): () => void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    const handlers = this.events.get(eventName)!;
    handlers.push(handler);

    // Retorna función para desuscribirse
    return () => this.off(eventName, handler);
  }

  /**
   * Suscribe un handler que se ejecuta solo una vez
   */
  once(eventName: string, handler: EventHandler): void {
    const onceHandler: EventHandler = (data) => {
      handler(data);
      this.off(eventName, onceHandler);
    };

    this.on(eventName, onceHandler);
  }

  /**
   * Desuscribe un handler de un evento
   */
  off(eventName: string, handler: EventHandler): void {
    const handlers = this.events.get(eventName);
    if (!handlers) return;

    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }

    if (handlers.length === 0) {
      this.events.delete(eventName);
    }
  }

  /**
   * Emite un evento
   */
  emit(eventName: string, data?: any): void {
    const handlers = this.events.get(eventName);
    if (!handlers) return;

    handlers.forEach((handler) => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in event handler for "${eventName}":`, error);
      }
    });
  }

  /**
   * Limpia todos los eventos
   */
  clear(): void {
    this.events.clear();
  }

  /**
   * Limpia los handlers de un evento específico
   */
  clearEvent(eventName: string): void {
    this.events.delete(eventName);
  }

  /**
   * Obtiene el número de handlers para un evento
   */
  getHandlerCount(eventName: string): number {
    return this.events.get(eventName)?.length || 0;
  }

  /**
   * Verifica si un evento tiene handlers
   */
  hasHandlers(eventName: string): boolean {
    return this.getHandlerCount(eventName) > 0;
  }
}

// Eventos predefinidos del sistema
export const SystemEvents = {
  // Navegación
  NAVIGATE: 'system:navigate',
  NAVIGATE_BACK: 'system:navigate:back',
  
  // Formularios
  FORM_SUBMIT: 'form:submit',
  FORM_VALID: 'form:valid',
  FORM_INVALID: 'form:invalid',
  
  // Autenticación
  AUTH_SUCCESS: 'auth:success',
  AUTH_ERROR: 'auth:error',
  
  // Loading
  LOADING_START: 'loading:start',
  LOADING_END: 'loading:end',
  
  // Errores
  ERROR: 'error',
  ERROR_NETWORK: 'error:network',
  ERROR_VALIDATION: 'error:validation',
} as const;

// Export singleton instance
export default EventBus.getInstance();
