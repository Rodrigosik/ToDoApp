/**
 * Serializa un objeto a JSON de forma segura
 */
export function safeStringify<T>(data: T): string | null {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error serializando datos:', error);
    return null;
  }
}

/**
 * Deserializa JSON de forma segura
 */
export function safeParse<T>(jsonString: string | null): T | null {
  if (!jsonString) {
    return null;
  }

  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error parseando JSON:', error);
    return null;
  }
}

/**
 * Genera un UUID v4
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback para navegadores viejos
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
