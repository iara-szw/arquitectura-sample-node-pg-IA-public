# 📓 Bitácora de Prompts — Ejercicio N° 02

> Esta bitácora es parte de la nota. Un ejercicio sin bitácora no se corrige.

---

## Datos

- **Alumno/a:** ⬅️ Iara S
- **Ejercicio:** N° 02— Refactorizacion del CRUD repetido
- **Fecha:** ⬅️ 7/8
- **Modelo de IA usado:** ⬅️ Claude

---

## 1. 🎯 Qué me pidieron

```
Refactorizar el codigo de los repositories para que no haya codigo duplicado.
```

---

## 2. 💬 Mis prompts (en orden)

### Prompt #1 — 


**Lo que escribí:**
```
(ya tenia el contexto del proyecto)
[subida de archivos alumnos,cursos y materias repository]
Identifica codigo duplicado y/o obsoleto en estos archivos y diseña estrategias para eliminarlo. Devolveme estas estrategias.

**Qué me devolvió (resumen):**
```
-Las dos opciones que estaban en la consigna + C- Solo el logging como cross-cutting concern

Si no querés tocar la lógica SQL para nada, podés al menos sacar el patrón repetido de console.log(...) con un decorator/wrapper que loguee entrada y salida de cada método automáticamente (usando el nombre de la clase y del método vía Proxy o un helper).

✅ El cambio más chico y seguro, cero riesgo de romper queries.
⚠️ Resuelve la parte menos importante de la duplicación (es ruido visual, no lógica real).

```

**¿Me sirvió tal cual, o tuve que corregir/repreguntar?**
```
Elegi la primera opción que ya habia elegido desde la consigna. Y tome el diagnostico para pasar como promt.
```

### Prompt #2 — 

**Lo que escribí:**
```
Contexto:
Tengo una API REST en Express con arquitectura en capas (controller → service → 
repository), usando `pg` (NO un ORM) con un Pool, queries parametrizadas $1/$2/etc,
y un patrón de logging propio (LogHelper) que se usa en cada método de cada capa.

Tengo tres repositories con código repetido: AlumnosRepository, CursosRepository y 
MateriasRepository. Los métodos getAllAsync, getByIdAsync y deleteByIdAsync son 
IDÉNTICOS entre las tres clases salvo el nombre de la tabla. Los métodos createAsync 
y updateAsync varían: alumnos tiene 5 columnas y en el update hace un merge con la 
entidad previa (busca el registro existente y completa los campos ausentes con los 
valores previos antes de actualizar); cursos y materias tienen 1 sola columna 
(nombre) y no hacen merge.

Tarea:
Implementá una clase BaseRepository de la que las tres clases (AlumnosRepository, 
CursosRepository, MateriasRepository) hereden. La BaseRepository debe centralizar 
getAllAsync, getByIdAsync y deleteByIdAsync (recibiendo el nombre de tabla por 
constructor). createAsync y updateAsync quedan implementados en cada clase hija, 
ya que su lógica es distinta entre entidades.

Restricciones (son críticas, no las relajes):
1. La API pública no debe cambiar: mismos nombres de método, misma firma, mismo 
   valor de retorno que antes. Los controllers y services NO se tocan.
2. Los tests / colección de Postman tienen que seguir pasando igual: mismos status 
   codes, mismo JSON de respuesta, para los 5 endpoints de alumnos, cursos y materias.
3. No rompas el patrón de LogHelper: cada método sigue logueando igual que antes 
   (mismo formato, identificando la clase y el método que se ejecuta).
4. Seguí usando `pg` con SQL crudo. NO introduzcas Sequelize, Prisma, TypeORM ni 
   ningún ORM. NO agregues dependencias nuevas al package.json.
5. La regla de negocio de alumnos (el merge con previousEntity en updateAsync) 
   tiene que seguir funcionando exactamente igual — no la generalices ni la muevas 
   a la clase base.
6. El nombre de tabla y las columnas de INSERT/UPDATE de cada entidad tienen que 
   seguir siendo fáciles de identificar y modificar en cada clase hija (no lo 
   escondas dentro de un mapeo genérico difícil de leer).

Iteración:
Después de que me muestres el resultado, quiero que me digas: cuántas líneas tenía 
cada repository antes vs. cuántas tiene ahora, y cuántas líneas de lógica quedaron 
compartidas en un solo lugar (BaseRepository). Si el número de líneas duplicadas no 
bajó de forma clara, decime por qué y ajustamos el enfoque.
```

**Por qué necesité este segundo prompt** (qué falló o faltó en el anterior):
```
Para conseguir el codigo para el base repository
```
**Qué me devolvió (resumen):**
```
Codigo de Baserepository+el codigo actualizado del resto de repositories.
```

**¿Me sirvió tal cual, o tuve que corregir/repreguntar?**
```
Sirvio. Probe el codigo dado con Postman y este funcionaba correctamente
```

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
[Si ] Los 5 endpoints de `alumnos`, `cursos` y `materias` siguen respondiendo igual que antes (mismos status codes, mismo JSON). Probalo en Postman antes y después.
[ Si]  La lógica común está en un solo lugar (si arreglás un bug en `getAllAsync`, se arregla para todas las entidades).
[Si ]  Lo específico de cada entidad (nombre de tabla, columnas del INSERT/UPDATE) sigue siendo claro y fácil de cambiar.
[Si ] La regla de negocio de alumnos (calcular edad, validar que el curso existe) no se perdió en el refactor.
[Si ] El controller está registrado en server.js y los 5 endpoints responden en Postman
[Si]  No se agregó un ORM ni dependencias nuevas.


---

## 6. ✍️ Reflexión (300–600 palabras)
Le subi los tres repositories actuales a la idea, pidiendo que identifique los casos de codigo duplico, al analizar su respuesta la vi bastante bien y tome las restricciones ya en la consigna + las que la propia ia noto como problemas o peligros en caso de refactorizar con ia, y arme el promt principal. Lo que devolvio, al ser codigo simple funciono bien y al revisarlo no pude encontrar reduncias mayores y que definitivamente si se habia simplificado el codigo de cada repository, evitando la duplicacion.
```