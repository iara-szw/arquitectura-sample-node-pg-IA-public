# 📓 Bitácora de Prompts — Ejercicio N° 5


---

## Datos

- **Alumno/a:** Iara S
- **Ejercicio:** N° 5— Validación y manejo de errores
- **Fecha:** 13/8
- **Modelo de IA usado:** Chagpt

---

## 1. 🎯 Qué me pidieron

Agregar validaciones de JWT para autenticar quien podia hacer las operaciones sensibles (Put,Post,delete) y que requiera el token de JWT 
```
...
```

---

## 2. 💬 Mis prompts (en orden)

### Prompt #1

**Lo que escribí:**

```text
Estoy trabajando en una API de Alumnos con Node.js, Express y PostgreSQL. Actualmente todos los endpoints son públicos, por lo que cualquiera podría hacer, por ejemplo, DELETE /api/alumnos/3 sin iniciar sesión ni presentar ningún tipo de credencial.

Quiero agregar autenticación mediante JWT para solucionar este problema, pero necesito mantener la arquitectura que ya tiene mi proyecto y no modificar innecesariamente las partes que ya funcionan.

Necesito implementar lo siguiente:

- Un endpoint POST /api/auth/login que reciba credenciales y, si son correctas, devuelva un JWT.
- Un middleware llamado authMiddleware que valide el JWT recibido mediante el header:
  Authorization: Bearer <token>
- El middleware tiene que rechazar la petición con código 401 cuando no se envía el header, cuando está mal formado, cuando el token es inválido o cuando está expirado.
- Quiero que los distintos casos de error estén diferenciados mediante mensajes claros para poder comprobarlos en Postman.
- Las operaciones de escritura POST, PUT y DELETE tienen que quedar protegidas mediante el middleware.
- Las operaciones GET pueden quedar públicas. En este TP prefiero dejarlas públicas porque solamente realizan consultas y no modifican información. Si considerás que hay una razón importante para protegerlas también, explicámela antes de cambiar esa decisión.

Hay algunas restricciones de seguridad que tenés que respetar sí o sí:

1. El secreto utilizado para firmar y verificar el JWT tiene que leerse exclusivamente desde process.env.JWT_SECRET. Nunca quiero un secreto hardcodeado en un archivo .js, como por ejemplo:
   const SECRET = "mi-secreto-super-seguro";

2. El token tiene que tener una expiración utilizando expiresIn. No quiero tokens que sean válidos indefinidamente.

3. Para validar el token en el middleware tenés que utilizar jwt.verify(). No uses jwt.decode() para validar la autenticidad del token. Sé que decode solamente permite leer el payload y no verifica la firma.

4. El middleware tiene que comprobar que el token realmente fue firmado con nuestro secreto y que no haya expirado.

5. El archivo del middleware tiene que estar en:
   src/middlewares/authMiddleware.js

6. El proyecto utiliza ES modules, así que mantené ese sistema de imports y exports.

7. El secreto tiene que estar definido en el archivo .env mediante JWT_SECRET y no debe quedar expuesto en el código fuente.

Para el login, como se trata de un TP educativo, se puede utilizar un usuario y contraseña fijos para simplificar la autenticación. Sin embargo, no quiero presentar esto como una solución de producción. En una aplicación real, las credenciales deberían estar almacenadas en una tabla de usuarios y las contraseñas deberían guardarse mediante hashing, por ejemplo con bcrypt, en lugar de compararse directamente como texto plano.

También quiero que me indiques cómo debería quedar la estructura de archivos, qué archivos tengo que crear o modificar y cómo aplicar el middleware solamente a las rutas que correspondan.

Por último, explicame cómo puedo probar todo desde Postman. Quiero comprobar tanto los casos correctos como los errores:
- login correcto;
- login con credenciales incorrectas;
- request protegida sin Authorization;
- Authorization mal formado;
- token inválido;
- token expirado;
- request protegida con token válido.

Importante: un JWT no está encriptado. Está codificado y firmado, por lo que el payload puede ser leído. Por eso no quiero que se incluyan datos sensibles dentro del token.

Primero analizá cómo adaptar esta solución a la arquitectura que ya tengo y después indicame los cambios concretos.
```

