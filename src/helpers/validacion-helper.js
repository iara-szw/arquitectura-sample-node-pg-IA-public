export class ErrorValidacion extends Error {
    constructor(message) {
        super(message);
        this.name = 'ErrorValidacion';
    }
}

export const parsearId = (id) => {
    const numero = Number(id);

    if (!Number.isInteger(numero) || numero <= 0) {
        throw new ErrorValidacion(
            'El id debe ser un número entero positivo.'
        );
    }

    return numero;
};

export const validarAlumno = (entity, parcial = false) => {

    if (
        entity == null ||
        typeof entity !== 'object' ||
        Array.isArray(entity)
    ) {
        throw new ErrorValidacion(
            'El body debe ser un objeto.'
        );
    }

    // =========================
    // CAMPOS OBLIGATORIOS - POST
    // =========================

    if (!parcial) {

        if (
            typeof entity.nombre !== 'string' ||
            entity.nombre.trim() === ''
        ) {
            throw new ErrorValidacion(
                'El nombre es obligatorio.'
            );
        }

        if (
            typeof entity.apellido !== 'string' ||
            entity.apellido.trim() === ''
        ) {
            throw new ErrorValidacion(
                'El apellido es obligatorio.'
            );
        }

        if (
            !Number.isInteger(entity.id_curso) ||
            entity.id_curso <= 0
        ) {
            throw new ErrorValidacion(
                'id_curso debe ser un número entero positivo.'
            );
        }
    }

    // =========================
    // NOMBRE
    // =========================

    if (entity.nombre !== undefined) {

        if (
            typeof entity.nombre !== 'string' ||
            entity.nombre.trim() === ''
        ) {
            throw new ErrorValidacion(
                'El nombre debe ser un texto no vacío.'
            );
        }

        if (entity.nombre.length > 100) {
            throw new ErrorValidacion(
                'El nombre no puede superar los 100 caracteres.'
            );
        }
    }

    // =========================
    // APELLIDO
    // =========================

    if (entity.apellido !== undefined) {

        if (
            typeof entity.apellido !== 'string' ||
            entity.apellido.trim() === ''
        ) {
            throw new ErrorValidacion(
                'El apellido debe ser un texto no vacío.'
            );
        }

        if (entity.apellido.length > 100) {
            throw new ErrorValidacion(
                'El apellido no puede superar los 100 caracteres.'
            );
        }
    }

    // =========================
    // ID CURSO
    // =========================

    if (entity.id_curso !== undefined) {

        if (
            !Number.isInteger(entity.id_curso) ||
            entity.id_curso <= 0
        ) {
            throw new ErrorValidacion(
                'id_curso debe ser un número entero positivo.'
            );
        }
    }

    // =========================
    // FECHA DE NACIMIENTO
    // =========================

    if (
        entity.fecha_nacimiento !== undefined &&
        entity.fecha_nacimiento !== null
    ) {

        if (typeof entity.fecha_nacimiento !== 'string') {
            throw new ErrorValidacion(
                'fecha_nacimiento debe tener formato YYYY-MM-DD.'
            );
        }

        // Primero verificamos el formato exacto.
        const tieneFormatoCorrecto =
            /^\d{4}-\d{2}-\d{2}$/.test(entity.fecha_nacimiento);

        if (!tieneFormatoCorrecto) {
            throw new ErrorValidacion(
                'fecha_nacimiento debe tener formato YYYY-MM-DD.'
            );
        }

        // Después verificamos que la fecha realmente exista.
        const [anio, mes, dia] =
            entity.fecha_nacimiento.split('-').map(Number);

        const fecha = new Date(anio, mes - 1, dia);

        if (
            fecha.getFullYear() !== anio ||
            fecha.getMonth() !== mes - 1 ||
            fecha.getDate() !== dia
        ) {
            throw new ErrorValidacion(
                'fecha_nacimiento no representa una fecha válida.'
            );
        }
    }

    // =========================
    // HACE DEPORTES
    // =========================

    if (entity.hace_deportes !== undefined) {

        if (typeof entity.hace_deportes !== 'boolean') {
            throw new ErrorValidacion(
                'hace_deportes debe ser booleano.'
            );
        }
    }
};
export const validarCurso = (entity, parcial = false) => {

    if (
        entity == null ||
        typeof entity !== 'object' ||
        Array.isArray(entity)
    ) {
        throw new ErrorValidacion(
            'El body debe ser un objeto.'
        );
    }

    // En POST el nombre es obligatorio
    if (!parcial) {

        if (
            typeof entity.nombre !== 'string' ||
            entity.nombre.trim() === ''
        ) {
            throw new ErrorValidacion(
                'El nombre es obligatorio.'
            );
        }
    }

    // Si viene nombre, siempre validamos su contenido
    if (entity.nombre !== undefined) {

        if (
            typeof entity.nombre !== 'string' ||
            entity.nombre.trim() === ''
        ) {
            throw new ErrorValidacion(
                'El nombre debe ser un texto no vacio.'
            );
        }

        if (entity.nombre.length > 100) {
            throw new ErrorValidacion(
                'El nombre no puede superar los 100 caracteres.'
            );
        }
    }
};