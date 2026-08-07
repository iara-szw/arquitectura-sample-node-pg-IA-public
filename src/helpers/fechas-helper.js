// [IA] Movido desde alumnos-service.js. No es lógica de "alumnos": es una
// utilidad de fechas que cualquier otra entidad con un campo de fecha de
// nacimiento podría reusar el día de mañana (ej: si se agrega "profesores").
// Por eso vive en src/helpers/ y no adentro del service.

export function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesDiff = hoy.getMonth() - nacimiento.getMonth();
    if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

export function agregarEdad(alumno) {
    if (!alumno) return alumno;
    return { ...alumno, edad: calcularEdad(alumno.fecha_nacimiento) };
}