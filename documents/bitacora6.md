# 📓 Bitácora de Prompts — Ejercicio N° 6


---

## Datos

- **Alumno/a:** Iara S
- **Ejercicio:** N° 6— Arquitectura de la aplicación
- **Fecha:** 14/8
- **Modelo de IA usado:** Chagpt

---

## 1. 🎯 Qué me pidieron

Realizar un analisis de la arquitectura actual del proyecto y detectar al menos 3 problemas, resolviendo uno de ellos
```
...
```

---

## 2. 💬 Mis prompts (en orden)

### Prompt #1

**Lo que escribí:**

```
Quiero hacer el analisis de arquitectura de mi proyecto. Te voy a pasar los archivos actuales de controllers, services, repositories, DbPg, helpers y middleware.

Necesito detectar entre 3 y 5 problemas o decisiones discutibles de la arquitectura actual. No quiero que inventes problemas que no esten realmente presentes en mi codigo.

Para cada problema quiero:
- explicar cual es el problema concreto;
- indicar que impacto puede tener en este proyecto;
- proponer una recomendacion;
- explicar el trade-off, es decir, que gano y que pierdo al hacer ese cambio.

Analiza especialmente si encontras problemas relacionados con:
- manejo de errores;
- uso de los services y repositories;
- acceso a la base de datos;
- reutilizacion de codigo;
- responsabilidades de cada capa;
- creacion y manejo de conexiones a PostgreSQL.

Primero analiza el codigo y despues propone los problemas.
```

**Qué me devolvió (resumen):**

La IA analizó las distintas capas del proyecto y propuso varios posibles puntos para revisar. Entre ellos aparecieron el manejo de errores de DbPg, el uso de CursosService, la creacion de instancias de DbPg y Pool, el uso de las entidades y la cantidad de console.log.
---

### Prompt #2

**Lo que escribí:**

```De los problemas que encontraste, no todos me convencen.

El uso de CursosService me parece discutible porque actualmente funciona como un passthrough: practicamente recibe una llamada y la pasa directamente al repository sin agregar logica.

En cambio, MateriasService si lo quiero mantener porque materias tiene operaciones POST, PUT y DELETE que pueden necesitar validaciones o logica propia en el futuro.

Tambien me parece interesante revisar que cada repository haga this.db = new Db() en su constructor, porque eso puede terminar creando un Pool diferente para cada repository.

Los entities no me parece que sean un problema suficientemente importante para este analisis y tampoco considero necesario modificar todos los console.log ahora.

Quiero que te quedes solamente con problemas que realmente tengan sentido en este proyecto.
```

**Qué me devolvió (resumen):**

La IA ajusto el analisis y dejo como posibles problemas mas relevantes:

DbPg oculta los errores de la base de datos.
CursosService funciona principalmente como passthrough.
Cada Repository crea su propia instancia de DbPg y potencialmente su propio Pool.

Tambien se descartaron los puntos que no parecian aportar demasiado al objetivo del ejercicio.

---

### Prompt #3

**Lo que escribí:**

```
De los problemas que quedan, quiero entender mejor el primero.

Problema 1: DbPg oculta los errores de la base de datos.

Explicame que problema concreto resuelve modificar esto en ESTE proyecto y dame un ejemplo de un bug o comportamiento incorrecto que se podria evitar.

No quiero una explicacion general de arquitectura. Quiero que lo relaciones directamente con el codigo que te pase.
```

**Qué me devolvió (resumen):**

Me explico que los metodos de DbPg actualmente tienen un catch que registra el error pero despues devuelve valores como null o 0.

Por ejemplo, queryReturnId() puede devolver 0 si PostgreSQL genera un error. De esta manera, las capas superiores no reciben el error real y pueden interpretar que simplemente no se creo el registro.

Esto podia dificultar diferenciar entre un resultado valido y un error de base de datos.
---

### Prompt #4

**Lo que escribí:**

```
Ahora quiero implementar solamente el problema de DbPg que oculta los errores.
No quiero modificar la arquitectura general ni tocar controllers, services o repositories innecesariamente.
Quiero que DbPg siga registrando el error mediante LogHelper, pero que despues de registrarlo lo vuelva a lanzar para que pueda ser manejado por las capas superiores.
Indicame exactamente que tengo que modificar en queryAll, queryOne, queryReturnId y queryRowCount.

```

**Qué me devolvió (resumen):**
Me indico modificar los catch de los metodos de DbPg para que, despues de:
LogHelper.logError(error);
se agregara:
throw error;
De esta manera el error continua subiendo por las capas en lugar de convertirse silenciosamente en null o 0.
---