**Qué me devolvió (resumen):**

Me propuso implementar el login, crear `authMiddleware.js`, utilizar `process.env.JWT_SECRET` para firmar y verificar el token y agregar `expiresIn`. También explicó cómo aplicar el middleware a `POST`, `PUT` y `DELETE`, dejando los `GET` públicos.

Además, me indicó cómo probar los distintos casos desde Postman y me recordó que `jwt.verify()` es el método correcto para validar el token.

**¿Me sirvió tal cual, o tuve que corregir/repreguntar?**

Me sirvió como base para implementar la autenticación, pero después tuve que hacer preguntas más específicas para adaptar la solución a los archivos que ya tenía y comprobar que realmente funcionara con mi proyecto.

---

### Prompt #2

**Lo que escribí:**

```
Mi API ya está organizada separando controllers, services, repositories y acceso a PostgreSQL. Quiero que mantengamos esa arquitectura.

Decime exactamente:

1. Qué archivo tengo que crear para authMiddleware.
2. Qué archivo debería contener el endpoint POST /api/auth/login.
3. Cómo debería importar y exportar el middleware usando ES modules.
4. En qué lugar de mis rutas tengo que aplicar authMiddleware.
5. Cómo deberían quedar las rutas de alumnos después del cambio, indicando cuáles son públicas y cuáles requieren JWT.

No quiero que muevas controllers, services o repositories si no es necesario.

También asegurate de que el middleware use:
process.env.JWT_SECRET

y:
jwt.verify()

y que el token se cree con:
expiresIn.

Mostrame el código necesario y explicame brevemente qué hace cada parte.
```

**Qué me devolvió (resumen):**

Me indicó dónde ubicar el middleware y cómo integrarlo con las rutas existentes. También mostró cómo proteger únicamente las operaciones de escritura y mantener los `GET` públicos.

---

### Prompt #3

**Lo que escribí:**

```
que verificar en mi código para asegurarme de que no cometí estos errores:

- que el JWT_SECRET esté hardcodeado;
- que el token no tenga expiración;
- que el middleware use jwt.decode() en lugar de jwt.verify();
- que una petición sin Authorization pueda acceder igualmente a POST, PUT o DELETE;
- que un token expirado sea aceptado;
- que el header Authorization no se esté validando correctamente.
```

**Qué me devolvió (resumen):**

Realizo una comprobación de mis archivos actuales y devolvio un analisis que probaba que las verificaciones se estaban cumpliendo

---

### Prompt #4

**Lo que escribí:**

```
Ya implementé el login y el middleware. Ahora quiero probarlo desde Postman para asegurarme de que la protección funciona realmente y no solamente que el login devuelve un token.

Dame un tabla de los request y las repsuestas esperadas

Quiero probar:

1. POST /api/auth/login con credenciales correctas → debería devolver el JWT.
2. POST /api/auth/login con credenciales incorrectas → debería devolver 401.
3. DELETE /api/alumnos/3 sin Authorization → debería devolver 401.
4. DELETE /api/alumnos/3 con un Authorization mal formado → debería devolver 401.
5. DELETE /api/alumnos/3 con un token inventado o inválido → debería devolver 401.
6. DELETE /api/alumnos/3 con un token expirado → debería devolver 401.
7. DELETE /api/alumnos/3 con un token válido → debería permitir que la operación continúe.

También quiero comprobar lo mismo con POST y PUT.

```

**Qué me devolvió (resumen):**
Devolvio la tabla de resultados para cada caso y los status codes que debian devolver. Ademas me paso el JSON para importar los casos con el bearer auth ya puesto en cada caso.

---

### Prompt #5

**Lo que escribí:**

```
Al probar el PUT de alumnos después de implementar los cambios me apareció un error de PostgreSQL:

"bind entrega 5 parámetros, pero la sentencia preparada requiere 6"

El error aparece cuando intento actualizar un alumno.

Te paso mi método updateAsync actual:

[pegué el código de alumnos-repository.js]

Quiero que analices únicamente este error y me indiques exactamente por qué PostgreSQL dice que necesita 6 parámetros pero recibe 5.

No quiero cambiar la arquitectura ni modificar otras partes del proyecto. Solamente quiero corregir lo necesario para que el UPDATE funcione.

Además, verificá que los valores del array correspondan correctamente con los placeholders $1, $2, $3, $4, $5 y $6 de la consulta SQL.
```

