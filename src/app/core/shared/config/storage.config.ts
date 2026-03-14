/**
 * Configuración centralizada para Storage
 * Aquí se definen todas las claves, prefijos y configuraciones
 */
export const STORAGE_CONFIG = {
  // Claves principales
  KEYS: {
    COLUMNS: 'kanban_columns',
    TASKS: 'kanban_tasks',
    METADATA: 'kanban_metadata',
  },

  // Prefijos para diferentes entornos
  PREFIX: {
    DEV: 'dev_',
    PROD: '',
    TEST: 'test_',
  },
} as const;

/**
 * Helper para obtener la clave con el prefijo adecuado según el ambiente
 */
export function getStorageKey(
  key: keyof typeof STORAGE_CONFIG.KEYS,
  environment: 'dev' | 'prod' | 'test' = 'dev'
): string {
  const prefix =
    STORAGE_CONFIG.PREFIX[
      environment.toUpperCase() as keyof typeof STORAGE_CONFIG.PREFIX
    ];
  return `${prefix}${STORAGE_CONFIG.KEYS[key]}`;
}
