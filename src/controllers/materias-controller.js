import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import MateriasService from './../services/materias-service.js'
import { responderOk, responderCreated, responderNotFound, responderBadRequest, responderErrorInterno, responderError } from './../helpers/respuestas-helper.js'

const router = Router();
const currentService = new MateriasService();

router.get('', async (req, res) => {
    try {
        console.log(`MateriasController.get`);
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

router.post('',authMiddleware , async (req, res) => {
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

router.put('/:id', authMiddleware ,async (req, res) => {
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

router.delete('/:id',authMiddleware , async (req, res) => {
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