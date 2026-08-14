# 📓 Bitácora de Prompts — Ejercicio N° 7


---

## Datos

- **Alumno/a:** Iara S
- **Ejercicio:** N° 7— Arquitectura de la aplicación
- **Fecha:** 14/8
- **Modelo de IA usado:** Chagpt

---

## 1. 🎯 Qué me pidieron
Agregar testing al proyecto, que originalmente no tenía ningún framework
ni tests.

La idea era elegir un test runner, hacer tests unitarios de la función
calcularEdad cubriendo casos borde, agregar al menos un test de integración
de un endpoint y configurar npm test para poder ejecutar los tests.

Además, había que comprobar que los tests realmente sirvieran, rompiendo
la función a propósito y verificando que algún test fallara.
---
## 2. 💬 Mis prompts (en orden)

### Prompt #1

**Lo que escribí:**
Para esta función calcularEdad, listame todos los casos borde que debería
testear, incluyendo entradas inválidas. No escribas los tests todavía,
solo la lista de casos con el resultado esperado de cada uno.
(calcular edad)

**Qué me devolvió (resumen):**
Me dio una lista de casos para probar, incluyendo una fecha válida, null,
undefined, fechas inválidas, fechas futuras y años bisiestos.

Me sirvió para pensar primero qué casos tenía que cubrir antes de pedirle
directamente que escribiera el código.
### Prompt #2

**Lo que escribí:**
Mi proyecto no usa ningún framework de testing. Quiero agregar testing
sin instalar dependencias innecesarias.

Comparame node:test, Jest y Vitest para este proyecto y recomendame uno.
Quiero que sea simple de configurar y que funcione con mi proyecto que
usa Node.js y ES modules.

**Qué me devolvió (resumen):**
Me recomendó node:test porque ya viene incluido con Node, no requiere
agregar una dependencia y es suficiente para los tests unitarios y de
integración que pide el ejercicio.

### Prompt #3
Ahora quiero implementar los tests unitarios de calcularEdad usando
node:test y node:assert.

La función está en src/helpers/fechas-helper.js.

Generame los tests para los casos que analizamos, pero los resultados
esperados tienen que estar escritos manualmente y no calculados usando
la misma función que estoy testeando.

Además, el test de fechas no tiene que depender del día en que se
ejecute.
**Qué me devolvió (resumen):**
Generó un archivo calcularEdad.test.js con varios casos usando
node:test y assert.
### Prompt #4
Ejecuté npm test y los tests pasaron. Después cambié a propósito una
parte de calcularEdad para comprobar si algún test realmente detectaba
el error.

El test para calcularEdad('2005-02-30') espera NaN, pero está pasando
un número. Explicame por qué JavaScript hace esto y cómo debería
modificar calcularEdad para que una fecha como 2005-02-30 sea considerada
inválida.
**Qué me devolvió (resumen):**
new Date() puede corregir automáticamente fechas inválidas.
Por ejemplo, una fecha como 2005-02-30 puede transformarse internamente
en otra fecha válida en vez de producir Invalid Date.

### Prompt #5
Ahora necesito agregar el test de integración que pide el ejercicio.

Mi API tiene el endpoint GET /api/alumnos y actualmente server.js
usa app.listen() en el puerto 3000.

Quiero probar que el endpoint responda correctamente y que el test
compruebe tanto el status code como el body.

No quiero modificar innecesariamente la arquitectura del proyecto.
Decime cuál es la forma más simple de hacerlo con node:test.

**Qué me devolvió (resumen):**

Me propuso hacer un test contra http://localhost:3000/api/alumnos
utilizando fetch y comprobar el status 200 y el contenido de la
respuesta.

### Promt #6
Revisá los tests que hice para el ejercicio y comparalos con estos
requisitos:

- npm test corre y los tests pasan.
- Hay un test que falla si rompo calcularEdad a propósito.
- Hay un caso para fecha inválida y uno para null.
- El test de fecha no depende del día en que se corre.
- El test de integración verifica status code y body.
- Puedo explicar la diferencia entre un test unitario y uno de
  integración.

Decime si me falta algo y qué debería comprobar manualmente.

**Qué me devolvió (resumen):**

Comprobé que los tests unitarios detectaran cambios incorrectos en
calcularEdad y que el test de integración verificara el status code
además de la respuesta.

## 3. 🔧 Qué hizo la IA y qué hice yo
| Archivo / función      | Lo generó la IA        | Lo modifiqué/escribí yo    | Por qué                                                                                                        |
| ---------------------- | ---------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `calcularEdad.test.js` | Sí                     | Sí, revisé y corregí casos | Tuve que comprobar que los resultados esperados realmente fueran correctos y que los tests detectaran errores. |
| `calcularEdad()`       | Me ayudó a modificarla | Sí                         | Tuve que agregar la validación para detectar fechas como `2005-02-30`.                                         |
| Test de integración    | Sí                     | Sí, lo probé y adapté      | Necesitaba comprobar que el endpoint respondiera con el status y body esperados.                               |
| `package.json`         | Sí                     | Sí, lo revisé              | Agregué/configuré el script `npm test` para ejecutar los tests.                                                |
| Casos borde            | Sí, propuso varios     | Sí, los revisé             | No quería aceptar automáticamente todos los casos sin comprobar qué hacía realmente JavaScript con las fechas. |

## 4. 🐛 Errores o cosas mal que detecté en la respuesta de la IA
1. Un test seguia pasando aunque habia cambiado la funcion. Me di cuenta
de que no estaba comprobando realmente el resultado esperado.

2. El caso 2005-02-30 no funcionaba como esperaba porque JavaScript
corrige algunas fechas invalidas automaticamente. Tuve que modificar
calcularEdad para detectarlo.

3. El test de integracion daba ECONNREFUSED si el servidor no estaba
iniciado, asi que tuve que arrancar la aplicacion antes de probarlo.

## 5. ✅ Verificación

- [si ] `npm test` corre y los tests pasan.
- [si ] Hay un test que **falla si rompés `calcularEdad` a propósito** (probalo: cambiá un `-` por un `+` en la función y mirá que el test se ponga rojo). Si sigue verde, el test es inútil.
- [si ] Hay un caso para fecha inválida y uno para `null`.
- [si ] El test de fecha **no depende del día en que se corre**.
- [si ] El test de integración verifica el **status code** además del body.
- [si ] Entendés la diferencia entre el test unitario y el de integración y podés explicarla.

## 6. ✍️ Reflexión (300–600 palabras)
Primero use la IA para sacar una lista de casos y despues fui haciendo
los tests y probandolos en mi proyecto. 

Despues aparecio el problema con fechas invalidas como 2005-02-30, ya
que JavaScript las modifica automaticamente. Por eso tuve que agregar
una validacion en la funcion.

Despues agregue el test de integracion para GET /api/alumnos, que
comprueba el status y el body de la respuesta. A diferencia del test
unitario de calcularEdad, este prueba el funcionamiento del endpoint
completo.

Al final fui ajustando los tests segun los errores que iban apareciendo,
en vez de quedarme solamente con los primeros tests que genero la IA.