**Qué me devolvió (resumen):**

Detectó que la consulta SQL utilizaba seis parámetros (`$1` a `$6`), pero el array `values` solamente enviaba cinco.

El problema era que faltaba `entity.id` como primer valor del array. La IA me mostró cómo corregir el orden de los parámetros para que coincidieran con los placeholders del `UPDATE`.

Este error no estaba causado por JWT, pero apareció durante las pruebas del endpoint protegido y tuve que resolverlo para poder verificar que el `PUT` siguiera funcionando correctamente.


## 3. 🔧 Qué hizo la IA y qué hice yo

| Archivo / función        | Lo generó la IA | Lo modifiqué /escribí yo | Por  qué                                                                                 |
| ------------------------ | --------------- | ----------------------- | --------------------------------------------------------------------------------------- |
| `authMiddleware.js`      | Si              | Si, lo revise           | La IA propuso el middleware, pero revise como debia validar el token y los errores 401. |
| `POST /api/auth/login`   | Si              | Si, lo adapte           | Necesitaba adaptarlo a la estructura de mi proyecto y a mis credenciales.               |
| `process.env.JWT_SECRET` | Si              | Si, lo revise           | Queria asegurarme de que el secreto no quedara hardcodeado.                             |
| `jwt.verify()`           | Si              | Si, lo revise           | Verifique que se validara la firma y no solamente se leyera el token.                   |
| Rutas protegidas         | Si              | Si, lo adapte           | Queria que `POST`, `PUT` y `DELETE` requirieran JWT y que los `GET` siguieran publicos. |
| Pruebas con Postman      | No              | Si                      | Yo probe los casos con y sin token y revise las respuestas. Ademas modifique un par para que concidieran con el formato actual del resto de las comprobaciones                             |
| Error del `UPDATE`       | Si              | Si, lo corregi          | Detecte que faltaba el `id` en los parametros de la consulta.                           |


---

## 4. 🐛 Errores o cosas mal que detecté en la respuesta de la IA
Como puse las restricciones en el promt inicial no detecte errores en un principio pero despues durante las pruebas de postman aparecio el error de PostgreSQL:

bind entrega 5 parametros, pero la sentencia preparada requiere 6

La causa era que faltaba entity.id en el array de parametros del UPDATE. Por esto no me estaba dejando modificar un alumno aunque todos los datos estaban bien

---

## 5. ✅ Verificación

- [ SI] `POST /api/auth/login` con credenciales correctas devuelve un token; con incorrectas, **401**.
- [si] `DELETE /api/alumnos/3` **sin** header `Authorization` devuelve **401** (no 200, no 500).
- [ si] Con un token **inválido o vencido** devuelve **401**.
- [si ] Con un token **válido** funciona normal.
- [si ] El secreto está en `.env` (revisá que no quedó hardcodeado en ningún `.js`).
- [si ] El middleware usa `jwt.verify` (no `jwt.decode`).
- [si ] El `.env` con el secreto **no está commiteado** (está en `.gitignore`).
```
...
```

---

## 6. ✍️ Reflexión (300–600 palabras)
Lo primero fue definir las operaciones que iban a tener la verificacion del token para ser realizadas, siendo las put,post y delete. Claramente el JWT secret tenia que ir en el env por razones de seguridad y entendi la diferencia entre jwt.decode() y jwt.verify, y como no esta encriptado dentro de jwt me asegure que la ia no ponga detaos sensibles dentro.

Probarlo en Postman me sirvio para comprobar que realmente funcionara y no quedarme solamente con que el login devolviera un token. Ademas, durante las pruebas encontre y corregi un error en el UPDATE de alumnos.

Para un TP esta implementacion esta bien, pero en un proyecto real usaria usuarios guardados en una base de datos y contrasenas protegidas con hashing, por ejemplo bcrypt.


```
...
```

---