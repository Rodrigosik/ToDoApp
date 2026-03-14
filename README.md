# ToDoApp

Aplicación Kanban/ToDo desarrollada con Angular 21.1.0, implementando arquitectura Domain Driven Design (DDD), persistencia offline y sincronización con API.

## 📋 Requisitos

- **Node.js**: v18.x o superior
- **npm**: v10.9.0 o superior
- **Angular CLI**: v21.1.0 o superior

## 🚀 Cómo levantar el proyecto

1. **Instalar dependencias**:
```bash
npm install
# o usar el script personalizado
npm run freya:install
```

2. **Iniciar el servidor de desarrollo**:
```bash
npm start
# o alternativamente
ng serve -o
```

El navegador se abrirá automáticamente en `http://localhost:4200/`. La aplicación se recargará automáticamente cuando modifiques los archivos fuente.

## 📚 Librerías y Tecnologías

### Core
- **@angular/core**: ^21.1.0 - Framework principal
- **@angular/forms**: ^21.1.0 - Gestión de formularios reactivos
- **@angular/router**: ^21.1.0 - Sistema de navegación
- **rxjs**: ~7.8.0 - Programación reactiva con Observables

### UI Components
- **@angular/cdk**: ^21.2.2 - Componentes y utilidades de Angular CDK (Drag & Drop)
- **freya**: ^0.0.1 (local) - Librería personalizada de componentes UI
- **lucide-angular**: ^0.577.0 - Iconos modernos y ligeros

### 🔍 Code Quality Tools

## ESLint & Angular ESLint
- **eslint** (^8.57.1): Linting JavaScript/TypeScript
- **@angular-eslint/builder** (^21.3.0): Builder de Angular ESLint
- **@angular-eslint/eslint-plugin** (^21.3.0): Reglas específicas de Angular
- **@angular-eslint/eslint-plugin-template** (^21.3.0): Linting de templates
- **@typescript-eslint/eslint-plugin** (^7.18.0): Plugin ESLint para TypeScript
- **@typescript-eslint/parser** (^7.18.0): Parser TypeScript para ESLint

## Prettier
- **prettier** (^3.8.1): Formateador de código
- **prettier-eslint** (^16.4.2): Integración Prettier + ESLint
- **eslint-config-prettier** (^10.1.8): Desactiva reglas que conflictúan con Prettier
- **eslint-plugin-prettier** (^5.5.5): Ejecuta Prettier como regla de ESLint

## Git Hooks & Commit Standards
- **husky** (^9.1.7): Gestión de Git hooks
- **lint-staged** (^15.3.1): Ejecuta linters en archivos staged
- **@commitlint/cli** (^20.4.4): Linting de mensajes de commit
- **@commitlint/config-conventional** (^20.4.4): Estándares de commits convencionales




## 🏗️ Arquitectura y Características

### Metodología Offline First

Este proyecto implementa la metodología **Offline First**, que prioriza la funcionalidad sin conexión como experiencia principal:

**Principios aplicados:**
- 🔄 **Persistencia local primero**: Todas las operaciones se guardan en localStorage antes de intentar sincronizar
- ⚡ **Cero latencia percibida**: La UI responde instantáneamente sin esperar respuestas del servidor
- 🌐 **Sincronización inteligente**: Los datos se sincronizan automáticamente cuando hay conexión disponible
- 🔌 **Resiliente a desconexiones**: La app funciona completamente offline, sincronizando al reconectar
- 📊 **Estado de sync visible**: El usuario siempre sabe si hay datos pendientes de sincronizar

**Ventajas para el usuario:**
- La aplicación funciona siempre, con o sin internet
- Experiencia fluida sin esperas por red lenta
- No se pierden datos si se cae la conexión

### Domain Driven Design (DDD)

El proyecto implementa **Domain Driven Design** con una separación clara de responsabilidades:

```
src/app/
├── core/
│   ├── features/          # Módulos de dominio (board)
│   │   └── board/
│   │       ├── models/    # Entidades del dominio
│   │       ├── repositories/  # Acceso a datos
│   │       └── services/  # Lógica de negocio
│   └── shared/            # Servicios compartidos
│       ├── config/        # Configuraciones
│       ├── interfaces/    # Contratos
│       ├── repositories/  # Repositorios base
│       └── services/      # Servicios base
├── shared/                # Componentes reutilizables
└── ui/                    # Componentes de presentación
```

**Beneficios de DDD aplicado:**
- **Separación de responsabilidades**: Cada capa tiene una función específica
- **Repositorios**: Abstraen la persistencia (localStorage actualmente, fácil cambio a API)
- **Servicios de dominio**: Encapsulan lógica de negocio compleja
- **Modelos**: Representan entidades del dominio (`ColumnModel`, `TaskModel`)
- **Mantenibilidad**: Código organizado y fácil de extender

### Persistencia Offline

El sistema implementa **persistencia completa offline** usando localStorage:

#### StorageService (Shared)
Servicio genérico para acceso a localStorage con responsabilidad única:
```typescript
// src/app/core/shared/services/storage/storage.service.ts
- get<T>(key: string): Obtiene y deserializa
- set<T>(key, value): Serializa y guarda
- remove(key): Elimina clave específica
- clear(): Limpia todo el storage
- has(key): Verifica existencia
- clearByPrefix(prefix): Limpieza selectiva
```

