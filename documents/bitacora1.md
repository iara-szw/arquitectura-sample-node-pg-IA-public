# 📓 Bitácora de Prompts — Ejercicio N° 01

> Esta bitácora es parte de la nota. Un ejercicio sin bitácora no se corrige.

---

## Datos

- **Alumno/a:** ⬅️ Iara Szwarstein
- **Ejercicio:** N° 01 — Nueva tabla y su CRUD (materias)
- **Fecha:** ⬅️ 17/7
- **Modelo de IA usado:** ⬅️ Claude

---

## 1. 🎯 Qué me pidieron

```
Agregar la tabla `materias` al proyecto, con su CRUD completo (repository,
service y controller) siguiendo exactamente el mismo patrón que ya usa la
entidad `cursos`, exponerla en /api/materias con los 5 endpoints REST, y
crear también la tabla `calificaciones` (sin CRUD todavía, se usa en
ejercicios posteriores del TP).
```

---

## 2. 💬 Mis prompts (en orden)

### Prompt #1 — Repository

**Lo que escribí:**
```
Rol: Sos un desarrollador backend Node/Express senior, especializado en
arquitectura en capas sin ORM.

Contexto: Tengo un proyecto Node con ES modules y el driver `pg` (sin ORM).
La arquitectura es en 3 capas: repository → service → controller. El acceso
a datos se centraliza en una clase `DbPg` que expone `queryAll`, `queryOne`,
`queryReturnId` y `queryRowCount`; ningún repository toca el `Pool` ni crea
un `Client` directamente. Te pego el código de referencia de la entidad
`cursos`, que es la más parecida a lo que necesito:

--- cursos-repository.js ---
[contenido completo de cursos-repository.js]

Tarea: Generame el archivo `materias-repository.js` para la tabla
`materias (id SERIAL PRIMARY KEY, nombre VARCHAR(75) NOT NULL)`, con los 5
métodos CRUD (getAll, getById, create, update, delete), respetando
EXACTAMENTE el mismo estilo, estructura de clase y convenciones que
`cursos-repository.js`.

Restricciones:
- No agregues dependencias nuevas.
- Usá siempre placeholders $1, $2... en las queries (nunca concatenar strings).
- Delegá todo el acceso a datos en this.db.queryAll/queryOne/queryReturnId/
  queryRowCount, tal cual hace cursos-repository.js.
- Mantené los console.log que tiene el patrón de referencia.
- No me generes todavía el service ni el controller, solo el repository.

Iteración: Antes de escribir código, contame en 3-4 líneas cómo pensás
resolver cada uno de los 5 métodos, y esperá mi confirmación antes de
darme el código final.
```

**Auto-chequeo de las 5 partes EFSI** (marcá lo que incluiste):
- [x] Rol
- [x] Contexto (¿pegaste código del proyecto?)
- [x] Tarea
- [x] Restricciones
- [x] Iteración

**Qué me devolvió (resumen):**
```
Primero un plan de 5 líneas (una por método: getAll, getById, create,
update, delete) explicando qué SQL y qué método de DbPg usaría cada uno.
Tras confirmar, generó materias-repository.js con la clase
MateriasRepository, calcada 1:1 de CursosRepository: mismo constructor con
console.log, mismos 5 métodos async, mismas queries parametrizadas con
$1/$2, y entity?.nombre ?? '' en el create/update.
```

**¿Me sirvió tal cual, o tuve que corregir/repreguntar?**
```
Lo compare con el otro trabajo que tenia el mismo requisito y lo deje.
```

### Prompt #2 — Service

**Lo que escribí:**
```
Generame materias-service.js siguiendo el mismo patrón que
cursos-service.js [pegado], que use el materias-repository.js ya generado
y aprobado en el paso anterior. Mismas restricciones que antes: sin
dependencias nuevas, mantener los console.log, delegar todo en el
repository.
```

**Por qué necesité este segundo prompt** (qué falló o faltó en el anterior):
```
No fue por un error del prompt anterior: seguí la recomendación del
enunciado de generar de a una capa (repository → revisar → service →
revisar → controller) en vez de pedir las 3 juntas, para poder revisar
cada capa por separado.
```

