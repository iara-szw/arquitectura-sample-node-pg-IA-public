# 📓 Bitácora de Prompts — Ejercicio N° 3


---

## Datos

- **Alumno/a:** Iara S
- **Ejercicio:** N° 4— Validación y manejo de errores
- **Fecha:** 12/8
- **Modelo de IA usado:** Chagpt

---

## 1. 🎯 Qué me pidieron

Detectar y armar validaciones que validen los inputs y los datos que llegan para evitar que lleguen a la data base si no tienen el formato correcto.
```
...
```

---

## 2. 💬 Mis prompts (en orden)

### Prompt #1

**Lo que escribí:**
```
Estoy haciendo un proyecto de aprendizaje de prompting y uso de la IA. Esta es mi consigna...

[Pegé toda la consigna del Ejercicio 04 — Validaciones y códigos de error]

También adjunté:
- alumnos-controller.js
- alumnos-service.js
- alumnos-repository.js
```

**Qué me devolvió (resumen):**
```
La IA analizó los archivos y detectó los principales agujeros de validación. Identificó que el POST pasa directamente req.body al service, que el repository completa valores faltantes con '', 0 y null, y que el id se maneja de manera diferente en GET, PUT y DELETE.
```

**¿Me sirvió tal cual, o tuve que corregir/repreguntar?**
```
Me sirvió para identificar los problemas, pero todavía no quería implementar nada. Por eso seguí con un prompt de diagnostico más específico.

```

### Prompt #2

**Lo que escribí:**
```
"Hace una tabla de todos los inputs que el usuario puede mandar y que pasa hoy si cada uno viene vacio, con tipo incorrecto, o malicioso. No escribas codigo todavia — quiero ver los agujeros."
```
**Qué me devolvió (resumen):**
```
Tabla de todos los inputs y para cada uno que pasaba si faltaba, si tenia un tipo incorrecto o si tenia un valor invalido.

Tambien detecto que el repository estaba ocultando errores mediante valores por defecto.
```
### Prompt #3

**Lo que escribí:**
```
Propone un patron de validacion consistente para esta arquitectura en capas.
¿Validacion en middleware, en el service, o con una libreria?
Dame pros y contras de cada uno para un proyecto educativo sin dependencias pesadas.
```
**Qué me devolvió (resumen):**
```
La IA comparo distintas alternativas.La recomendacion fue usar helpers de validacion llamados desde el controller, manteniendo las reglas de negocio en el service y el acceso a datos en el repository. Asi se comprueban los datos mediante lleguen por el controller y no llegan ni al service ni al repository

Tambien recomendo no agregar una libreria como Zod o Joi porque el proyecto no necesita una dependencia adicional para estas validaciones.
```
### Prompt #4

**Lo que escribí:**
```
(Realizar el codigo) Primero realiza el helper.
```
**Qué me devolvió (resumen):**
```
Codigo para el helper.
```

### Prompt #5

**Lo que escribí:**
```
Le mande los otros controllers,repository y service, y modifica los tres en medida de lo que sea necesario para que utilizen la verificacion del helper sin modificar ninguna regla de negocio o consulta, solo cuando se realicen validaciones  presentes en el helper.
```
**Qué me devolvió (resumen):**
```
Codigo del controller, repository y service.
```

---
Promt #5 y #6
Note que habia un problema con un request en postman porque llegaba como correcto cuando mandaba 123 como nombre pero era error de mi implementación de la prueba no del codigo. Despues le cuestione el formato que aceptaba para las fechas y lo modifique

## 3. 🔧 Qué hizo la IA y qué hice yo

Archivo / funcion       	Lo genero la IA	        Lo modifique/escribi yo        	Por que
validaciones-helper.js	    Si	                    Si, revise las reglas	        La IA propuso el helper, pero revise que campos debia validar y como

parsearId	                Si	                    Si, lo revise	                Queria que GET, PUT y DELETE usaran exactamente el mismo criterio

validarAlumno	            Si	                    Si	                            Revise que debia ser obligatorio y que tipos aceptar
fecha_nacimiento	        Si	                    Si                             	Detecte que queria una validacion estricta YYYY-MM-DD
alumnos-controller.js	    Si	                    Si, revise y adapte	            La validacion debia ejecutarse antes del service
alumnos-service.js	        Si                    	Si, revise	                    Mantuve validarCursoExiste como regla de negocio
alumnos-repository.js	    Si	                    Si, revise	                    Quite la idea de completar silenciosamente datos invalidos
Manejo de errores	        Si	                    Si	                            Revise la diferencia entre 400, 404 y 500
Pruebas con Postman	        No	                    Si	                            Yo probe los casos y detecte comportamientos que necesitaban correccion

---

## 4. 🐛 Errores o cosas mal que detecté en la respuesta de la IA

La primera implementacion de fecha_nacimiento usaba Date.parse(), pero decidi que era demasiado permisiva porque dejaba que fechas en cualquier formato existiesen como correctas. La cambie para exigir especificamente el formato YYYY-MM-DD y comprobar que la fecha realmente exista.

Tambien tuve un problema al probar nombre=123. Al principio pense que la validacion no funcionaba porque estaba llegando como string, pero despues vi que era porque estaba mandando "123" entre comillas. Eso significa que el valor era correctamente un string y no un numero. Esto me ayudo a diferenciar entre validar el tipo de un dato y validar si su contenido es valido.
```
...
```

---

## 5. ✅ Verificación

- [Si] `POST /api/alumnos` con body `{}` devuelve **400** (no 500, no un 201 con campos vacíos).
- [Si] `POST` con `id_curso` que no existe sigue devolviendo el error de negocio correcto (no rompas `validarCursoExiste`).
- [Si] `GET /api/alumnos/abc` (id no numérico) devuelve **400** con un mensaje claro, no un 500 críptico.
- [Si] El `id` se valida y convierte con **un solo helper** (`parsearId`), usado en `GET`, `PUT` y `DELETE` — ya no hay un endpoint con `parseInt` y otro sin él.
- [Si] Los mensajes de error **no incluyen** el texto crudo del error de PostgreSQL (nombres de tablas, columnas, etc.).
- [Si] La validación es **consistente**: `alumnos` y `cursos` validan con el mismo patrón.
- [Si] Mostrás que entendés **dónde** pusiste la validación y por qué (no "porque la IA la puso ahí").
```
...
```

---

## 6. ✍️ Reflexión (300–600 palabras)

Empece por el diagnostico de los problemas actuales, le subi el codigo a la IA y esta reviso y me mostro lo que habia encontrado. Ahi revise que esto considiera con lo dicho en la consigna y lo ejecute para que hiciese el codigo. Al hacerlo todos los archivos tenian el nombre de validaciones-helper y no validacion-helper como lo tenia yo en mi trabajo asi que lo modifique en cada hoja para no cambiar lo que ya habia hecho. Una vez hecho probe los casos con el postman y daba todo bien pero me quedo dudas con lo de la fecha de nacimiento y el nombre como string pero con numeros, ahi lo resolvi como escribi antes y antes de terminar comprobe que fuese igual a cursos y modifique minimamente a cursos para que coincidiera con alumnos y el helper.

```
...
```

---