#### Configuración Centralizada
```typescript
// src/app/core/shared/config/storage.config.ts
STORAGE_CONFIG = {
  KEYS: { COLUMNS, TASKS, METADATA },
  PREFIX: { DEV, PROD, TEST }
}
```

#### Repositorios con Persistencia
Los repositorios (`ColumnRepository`, `TaskRepository`) implementan el patrón Repository:
- Operaciones CRUD completas
- Persistencia automática en localStorage
- Retornan Observables para consistencia con futuros endpoints HTTP
- Desacoplamiento total de la UI

**Ventajas:**
- ✅ Funciona completamente sin conexión
- ✅ Datos persistentes entre recargas
- ✅ Fácil migración a backend (solo cambiar repositorios)
- ✅ Manejo de errores (QuotaExceededError)

### Sincronización con API

Sistema de **sincronización automática online/offline**:

#### BaseSyncService (Shared)
Servicio base abstracto para sincronización reutilizable:
```typescript
// src/app/core/shared/services/sync/base-sync.service.ts
Signals públicos:
- isSyncing: Signal<boolean>
- isOnline: Signal<boolean>
- pendingSyncs: Signal<number>
- lastSyncTime: Signal<Date | null>

Métodos:
- sync(data): Sincroniza con API si hay conexión
- retrySyncPending(): Reintenta sincronizaciones fallidas
- setupOnlineDetection(): Detecta cambios online/offline
```

#### BoardSyncService
Implementación específica para el dominio Board:
```typescript
// Extiende BaseSyncService<ColumnModel>
syncColumns(columns): Sincroniza columnas con la API
```

**Flujo de Sincronización:**
1. **Online**: Guarda en localStorage + sincroniza con API inmediatamente
2. **Offline**: Guarda en localStorage + incrementa `pendingSyncs`
3. **Reconexión**: Detecta evento `online` y reintenta sincronizaciones pendientes
4. **Optimistic Updates**: UI se actualiza inmediatamente, sincronización en background

**Componente de Estado:**
```typescript
// src/app/shared/components/sync-status
Muestra estado de sincronización en tiempo real usando signals
```

### Gestión de Estado con Signals

La aplicación usa **Angular Signals** como gestor de estado reactivo:

#### Signals en lugar de NgRx

**¿Por qué Signals y NO NgRx?**

Angular 16+ introduce **Signals** como sistema nativo de reactividad granular:

❌ **NgRx ya NO es necesario para la mayoría de aplicaciones** porque:
- Signals resuelven el mismo problema con **menos código y complejidad**
- Reactividad granular native de Angular
- Mejor rendimiento (actualizaciones quirúrgicas, no difting de zonas)
- Type-safe por defecto sin boilerplate
- Change Detection optimizada automáticamente

✅ **Ventajas de Signals sobre NgRx:**
- **Menos boilerplate**: No requiere actions, reducers, effects, selectors
- **Simplicidad**: `signal()`, `computed()`, `effect()` vs Actions/Reducers/Effects
- **Performance nativa**: Integrado con Change Detection de Angular
- **Curva de aprendizaje**: Más intuitivo para desarrolladores
- **Mantenibilidad**: Menos archivos, menos complejidad

#### Implementación con Signals

**BoardStateService** - Gestor de estado centralizado:
```typescript
// src/app/core/features/board/services/board-state.service.ts
readonly columnsSignal = signal<ColumnModel[]>([]);
readonly columns = this.columnsSignal.asReadonly();

// Actualizaciones reactivas
columnsSignal.update(cols => [...cols, newColumn]);
columnsSignal.set(columns);
```

**Componentes reactivos:**
```typescript
// src/app/ui/dashboard/dashboard.component.ts
isAddingColumn = signal(false);
columnList = computed(() => this.boardState.columns());

toggleAddColumn() {
  this.isAddingColumn.update(value => !value);
}
```

**Beneficios en la práctica:**
- Estado reactivo sin servicios pesados
- Computed values automáticos
- Actualizaciones optimistas instantáneas
- Sincronización con RxJs cuando es necesario (HTTP)

### Drag and Drop

El proyecto implementa **drag and drop completo** usando Angular CDK:

**Funcionalidades:**
- **Reordenar columnas**: Arrastra columnas horizontalmente para cambiar su orden
- **Reordenar tareas**: Reorganiza tareas dentro de una misma columna
- **Mover entre columnas**: Arrastra tareas de una columna a otra
- **Persistencia automática**: Todos los cambios se guardan instantáneamente

**Implementación:**
- Uso de Angular CDK `DragDropModule` para drag and drop nativo
- Animaciones suaves y feedback visual durante el arrastre
- Drop lists conectadas para movimiento entre columnas

## 📝 Scripts Disponibles

```bash
npm start              # Inicia servidor de desarrollo
npm run build          # Build de producción
npm run freya:install  # Instalación limpia de dependencias
npm run git:pull:dev   # Pull desde rama build-dev
```