**Qué me devolvió (resumen):**
```
materias-service.js con la clase MateriasService, que instancia
MateriasRepository en el constructor y expone los 5 métodos
(getAllAsync, getByIdAsync, createAsync, updateAsync, deleteByIdAsync),
cada uno delegando directamente en el repository y logueando con
console.log, igual que CursosService.
```

**¿Me sirvió tal cual, o tuve que corregir/repreguntar?**
```
⬅️ COMPLETAR
```

### Prompt #3 — Controller

**Lo que escribí:**
```
Generame materias-controller.js. Te paso dos referencias:
cursos-controller.js y alumnos-controller.js. Usá como base
cursos-controller.js (es el patrón limpio, sin el endpoint extra
/test-insert que tiene alumnos-controller.js). Fijate en ambos cómo
manejan la validación del PUT (id de la URL vs id del body) y replicá
exactamente esa lógica. Mismas restricciones: status codes correctos
(200, 201, 404, 400), sin dependencias nuevas, usando
materias-service.js ya aprobado.
```

**Por qué necesité este tercer prompt:**
```
Última capa del patrón de a-una-por-vez. Además, al tener DOS archivos de
referencia (cursos y alumnos) con pequeñas diferencias entre sí, hizo
falta indicarle explícitamente cuál usar como base y por qué, para que
no arrastrara a materias el endpoint /test-insert ni el import de la
entidad Alumno, que no aplican.
```

**Qué me devolvió (resumen):**
```
materias-controller.js con el Router de Express, los 5 endpoints
(GET '', GET '/:id', POST '', PUT '/:id', DELETE '/:id'), status codes
StatusCodes.OK/CREATED/NOT_FOUND/BAD_REQUEST/INTERNAL_SERVER_ERROR según
corresponda, y la misma validación de id URL vs body en el PUT que tienen
cursos-controller.js y alumnos-controller.js.
```

**¿Me sirvió tal cual, o tuve que corregir/repreguntar?**
```
⬅️ COMPLETAR
```

### Prompt #4 — Registrar en server.js

**Lo que escribí:**
```
Te paso mi server.js actual. Agregale el import de MateriasController y
la línea app.use("/api/materias", MateriasController), siguiendo el mismo
estilo con el que ya están registrados AlumnosController y
CursosController.
```

**Qué me devolvió (resumen):**
```
El import agregado junto a los de Alumnos y Cursos, y la línea
app.use("/api/materias", MateriasController) agregada al bloque de
endpoints, con los espacios realineados para que las tres rutas
(/api/alumnos, /api/cursos, /api/materias) queden prolijas en columna.
```

### Prompt #5 — Script SQL

**Lo que escribí:**
```
Te paso mi script-postgress.sql actual (tiene cursos y alumnos).
Agregale al final, respetando el mismo estilo de comentarios y
convenciones, las tablas materias y calificaciones según este DDL:
[pegar el script SQL del enunciado del ejercicio]
```

**Qué me devolvió (resumen):**
```
El script original con el CREATE TABLE materias, el CREATE TABLE
calificaciones (con las FKs a alumnos e id_materia, y el UNIQUE
(id_alumno, id_materia)), y los 5 INSERT de materias agregados al final,
manteniendo el mismo estilo de comentarios "-- Tabla X" y
"-- INSERTS PARA X" que ya tenía el archivo.
```
---

## 3. 🔧 Qué hizo la IA y qué hice yo

| Archivo / función | Lo generó la IA | Lo modifiqué/escribí yo | Por qué |
|---|---|---|---|
| `materias-repository.js` | Estructura completa de la clase y los 5 métodos CRUD |
| `materias-service.js` | Estructura completa delegando en el repository | 
| `materias-controller.js` | Los 5 endpoints con status codes y validación de PUT | 
| `server.js` | Import + `app.use("/api/materias", ...)` | ⬅️ COMPLETAR (¿lo pegaste tal cual o reacomodaste algo más?) | |
| `script-postgress.sql` | `CREATE TABLE materias`, `CREATE TABLE calificaciones` + inserts | Ejecuté el script en mi base |

---

## 4. 🐛 Errores o cosas mal que detecté en la respuesta de la IA

