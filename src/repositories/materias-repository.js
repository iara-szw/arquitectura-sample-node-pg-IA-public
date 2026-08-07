import BaseRepository from './base-repository.js';

// [IA] Refactor DRY: getAllAsync/getByIdAsync/deleteByIdAsync ahora viven en
// BaseRepository. Acá solo queda lo que es específico de "materias".
export default class MateriasRepository extends BaseRepository {
    constructor() {
        super('materias', 'MateriasRepository');
    }

    createAsync = async (entity) => {
        console.log(`MateriasRepository.createAsync(${JSON.stringify(entity)})`);
        const sql = `INSERT INTO materias (nombre) VALUES ($1) RETURNING id`;
        const values = [entity?.nombre ?? ''];
        return await this.db.queryReturnId(sql, values);
    }

    updateAsync = async (entity) => {
        console.log(`MateriasRepository.updateAsync(${JSON.stringify(entity)})`);
        const sql = `UPDATE materias SET nombre = $2 WHERE id = $1`;
        const values =  [   entity.id, 
                            entity?.nombre ?? ''
                        ];
        return await this.db.queryRowCount(sql, values);
    }
}