### Prompt #5

**Lo que escribí:**

```
Ya implemente el cambio en DbPg. Como puedo probar que realmente funciona?
Quiero una prueba que provoque intencionalmente un error de PostgreSQL y me permita comprobar que:
1. DbPg registra el error.
2. El error vuelve a lanzarse con throw.
3. El controller recibe el error.
4. El cliente no recibe detalles internos de PostgreSQL, sino una respuesta generica de error interno.

Decime exactamente que puedo modificar temporalmente y que respuesta deberia esperar.
```

**Qué me devolvió (resumen):**

Me propuso modificar temporalmente el nombre de una tabla en alumnos-repository.js, por ejemplo usar alumnosXXX, para provocar un error de PostgreSQL.
Luego debia realizar un POST desde Postman.
La respuesta esperada era:
500
Ocurrio un error interno.
Mientras que en la consola del servidor debia aparecer el error real de PostgreSQL.
Despues de realizar la prueba comprobe que efectivamente funcionaba.

## 3. 🔧 Qué hizo la IA y qué hice yo

| Archivo / funcion                    | Lo genero la IA | Lo modifique / escribi yo | Por que                                                                                                               |
| ------------------------------------ | --------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `db-pg.js`                           | Si              | Si, lo implemente y probe | La IA detecto que los errores se estaban ocultando y propuso volver a lanzarlos despues de registrarlos.              |
| `queryAll()`                         | Si              | Si, lo revise             | Agregue el `throw error` para que los errores no se transformaran silenciosamente en `null`.                          |
| `queryOne()`                         | Si              | Si, lo revise             | Aplique el mismo criterio para mantener un manejo de errores consistente.                                             |
| `queryReturnId()`                    | Si              | Si, lo revise             | Era importante porque un error podia terminar devolviendo `0` y parecer una operacion que simplemente no se realizo.  |
| `queryRowCount()`                    | Si              | Si, lo revise             | Se modifico para que los errores de `UPDATE` o `DELETE` tambien lleguen a las capas superiores.                       |
| Prueba de error de PostgreSQL        | No              | Si                        | Yo realice la prueba modificando temporalmente el nombre de la tabla y comprobe la respuesta.                         |
| Analisis de arquitectura             | Si              | Si                        | La IA propuso posibles problemas, pero yo decidi cuales eran realmente relevantes para mi proyecto y cuales no.       |
| Seleccion del problema a implementar | No              | Si                        | Elegi implementar el manejo de errores de `DbPg` porque considere que tenia un impacto concreto y facil de comprobar. |


---

## 4. 🐛 Errores o cosas mal que detecté en la respuesta de la IA
Durante el analisis inicial la IA propuso varios posibles problemas, pero no todos me parecieron necesarios para este ejercicio.
Por ejemplo, primero aparecio como posibilidad eliminar o modificar MateriasService, pero decidi mantenerlo porque aunque actualmente tenga poca logica, materias tiene operaciones POST, PUT y DELETE y podria necesitar validaciones o logica propia.

Tambien considere que el problema de CursosService como passthrough era valido como observacion arquitectonica, pero no lo implemente porque no era necesario para cumplir el objetivo del ejercicio.
Finalmente elegi concentrarme en el problema de DbPg, que si tenia un comportamiento concreto que podia comprobar mediante una prueba.

---

## 5. ✅ Verificación

- [ si] El documento describe el flujo real de una request (verificable contra el código).
- [ si] Cada problema detectado **existe de verdad** en el código (no es genérico de "cualquier proyecto Node").
- [si ] Cada recomendación tiene un **trade-off explícito** (no solo ventajas).
- [ si] El cambio que implementaste **no rompe** los endpoints existentes.
- [si ] No metiste sobre-ingeniería: cada pieza nueva se justifica por un problema concreto.
```
...
```

---

## 6. ✍️ Reflexión (300–600 palabras)
En este ejercicio analice la arquitectura del proyecto y detecte algunos problemas que podian mejorarse. El que decidi resolver fue el manejo de errores de DbPg, porque estaba ocultando los errores de la base de datos y dificultaba saber que habia fallado. Modifique el codigo para que el error pueda llegar a las capas superiores, mientras que el controller sigue mostrando un mensaje de error interno al usuario. Despues lo probe provocando un error y comprobe que la API respondiera correctamente.

Tambien analice otras decisiones de la arquitectura, como el uso de CursosService y la creacion de distintos Pool de conexiones.

```
...
```

---