# Solicitud de análisis de cambios y generación de mensaje de commit (STRICT)

1. **ANÁLISIS DE CAMBIOS STAGED**
   - Ejecuta exactamente: `git status && git diff --staged`
   - Analiza únicamente los archivos en el área staged (ignorando unstaged y untracked)
   - Identifica archivos añadidos, modificados y eliminados
   - Examina el contenido de los cambios staged para entender su naturaleza

2. **REGLAS DE COMMITLINT**
   - Aplica todas las reglas de commitlint.config.js:
     - Tipos permitidos: feat, build, fix, chore, docs, style, refactor, test, ci, perf
     - Scope en kebab-case (con guiones)
     - Título en formato: tipo(scope): Descripción en español, en Sentence-case, sin punto final
     - Máximo 150 caracteres en el encabezado
     - Líneas del cuerpo no deben exceder 100 caracteres

3. **ESTRUCTURA DEL MENSAJE DE COMMIT**
   - TÍTULO: `tipo(scope): Descripción en español` (sin punto final)
   - CUERPO: Máximo 100 caracteres por línea
   - No mezcles información unstaged ni untracked

4. **PREVIEW ANTES DEL COMANDO**
   - Muestra primero el mensaje completo del commit en este formato:
     ```
     tipo(scope): Descripción del cambio en español

     - Primer punto detallando un cambio específico realizado
     - Segundo punto con otro aspecto importante del cambio
     - Tercer punto mencionando otros elementos relevantes modificados
     ```
   - No muestres el comando hasta que el preview esté completo y validado

5. **COMANDO FINAL**
   - Presenta el comando git commit listo para ejecutar:
     ```
     git commit -m "tipo(scope): Descripción clara" -m "- Primera línea del cuerpo" -m "- Segunda línea del cuerpo"
     ```
   - Cada línea del cuerpo debe ir en una bandera `-m` separada

**Notas importantes**
- No ignores ningún paso ni regla de este prompt
- No incluyas información unstaged ni untracked
- No ejecutes otras acciones fuera de este flujo