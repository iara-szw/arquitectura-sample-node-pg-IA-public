import BaseRepository from './base-repository.js';

// [IA] Refactor DRY: getAllAsync/getByIdAsync/deleteByIdAsync ahora viven en
// BaseRepository. Acá solo queda lo que es específico de "cursos": el nombre
// de tabla, las columnas del INSERT/UPDATE (restricción #6).
export default class CursosRepository extends BaseRepository {
    constructor() {
        super('cursos', 'CursosRepository');
    }

    createAsync = async (entity) => {
        console.log(`CursosRepository.createAsync(${JSON.stringify(entity)})`);
        const sql = `INSERT INTO cursos (nombre) VALUES ($1) RETURNING id`;
        const values = [entity.nombre];
        return await this.db.queryReturnId(sql, values);
    }

    updateAsync = async (entity) => {
        console.log(`CursosRepository.updateAsync(${JSON.stringify(entity)})`);
        const sql = `UPDATE cursos SET nombre = $2 WHERE id = $1`;
        const values =  [   entity.id, 
                            entity.nombre
                        ];
        return await this.db.queryRowCount(sql, values);
    }
}