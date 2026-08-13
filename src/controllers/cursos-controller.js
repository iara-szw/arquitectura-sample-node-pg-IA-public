import { Router } from 'express';
import CursosService from './../services/cursos-service.js';

import {
    responderOk,
    responderCreated,
    responderNotFound,
    responderBadRequest,
    responderErrorInterno
} from './../helpers/respuestas-helper.js';

import {
    parsearId,
    validarCurso,
    ErrorValidacion
} from './../helpers/validacion-helper.js';

const router = Router();
const currentService = new CursosService();

// =====================================
// GET ALL
// =====================================

router.get('', async (req, res) => {

    try {

        console.log('CursosController.get');

        const returnArray =
            await currentService.getAllAsync();

        if (returnArray != null) {

            responderOk(res, returnArray);

        } else {

            responderErrorInterno(
                res,
                'Ocurrio un error interno.'
            );
        }

    } catch (error) {

        console.error(error);

        responderErrorInterno(
            res,
            'Ocurrio un error interno.'
        );
    }
});

// =====================================
// GET BY ID
// =====================================

router.get('/:id', async (req, res) => {

    try {

        const id = parsearId(req.params.id);

        const returnEntity =
            await currentService.getByIdAsync(id);

        if (returnEntity != null) {

            responderOk(res, returnEntity);

        } else {

            responderNotFound(
                res,
                `No se encontro la entidad (id:${id}).`
            );
        }

    } catch (error) {

        if (error instanceof ErrorValidacion) {

            return responderBadRequest(res, {
                message: error.message
            });
        }

        console.error(error);

        responderErrorInterno(
            res,
            'Ocurrio un error interno.'
        );
    }
});

// =====================================
// POST
// =====================================

router.post('', authMiddleware ,async (req, res) => {

    try {

        const entity = req.body;

        validarCurso(entity);

        const newId =
            await currentService.createAsync(entity);

        if (newId > 0) {

            responderCreated(res, newId);

        } else {

            responderBadRequest(res, {
                message: 'No se pudo crear el curso.'
            });
        }

    } catch (error) {

        if (error instanceof ErrorValidacion) {

            return responderBadRequest(res, {
                message: error.message
            });
        }

        console.error(error);

        responderErrorInterno(
            res,
            'Ocurrio un error interno.'
        );
    }
});

// =====================================
// PUT
// =====================================

router.put('/:id',authMiddleware , async (req, res) => {

    try {

        const id = parsearId(req.params.id);

        const entity = req.body;

        validarCurso(entity, true);

        if (entity.id !== undefined) {

            const idBody = parsearId(entity.id);

            if (idBody !== id) {

                return responderBadRequest(res, {
                    message:
                        'El id de la URL no coincide con el id del body.'
                });
            }
        }

        entity.id = id;

        const rowsAffected =
            await currentService.updateAsync(entity);

        if (rowsAffected != 0) {

            responderOk(res, rowsAffected);

        } else {

            responderNotFound(
                res,
                `No se encontro la entidad (id:${id}).`
            );
        }

    } catch (error) {

        if (error instanceof ErrorValidacion) {

            return responderBadRequest(res, {
                message: error.message
            });
        }

        console.error(error);

        responderErrorInterno(
            res,
            'Ocurrio un error interno.'
        );
    }
});

// =====================================
// DELETE
// =====================================

router.delete('/:id',authMiddleware , async (req, res) => {

    try {

        const id = parsearId(req.params.id);

        const rowCount =
            await currentService.deleteByIdAsync(id);

        if (rowCount != 0) {

            responderOk(res, null);

        } else {

            responderNotFound(
                res,
                `No se encontro la entidad (id:${id}).`
            );
        }

    } catch (error) {

        if (error instanceof ErrorValidacion) {

            return responderBadRequest(res, {
                message: error.message
            });
        }

        console.error(error);

        responderErrorInterno(
            res,
            'Ocurrio un error interno.'
        );
    }
});

export default router;