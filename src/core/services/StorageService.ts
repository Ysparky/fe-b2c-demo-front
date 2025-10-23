/**
 * StorageService - Servicio para manejo de localStorage con expiración
 * 
 * Características:
 * - Almacenamiento con TTL (Time To Live)
 * - Serialización automática de objetos
 * - Limpieza automática de items expirados
 */

interface StorageItem<T> {
  value: T;
  expiresAt?: number;
}

export class StorageService {
  private static instance: StorageService;
  private prefix: string = 'pacifico_b2c_';

  private constructor() {
    this.cleanExpired();
  }

  /**
   * Obtiene la instancia singleton
   */
  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * Guarda un valor en localStorage
   */
  set<T>(key: string, value: T, ttlMinutes?: number): void {
    const item: StorageItem<T> = {
      value,
      expiresAt: ttlMinutes ? Date.now() + ttlMinutes * 60 * 1000 : undefined,
    };

    try {
      localStorage.setItem(
        this.getKey(key),
        JSON.stringify(item)
      );
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * Obtiene un valor de localStorage
   */
  get<T>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(this.getKey(key));
      if (!itemStr) return null;

      const item: StorageItem<T> = JSON.parse(itemStr);

      // Verificar si expiró
      if (item.expiresAt && Date.now() > item.expiresAt) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  /**
   * Remueve un valor de localStorage
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  /**
   * Verifica si existe una clave
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Limpia todos los items con el prefijo
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Limpia items expirados
   */
  private cleanExpired(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          const itemStr = localStorage.getItem(key);
          if (itemStr) {
            const item: StorageItem<any> = JSON.parse(itemStr);
            if (item.expiresAt && Date.now() > item.expiresAt) {
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.error('Error cleaning expired items:', error);
    }
  }

  /**
   * Obtiene la clave con prefijo
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Obtiene todos los items almacenados
   */
  getAll(): Record<string, any> {
    const items: Record<string, any> = {};
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          const cleanKey = key.replace(this.prefix, '');
          const value = this.get(cleanKey);
          if (value !== null) {
            items[cleanKey] = value;
          }
        }
      });
    } catch (error) {
      console.error('Error getting all items:', error);
    }

    return items;
  }
}

// Export singleton instance
export default StorageService.getInstance();
