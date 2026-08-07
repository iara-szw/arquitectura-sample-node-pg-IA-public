import Db from './db-pg.js';

// [IA] Generado en el refactor DRY de los repositories (BaseRepository).
// Centraliza getAllAsync, getByIdAsync y deleteByIdAsync, que eran IDÉNTICOS
// entre AlumnosRepository, CursosRepository y MateriasRepository salvo el
// nombre de tabla. createAsync/updateAsync quedan en cada clase hija porque
// su lógica difiere por entidad (ver restricción #5 del prompt).
export default class BaseRepository {
    constructor(tableName, logPrefix) {
        this.db = new Db();
        this.tableName = tableName;
        // logPrefix se pasa explícito (no this.constructor.name) para
        // preservar EXACTO el texto de log que tenía cada clase antes del
        // refactor -- ej: alumnos logueaba "AlumnosRepository-new", no
        // "AlumnosRepository". Cambiar eso rompería la restricción #2.
        this.logPrefix = logPrefix;
        console.log(`Estoy en: ${this.logPrefix}.constructor()`);
    }

    getAllAsync = async () => {
        console.log(`${this.logPrefix}.getAllAsync()`);
        const sql = `SELECT * FROM ${this.tableName}`;
        return await this.db.queryAll(sql);
    }

    getByIdAsync = async (id) => {
        console.log(`${this.logPrefix}.getByIdAsync(${id})`);
        const sql = `SELECT * FROM ${this.tableName} WHERE id=$1`;
        return await this.db.queryOne(sql, [id]);
    }

    deleteByIdAsync = async (id) => {
        console.log(`${this.logPrefix}.deleteByIdAsync(${id})`);
        const sql = `DELETE FROM ${this.tableName} WHERE id=$1`;
        return await this.db.queryRowCount(sql, [id]);
    }
}