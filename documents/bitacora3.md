# 📓 Bitácora de Prompts — Ejercicio N° 3


---

## Datos

- **Alumno/a:** Iara S
- **Ejercicio:** N° 3 — Extracción de código repetido a Helpers
- **Fecha:** 7/8
- **Modelo de IA usado:** Claude

---

## 1. 🎯 Qué me pidieron

Sacar el codigo repetido que habia en los controllers y que este en un helper de respuestas. Y sacar
calcularEdad/agregarEdad de alumnos-service.js, porque no es lógica de "alumnos" sino una algo general de fechas, y llevarla a su propio
helper reusable.
```
...
```

---

## 2. 💬 Mis prompts (en orden)

Nota: en el medio del proceso me desvie hacia un helper distinto al que pedía el enunciado (un wrapper de try/catch genérico) por el diagnostico inicial de la IA y tuve que volver atrás.
### Prompt #1

**Lo que escribí:**
```
Identificá qué lógica se repite y propondría extraer a un helper, sin
escribir código todavía. Listame los candidatos ordenados por cuánto
código ahorran. (archivos)
```

**Qué me devolvió (resumen):**
```
Una tabla de 8 candidatos ordenados por cuánto código ahorran: (1) el
wrapper try/catch + logging del catch, repetido 15 veces (el que más
ahorra en volumen), (2) el handler completo de PUT /:id, (3)-(6) los
otros 4 handlers CRUD "puros" (GET all, GET by id, POST, DELETE), (7) la
validación de id-URL-vs-id-body dentro del PUT, (8) el boilerplate de
inicialización del router. Aclaró que el candidato #1 es el que más
ahorra pero "cambia más el look del archivo" y puede ser más difícil de
defender en el oral si no sé explicar el wrapper línea por línea.
```

**¿Me sirvió tal cual, o tuve que corregir/repreguntar?**
```
El diagnóstico en si estaba bien, pero entendi mal la consigna y me fui por la opción 1 porque parecia la que mas codigo reducia y simplificaba. 

```

### Prompt #2

**Lo que escribí:**
```
(subi la consgina del punto 3 y log-helper.js para que tome como referencia)
Analiza la mejor estrategia teniendo en cuenta esta consigna y el log-helper que ya tengo.
```
**Qué me devolvió (resumen):**
```
Un nuevo analisis de como hacer los helpers, cumpliendo con la cuestion de extraer los status codes
```
### Prompt #3

**Lo que escribí:**
```
(Realizar el codigo incluyendo las restricciones)
```
**Qué me devolvió (resumen):**
```
Codigo para respuestas-helper y como modificar los controllers

```
### Prompt #4

**Lo que escribí:**
```
(Realizar el codigo de fechas helpers)
```
**Qué me devolvió (resumen):**
```
Codigo para fechas-helper y la modificacion de alumnos service
```

---

## 3. 🔧 Qué hizo la IA y qué hice yo

Marcá esto **también en el código** con comentarios `// [IA]` y `// [YO]`. Acá resumilo:

La IA hizo las modificaciones y archivos y yo supervise y aprobe estos. Dandole las intrucciones exactas casi no tuve que modificar nada al ponerlo en el proyecto.

---

## 4. 🐛 Errores o cosas mal que detecté en la respuesta de la IA

Tenia muchas ganas de dirigirse por la primera opción que ella habia dicho, lo que es la implementación estaba bastante bien, como le subi todo el contexto del proyecto no tuve que modificar nada a primera vista.

```
...
```

---

## 5. ✅ Verificación
[x] Los helpers están en src/helpers/ y son importables.
    Evidencia: respuestas-helper.js y fechas-helper.js con `export
    function`, importados con `import { ... } from './../helpers/...'`
    en los 3 controllers y en alumnos-service.js.

[x] Cada endpoint que usa el helper quedó más corto y se lee mejor.
    Evidencia: conteo de líneas antes/después —
      cursos-controller.js: 90 → 86
      materias-controller.js: 89 → 86
      alumnos-controller.js: 120 → 113
      alumnos-service.js: 76 → 60
      respuestas-helper.js (nuevo): 53
      fechas-helper.js (nuevo): 21
    El ahorro de líneas es chico a propósito: lo que bajó no es el total
    de líneas sino los "puntos de decisión" repetidos (qué status code
    corresponde a cada caso pasó de estar escrito 15 veces a vivir en
    un solo lugar).

[x] Los status codes no cambiaron: probé happy path y casos de error
    (404, 400) en Postman.
    Evidencia PARCIAL: probado con Express real + services fake (no
    Postgres real), cubriendo happy paths, 404, 400 en sus dos variantes
    (string vs JSON de responderBadRequest), 500 con una excepción real
    simulada, y /test-insert con su shape especial de respuesta. Todo
    coincidió con el comportamiento original.
    PENDIENTE: correr la colección de Postman contra el servidor
    conectado a Postgres real — esto es explícitamente lo único que la
    IA no pudo verificar por su cuenta ("no tengo acceso a tu Postgres
    ni a tu servidor corriendo").

[x] calcularEdad / agregarEdad ya no están definidos dentro de
    alumnos-service.js: viven en src/helpers/fechas-helper.js y el
    service los importa.
    Evidencia: en la prueba end-to-end, GET /api/alumnos devolvió
    "edad":26 y GET /api/alumnos/:id devolvió "edad":21 — el cálculo
    sigue funcionando igual desde su nueva ubicación.

[x] El helper no quedó "atado" a una entidad puntual (es reutilizable
    por cursos, materias, etc.).
    Evidencia: respuestas-helper.js no importa nada de alumnos/cursos/
    materias y ya lo usan los tres controllers sin ningún parámetro
    específico de negocio.

```
...
```

---

## 6. ✍️ Reflexión (300–600 palabras)

En un principio no habia entendido la consigna completamente y una vez que corregui el enfoque pude orientar mejor la IA para que diera codigo mas consistente con lo hecho y lo que estaba buscando. Despues vi que quizas podria hacer un helper que tome toda la sección de los controllers que es " if...else" y no tener que repetirlo, pero no coincide eso totalmente con la consigna y cambia mas la logica de como se deciden los status codes ya que entonces el helper pasaria a decidir que codigo va y eso modifica la funcion del controller y del helper.

```
...
```

---