import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import AlumnosService from './../services/alumnos-service.js';
import authMiddleware from "../middlewares/authMiddleware.js";

import Alumno from './../entities/alumno.js';
import {
    responderOk,
    responderCreated,
    responderNotFound,
    responderBadRequest,
    responderErrorInterno,
    responderError
} from './../helpers/respuestas-helper.js';

import {
    parsearId,
    validarAlumno,
    ErrorValidacion
} from './../helpers/validacion-helper.js';

const router = Router();
const currentService = new AlumnosService();

// Endpoint de ejemplo: crear un alumno desde código usando la clase Alumno
// En vez de recibir los datos del body (req.body), los armamos nosotros desde código.
// Para eso usamos la clase Alumno de la carpeta entities.
// Probar con: GET http://localhost:3000/api/alumnos/test-insert
router.get('/test-insert', async (req, res) => {
    console.log('/test-insert');
    try {
        const nuevoAlumno = new Alumno('Willy', 'Wonka', 1, '2005-07-15', true);

        console.log('Objeto Alumno creado desde código:', nuevoAlumno);

        const newId = await currentService.createAsync(nuevoAlumno);
        if (newId > 0) {
            responderCreated(res, {
                message : `Se creó el alumno desde código con id: ${newId}`,
                alumno  : nuevoAlumno,
                newId   : newId
            });
        } else {
            responderBadRequest(res, { message: 'No se pudo crear el alumno.' });
        }
    } catch (error) {
        responderError(res, error, StatusCodes.BAD_REQUEST);
    }
});
router.get('', async (req, res) => {
    try {
        console.log(`AlumnosController.get`);

        const returnArray = await currentService.getAllAsync();

        if (returnArray != null) {
            responderOk(res, returnArray);
        } else {
            responderErrorInterno(res, `Error interno.`);
        }
    } catch (error) {
        responderErrorInterno(res, 'Ocurrió un error interno.');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = parsearId(req.params.id);

        console.log(`AlumnosController.getById(${id})`);

        const returnEntity = await currentService.getByIdAsync(id);

        if (returnEntity != null) {
            responderOk(res, returnEntity);
        } else {
            responderNotFound(
                res,
                `No se encontró el alumno con id ${id}.`
            );
        }
    } catch (error) {
        if (error instanceof ErrorValidacion) {
            return responderBadRequest(res, {
                message: error.message
            });
        }

        responderErrorInterno(res, 'Ocurrió un error interno.');
    }
});

router.post('',authMiddleware , async (req, res) => {
    try {
        const entity = req.body;

        validarAlumno(entity);

        const newId = await currentService.createAsync(entity);

        if (newId > 0) {
            responderCreated(res, newId);
        } else {
            responderErrorInterno(res, 'No se pudo crear el alumno.');
        }
    } catch (error) {
        if (error instanceof ErrorValidacion) {
            return responderBadRequest(res, {
                message: error.message
            });
        }

        // El error interno NO se expone al cliente.
        responderErrorInterno(res, 'Ocurrió un error interno.');
    }
});

router.put('/:id',authMiddleware , async (req, res) => {
    try {
        const id = parsearId(req.params.id);
        const entity = req.body;

        validarAlumno(entity, true);

        if (
            entity.id !== undefined &&
            parsearId(entity.id) !== id
        ) {
            return responderBadRequest(res, {
                message: 'El id de la URL no coincide con el id del body.'
            });
        }

        entity.id = id;

        const rowsAffected = await currentService.updateAsync(entity);

        if (rowsAffected != 0) {
            responderOk(res, rowsAffected);
        } else {
            responderNotFound(
                res,
                `No se encontró el alumno con id ${id}.`
            );
        }
    } catch (error) {
        if (error instanceof ErrorValidacion) {
            return responderBadRequest(res, {
                message: error.message
            });
        }

        responderErrorInterno(res, 'Ocurrió un error interno.');
    }
});

router.delete('/:id',authMiddleware , async (req, res) => {
    try {
        const id = parsearId(req.params.id);

        const rowCount = await currentService.deleteByIdAsync(id);

        if (rowCount != 0) {
            responderOk(res, null);
        } else {
            responderNotFound(
                res,
                `No se encontró el alumno con id ${id}.`
            );
        }
    } catch (error) {
        if (error instanceof ErrorValidacion) {
            return responderBadRequest(res, {
                message: error.message
            });
        }

        responderErrorInterno(res, 'Ocurrió un error interno.');
    }
});

export default router;