```
1. Tildes sacadas sin avisar antes de generar el código (script SQL).
   El enunciado pedía los inserts con 'Matemática' y 'Programación', pero
   la IA los generó como 'Matematica' y 'Programacion' (sin tilde), por
   una decisión unilateral de "seguridad de encoding" que no era necesaria:
   Postgres con UTF8 soporta tildes sin problema. Esto es exactamente el
   tipo de cosa que hay que revisar línea por línea y no asumir que la IA
   respetó el enunciado al pie de la letra. LO CORREGÍ / LO DEJÉ ASÍ:
   ⬅️ COMPLETAR (decidí vos y contá qué hiciste).

2. Falta de validación de datos en el service y el controller.
   Ni materias-service.js ni materias-controller.js validan que `nombre`
   no venga vacío, ni que respete el largo máximo de la columna
   (VARCHAR(75)). Si mando un POST con nombre de más de 75 caracteres,
   el error lo termina tirando Postgres, lo agarra el catch genérico del
   controller y devuelve 400 con el mensaje de error crudo de la base
   (ej: "value too long for type character varying(75)"), no un mensaje
   de validación propio. Esto es intencional según el patrón de `cursos`
   (que tampoco valida), pero es una limitación real que heredé sin
   cuestionar. El enunciado mismo avisa que las validaciones "en serio"
   se ven en el ejercicio 04, así que lo dejé así a propósito, pero vale
   la pena dejarlo anotado acá como algo que la IA no resolvió porque
   nunca se lo pedí.

3. Los ids en GET /:id y DELETE /:id no se parsean con parseInt.
   A diferencia del PUT (que sí hace `parseInt(req.params.id)` para
   comparar con el id del body), en GET /:id y DELETE /:id el id se pasa
   tal cual llega como string a la query ($1). Postgres lo castea
   automáticamente si es un número válido, pero si mando algo no numérico
   (ej: GET /api/materias/abc) el error también termina en el catch
   genérico devolviendo 500 en vez de un 400 más claro tipo "id inválido".
   Esto no es un bug que introdujo la IA para materias en particular:
   es el mismo comportamiento que ya tiene cursos-controller.js y
   alumnos-controller.js, así que lo mantuve por consistencia con el
   patrón

4. La IA generó las 3 capas casi calcadas del patrón de `cursos`, sin
   margen real de "creatividad" o desvío — lo cual en este ejercicio es
   justamente lo esperado (el objetivo es "mirá cómo está hecho esto,
   hacelo igual"), pero significa que hay poco para marcar como
   corrección propia real en el código. Lo que sí es mío es la decisión
   de qué archivo usar como base para el controller (cursos, no alumnos)
   y la corrección de las tildes si la hice.
---

## 5. ✅ Verificación

```
[Si ] El repository delega el acceso a datos en DbPg (this.db.queryAll/queryOne/...)
[ Si] Las queries usan placeholders $1, $2...
[Si ] El controller devuelve los status codes correctos (200, 201, 404, 400)
[Si ] El update valida que el id de la URL coincida con el del body
[Si ] El controller está registrado en server.js y los 5 endpoints responden en Postman
[Si] No aparecieron dependencias nuevas en package.json

---

## 6. ✍️ Reflexión (300–600 palabras)

```
⬅️ COMPLETAR. Como guía, tocá estos puntos:

- Por qué generaste de a una capa (repository → service → controller) en
  vez de pedir todo junto, y qué ventaja notaste al revisar cada capa por
  separado.
- Qué diferencia notaste entre pasarle cursos-repository.js como
  referencia de estilo vs. no pasárselo (podés probar ambos casos para
  comparar y contarlo acá).
- Al tener dos referencias distintas para el controller (cursos y
  alumnos), qué pasó si no le aclarabas cuál usar como base — ¿la IA
  eligió bien sola, o arrastró algo de alumnos-controller.js que no
  correspondía (como el endpoint /test-insert)?
- Al menos un bug o mala práctica concreto que encontraste y corregiste
  (usá lo que completaste en la sección 4).
- Qué aprendiste sobre el patrón `??` vs `||` al revisar
  alumnos-repository.js (la pregunta del enunciado sobre
  hace_deportes = false: qué pasaría si se usara `|| ''` /
  `|| 0` con un valor false o 0 real).
- Qué harías distinto la próxima vez al escribir el prompt.
```
