import { StatusCodes } from 'http-status-codes';

// [IA] Extraído del patrón res.status(...).json/send(...) que se repetía
// en cada endpoint de alumnos-controller.js, cursos-controller.js y
// materias-controller.js. Centraliza "qué status code corresponde a cada
// caso" en un solo lugar, en vez de tenerlo copiado 15 veces.
//
// Decisión de diseño: funciones sueltas, no una clase (a diferencia de
// LogHelper). LogHelper es una clase porque tiene estado real (lee env
// vars en el constructor); estas funciones son puras -- mismo input,
// mismo output, sin nada que configurar. Envolverlas en una clase sería
// ceremonia sin beneficio.

export function responderOk(res, data) {
    res.status(StatusCodes.OK).json(data);
}

export function responderCreated(res, data) {
    res.status(StatusCodes.CREATED).json(data);
}

export function responderNotFound(res, mensaje) {
    res.status(StatusCodes.NOT_FOUND).send(mensaje);
}

// El proyecto original ya mezclaba dos formatos de 400: a veces manda un
// mensaje de texto (.send), a veces un body JSON como `null` (.json). En
// vez de "corregir" esa inconsistencia -- lo que cambiaría el contrato de
// la API -- la respetamos: si el payload es un string se manda como texto,
// si no, como JSON.
export function responderBadRequest(res, payload) {
    if (typeof payload === 'string') {
        res.status(StatusCodes.BAD_REQUEST).send(payload);
    } else {
        res.status(StatusCodes.BAD_REQUEST).json(payload);
    }
}

// Caso puntual: el service devolvió null SIN tirar excepción (ej: GET all
// cuando el repository devuelve null en vez de un array vacío).
export function responderErrorInterno(res, mensaje) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(mensaje);
}

// Para los bloques catch: loguea el error igual que antes (console.log del
// objeto completo) y responde con el mismo formato `Error: ${error.message}`
// que ya tenía el proyecto. El status code varía según la ruta (algunos
// catches devuelven 500, otros 400), por eso se recibe como parámetro en
// vez de estar fijo acá adentro.
export function responderError(res, error, statusCode) {
    console.log(error);
    res.status(statusCode).send(`Error: ${error.message}`);
}