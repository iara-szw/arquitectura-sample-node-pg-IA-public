[IA] Proceso para llegar a esto en bitacora
# Análisis de Arquitectura

## 1. Flujo actual de una request

La API está organizada principalmente siguiendo una arquitectura por capas:

**Controller → Service → Repository → Base de datos**

Por ejemplo, para crear un alumno, el flujo es:

```text
Cliente
   │
   │ POST /api/alumnos
   ▼
server.js
   │
   ▼
AlumnosController
   │
   ├── authMiddleware
   └── validarAlumno()
   │
   ▼
AlumnosService
   │
   ├── valida que exista el curso
   │       │
   │       ▼
   │   CursosService
   │       │
   │       ▼
   │   CursosRepository
   │
   ▼
AlumnosRepository
   │
   ▼
DbPg
   │
   ▼
PostgreSQL
   │
   ▼
resultado
   │
   ▼
AlumnosController
   │
   ▼
respuesta HTTP al cliente
```

Los **Controllers** reciben las requests y se encargan principalmente de las respuestas HTTP y las validaciones iniciales. Los **Services** contienen la lógica de negocio. Los **Repositories** realizan las consultas a la base de datos y `DbPg` se encarga de comunicarse con PostgreSQL.

Además, `BaseRepository` concentra operaciones que se repiten entre distintos repositories, como `getAllAsync`, `getByIdAsync` y `deleteByIdAsync`.

---

# 2. Problemas y decisiones discutibles

## Problema 1: `DbPg` oculta los errores de la base de datos

Actualmente, los métodos de `DbPg` capturan los errores y solamente los registran mediante `LogHelper`:

```js
catch (error) {
    LogHelper.logError(error);
}
```

Después de eso, el método devuelve `null`, `0` u otro valor por defecto.

### ¿Qué problema genera?

Las capas superiores no pueden distinguir fácilmente entre un resultado válido y un error de la base de datos.

Por ejemplo, si falla un `INSERT` en PostgreSQL, `queryReturnId()` devuelve `0`. El controller recibe ese `0` y responde:

```js
responderErrorInterno(res, 'No se pudo crear el alumno.');
```

Pero se pierde la causa real del problema. Podría haber sido un error de conexión, una restricción de la base de datos o un problema en la consulta.

### Recomendación

Mantendría el registro del error, pero también lo volvería a lanzar:

```js
catch (error) {
    LogHelper.logError(error);
    throw error;
}
```

De esta forma, el error puede subir hasta las capas superiores y ser manejado correctamente.

### Trade-off

**Gano:** mejor manejo de errores y mayor información para detectar y solucionar problemas.

**Pierdo:** las capas superiores tienen que manejar correctamente las excepciones para evitar que lleguen sin controlar al cliente.

---

## Problema 2: `CursosService` funciona principalmente como *pass-through*

Actualmente, muchos métodos de `CursosService` solamente llaman al repository y devuelven el resultado. Por ejemplo:

```js
getByIdAsync = async (id) => {
    const returnEntity =
        await this.CursosRepository.getByIdAsync(id);

    return returnEntity;
}
```

En este caso, el Service no está agregando lógica de negocio.

### ¿Qué problema genera?

Para una operación sencilla, la request pasa por una capa que actualmente no aporta comportamiento propio:

```text
CursosController
      ↓
CursosService
      ↓
CursosRepository
```

Esto agrega código y una capa intermedia sin una necesidad clara en el estado actual del proyecto.

### Recomendación

Evaluaría eliminar `CursosService` y hacer que `CursosController` trabaje directamente con `CursosRepository`, siempre que los cursos no necesiten lógica de negocio adicional.

No aplicaría esta decisión automáticamente a `MateriasService`, porque las operaciones de materias podrían incorporar validaciones o reglas de negocio propias.

### Trade-off

**Gano:** menos código y menos capas innecesarias para una entidad que actualmente tiene poca lógica.

**Pierdo:** se pierde la estructura uniforme `Controller → Service → Repository` y, si posteriormente aparecen reglas de negocio para cursos, habría que volver a incorporar una capa de Service.

---

## Problema 3: Cada Repository crea su propio `DbPg` y `Pool`

En `BaseRepository`, cada repository crea una nueva instancia de `DbPg`:

```js
constructor(tableName, logPrefix) {
    this.db = new Db();
}
```

A su vez, cada instancia de `DbPg` crea su propio `Pool` cuando necesita conectarse.

Actualmente, con las tres entidades principales, la estructura puede quedar así:

```text
AlumnosRepository ──→ DbPg ──→ Pool 1
CursosRepository  ──→ DbPg ──→ Pool 2
MateriasRepository ─→ DbPg ──→ Pool 3
```

Si el proyecto creciera y hubiera diez repositories, podrían existir diez pools independientes.

### ¿Qué problema genera?

Se pueden crear más pools de conexiones de los necesarios. Esto consume recursos y hace que la administración de las conexiones a PostgreSQL esté distribuida entre distintas instancias.

### Recomendación

Utilizar una única instancia compartida de `DbPg` o, más directamente, un único `Pool` para toda la aplicación:

```text
AlumnosRepository ─┐
CursosRepository ──┼──→ DbPg → Pool único → PostgreSQL
MateriasRepository ┘
```

Los distintos repositories utilizarían ese mismo pool para realizar sus consultas.

### Trade-off

**Gano:** menor consumo de recursos, mejor administración de las conexiones y una solución más escalable si aumenta la cantidad de repositories.

**Pierdo:** hay que agregar una forma correcta de compartir la instancia y manejar sus dependencias, lo que aumenta un poco la complejidad de la configuración.

---

# 3. Conclusión

La arquitectura actual tiene una buena separación de responsabilidades y el uso de `BaseRepository` permite reducir bastante la repetición de código. Sin embargo, encontré algunas decisiones que podrían mejorarse.

La primera mejora que considero importante es **no ocultar los errores en `DbPg`**, ya que actualmente un error de PostgreSQL puede convertirse simplemente en un `null` o `0` y perder información importante.

También considero discutible mantener `CursosService` en su forma actual, porque funciona principalmente como un *pass-through*. En cambio, `MateriasService` lo mantendría porque puede incorporar lógica y validaciones propias.

Por último, revisaría la creación de los `Pool` de PostgreSQL para que exista **un pool compartido por toda la aplicación**, evitando crear uno por cada repository.

En general, no considero que estas decisiones hagan que la arquitectura actual esté mal, sino que son puntos que podrían mejorarse pensando en **mantenibilidad, manejo de errores y escalabilidad**.
