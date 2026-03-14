# Decisiones Técnicas - Aplicación ToDo/Kanban

## Introducción: Decisión de Arquitectura Kanban

Se implementó un sistema Kanban como evolución natural de una TodoList tradicional:

- **Múltiples estados**: El sistema permite columnas configurables que representan diferentes estados del workflow (Por Hacer, En Progreso, Completado, etc.), vs. una lista única con estado binario.
- **Organización visual**: La distribución en columnas facilita la visualización del estado general del proyecto y el flujo de trabajo.
- **Gestión de workflow**: Los usuarios pueden mover tareas entre columnas según avanza su progreso, proporcionando mejor seguimiento .

## 1. Modelo de Datos

El modelo de datos se basa en dos entidades principales:

**ColumnModel**: Representa las columnas del tablero Kanban con propiedades `id`, `title`, `order` y una colección de `tasks`. Esta estructura permite organizar jerárquicamente las tareas dentro de columnas y facilita el reordenamiento mediante el campo `order`.

**TaskModel**: Define las tareas individuales con atributos como `id`, `title`, `description`, `priority`, `columnId` (referencia a la columna padre) y `order`. La relación mediante `columnId` permite mover tareas entre columnas sin reestructurar toda la colección.

La arquitectura implementa **Domain Driven Design (DDD)** organizando el código en capas: entidades de dominio (models), repositorios para abstracción de persistencia, y servicios de dominio que encapsulan lógica de negocio. Esta separación por responsabilidades facilita el mantenimiento y permite cambiar la implementación de persistencia sin afectar la lógica de negocio.

## 2. Gestor de Estado

Se optó por **Angular Signals** en lugar de NgRx por las siguientes razones:

- **Simplicidad**: Signals es una API nativa de Angular 16+ que elimina la necesidad de boilerplate (actions, reducers, effects, selectors).
- **Rendimiento**: La reactividad granular de Signals optimiza automáticamente el Change Detection, actualizando solo los componentes afectados.
- **Mantenibilidad**: Para una aplicación de esta escala, Signals proporciona toda la funcionalidad necesaria con significativamente menos código.

NgRx se descartó porque añadiría complejidad innecesaria para el alcance del proyecto. Signals resuelve los mismos problemas de gestión de estado reactivo con una curva de aprendizaje menor y mejor integración nativa con el framework.

## 3. Estrategia de Persistencia y Sincronización

Se implementó una arquitectura **Offline First** con las siguientes capas:

**Persistencia Local**: Se utiliza localStorage como almacenamiento principal a través de un `StorageService` genérico que abstrae las operaciones de serialización/deserialización. Los repositorios (`ColumnRepository`, `TaskRepository`) implementan el patrón Repository, encapsulando toda la lógica de persistencia y exponiendo Observables para mantener consistencia con futuras implementaciones HTTP.

**Sincronización**: Un `BaseSyncService` abstracto maneja la lógica de sincronización online/offline utilizando Signals para exponer el estado (`isOnline`, `isSyncing`, `pendingSyncs`). La estrategia implementa:
- Actualizaciones optimistas: la UI se actualiza inmediatamente al persistir en localStorage
- Sincronización en background cuando hay conexión
- Cola de sincronización pendiente que se reintenta automáticamente al detectar reconexión
- Event listeners de `online`/`offline` para gestionar cambios de conectividad

Esta arquitectura garantiza que la aplicación funcione completamente sin conexión, sincronizando de forma transparente cuando la red está disponible.

## 4. Riesgos en Producción

**Riesgo 1: Límites de localStorage**
localStorage tiene un límite típico de 5-10MB dependiendo del navegador. Con uso intensivo del tablero Kanban (múltiples columnas con cientos de tareas), se podría alcanzar este límite, causando pérdida de datos nuevos. Aunque el código maneja `QuotaExceededError`, la estrategia actual no incluye limpieza automática ni compresión de datos históricos.

**Mitigación**: Implementar una estrategia de limpieza de datos antiguos.

**Riesgo 2: Conflictos de sincronización**
La sincronización actual implementa un modelo "last write wins" sin resolución de conflictos. Si un usuario modifica datos en dos dispositivos diferentes mientras está offline, al sincronizar se perderán los cambios del primer dispositivo que sincronice. Esto es especialmente problemático en escenarios colaborativos o multi-dispositivo.

**Mitigación**: Implementar timestamps de modificación y lógica de detección de conflictos, permitir al usuario resolver conflictos manualmente cuando se detecten.
