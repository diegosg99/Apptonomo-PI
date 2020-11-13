class DexieService{
    /**
     * Clase sobre la libreria Dexie, para almacenar datos
     * @constructor
     * @param {string} db - Nombre de la base de datos que creamos
     */
    constructor(dbname){
        this.db = new Dexie(dbname);
        //TODO: Refactorizar, metodo de sincronización, Documentar aplicacion , gulpfile.js
        this.tableKeys = {
            users: 'id',
            jobs: 'id',
            ratings: 'id'
        }
        this.initDB();
    }
    /**
     * Inicialización de la base de datos
     */
    initDB = () => {
        this.db.version(1).stores({
            users:'id',
            jobs:'id',
            ratings: 'id'
        })
        this.db.open();
        console.log(this.db);
    }
    /**
     * Método get para traer un dato
     * @param {string} table - La tabla a la que queremos acceder
     * @param {string} key - La clave del objeto que queremos sacar
     * @return {object} - retorna el objeto a buscar
     */    
    get = (table,key) => {
        return this.db[table].get(key);
    }
    /**
     * Método getAll para traer los datos de una tabla por completo
     * @param {string} table - La tabla a la que queremos acceder
     * @return {object} - retorna un array de los objetos de la tabla
     */  
    getAll = (table) =>{
        return this.db[table].toArray();
    }
    /**
     * Método add para añadir un objeto
     * @param {string} table - La tabla a la que queremos acceder
     * @param {object} item - El objeto que tratamos de añadir
     */ 
    add(table, item) {
        this.db[table].add(item);
    }
    /**
     * Método delete para eliminar un objeto
     * @param {string} table - La tabla a la que queremos acceder
     * @param {string} key - El id del objeto que tratamos de eliminar
     */  
    delete(table, key) {
        this.db[table]
          .where(this.tableKeys[table])
          .anyOf(key)
          .delete();
    }
    /**
     * Método deleteAll para eliminar los datos de una tabla
     * @param {string} table - La tabla a la que queremos eliminar datos
     */
    deleteAll(table) {
        this.db[table].clear();
    }
    /**
     * Método update para actualizar los datos de un objeto
     * @param {string} table - La tabla que queremos manipular
     * @param {string} key - El identificador del objeto a actualizar
     * @param {object} itemUpdate - Los datos del objeto a actualizar
     */
    update(table,key,itemUpdate) {
        this.db[table]
          .where(this.tableKeys[table])
          .equals(key)
          .modify(itemUpdate);
    }
}