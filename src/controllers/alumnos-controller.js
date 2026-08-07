import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import AlumnosService from './../services/alumnos-service.js'
import Alumno from './../entities/alumno.js'
import { responderOk, responderCreated, responderNotFound, responderBadRequest, responderErrorInterno, responderError } from './../helpers/respuestas-helper.js'

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
        if (returnArray != null){
            responderOk(res, returnArray);
        } else {
            responderErrorInterno(res, `Error interno.`);
        }
    } catch (error) {
        responderError(res, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

router.get('/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const returnEntity = await currentService.getByIdAsync(id);
        if (returnEntity != null){
            responderOk(res, returnEntity);
        } else {
            responderNotFound(res, `No se encontro la entidad (id:${id}).`);
        }
    } catch (error) {
        responderError(res, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

router.post('', async (req, res) => {
    try {
        let entity = req.body;
        const newId = await currentService.createAsync(entity);
        if (newId > 0 ){
            responderCreated(res, newId);
        } else {
            responderBadRequest(res, null);
        }
    } catch (error) {
        responderError(res, error, StatusCodes.BAD_REQUEST);
    }
});

router.put('/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let entity = req.body;

        if (entity.id && parseInt(entity.id) !== id) {
            return responderBadRequest(res, `El id de la URL (${id}) no coincide con el id del body (${entity.id}).`);
        }

        entity.id = id;
        const rowsAffected = await currentService.updateAsync(entity);
        if (rowsAffected != 0){
            responderOk(res, rowsAffected);
        } else {
            responderNotFound(res, `No se encontro la entidad (id:${id}).`);
        }
    } catch (error) {
        responderError(res, error, StatusCodes.BAD_REQUEST);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const rowCount = await currentService.deleteByIdAsync(id);
        if (rowCount != 0){
            responderOk(res, null);
        } else {
            responderNotFound(res, `No se encontro la entidad (id:${id}).`);
        }
    } catch (error) {
        responderError(res, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

export default router;