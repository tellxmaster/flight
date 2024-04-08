// utils/cache.ts

import type { CacheItem } from "@interfaces/CacheItem";

class Cache {
  private store: Record<string, CacheItem> = {};

  set(key: string, value: any, ttl: number): void {
    const now = Date.now();
    const expire = now + ttl * 1000; // Convertir ttl de segundos a milisegundos
    this.store[key] = { value, expire };
  }

  get(key: string): any {
    const item = this.store[key];
    if (item) {
      const now = Date.now();
      if (now < item.expire) {
        return item.value;
      } else {
        // Eliminar si ha expirado
        delete this.store[key];
      }
    }
    return null;
  }
}

// Exporta una instancia de la caché para ser reutilizada en toda tu aplicación
export const cache = new Cache();
