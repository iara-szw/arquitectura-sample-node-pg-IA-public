import BaseRepository from './base-repository.js';

// [IA] Refactor DRY: getAllAsync/getByIdAsync/deleteByIdAsync ahora viven en
// BaseRepository. createAsync y updateAsync se mantienen ACÁ sin tocar la
// lógica: updateAsync sigue haciendo el merge con previousEntity antes de
// actualizar (restricción #5 -- no se generaliza ni se mueve a la clase base).
//
// El log prefix "AlumnosRepository-new" se preserva tal cual estaba en el
// original (inconsistente con el nombre real de la clase), para no romper
// nada que dependa del texto exacto del log (restricción #2).
export default class AlumnosRepository extends BaseRepository {
    constructor() {
        super('alumnos', 'AlumnosRepository-new');
    }

    createAsync = async (entity) => {
        console.log(`AlumnosRepository-new.createAsync(${JSON.stringify(entity)})`);
        const sql = ` INSERT INTO alumnos (
                            nombre              ,
                            apellido            ,
                            id_curso            ,
                            fecha_nacimiento    ,
                            hace_deportes
                        ) VALUES (
                            $1,
                            $2,
                            $3,
                            $4,
                            $5
                        ) RETURNING id`;
       const values = [
    entity.nombre,
    entity.apellido,
    entity.id_curso,
    entity.fecha_nacimiento ?? null,
    entity.hace_deportes
];
        return await this.db.queryReturnId(sql, values);
    }

    updateAsync = async (entity) => {
        console.log(`AlumnosRepository-new.updateAsync(${JSON.stringify(entity)})`);
        let id = entity.id;

        // Sigue usando this.getByIdAsync, ahora heredado de BaseRepository.
        const previousEntity = await this.getByIdAsync(id);
        if (previousEntity == null) return 0;

        const sql = `UPDATE alumnos SET
                        nombre              = $2,
                        apellido            = $3,
                        id_curso            = $4,
                        fecha_nacimiento    = $5,
                        hace_deportes       = $6
                    WHERE id = $1`;
       const values = [
    entity.nombre,
    entity.apellido,
    entity.id_curso,
    entity.fecha_nacimiento ?? null,
    entity.hace_deportes
];
        return await this.db.queryRowCount(sql, values);
    }
}