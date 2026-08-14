// [IA] Movido desde alumnos-service.js. No es lógica de "alumnos": es una
// utilidad de fechas que cualquier otra entidad con un campo de fecha de
// nacimiento podría reusar el día de mañana (ej: si se agrega "profesores").
// Por eso vive en src/helpers/ y no adentro del service.

export function calcularEdad(fechaNacimiento, hoy = new Date()) {
    if (!fechaNacimiento) return null;

    const nacimiento = new Date(fechaNacimiento);

    if (Number.isNaN(nacimiento.getTime())) {
        return NaN;
    }

    // Si recibimos un string YYYY-MM-DD,
    // verificamos que la fecha realmente exista.
    if (typeof fechaNacimiento === 'string') {
        const [anio, mes, dia] = fechaNacimiento.split('-').map(Number);

        if (
            nacimiento.getUTCFullYear() !== anio ||
            nacimiento.getUTCMonth() !== mes - 1 ||
            nacimiento.getUTCDate() !== dia
        ) {
            return NaN;
        }
    }

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesDiff = hoy.getMonth() - nacimiento.getMonth();

    if (
        mesDiff < 0 ||
        (mesDiff === 0 && hoy.getDate() < nacimiento.getDate())
    ) {
        edad--;
    }

    return edad;
}

export function agregarEdad(alumno) {
    if (!alumno) return alumno;

    return {
        ...alumno,
        edad: calcularEdad(alumno.fecha_nacimiento)
    };
}