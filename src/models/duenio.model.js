const db = require('../configs/db.config');

class Duenio {

    constructor({ id, nombre, celular, nombreMascota, deleted, createdAt, updatedAt, deletedAt }) {
        this.id = id;
        this.nombre = nombre;
        this.celular = celular;
        this.nombreMascota = nombreMascota;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    static async getAll({ offset, limit }, { sort, order }) {
        const connection = await db.createConnection();
        let query = "SELECT id, nombre, celular, nombreMascota, deleted, created_at, updated_at, deleted_at FROM duenios WHERE deleted = 0 ORDER BY LEFT(nombre, 1)";

        if (sort && order) {
            query += ` ORDER BY ${sort} ${order}`
        }

        if (offset >= 0 && limit) {
            query += ` LIMIT ${offset}, ${limit}`;
        }

        const [rows] = await connection.query(query);
        connection.end();

        return rows;
    }

    static async getById(id) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT id, nombre, celular, nombreMascota, deleted, created_at, updated_at, deleted_at FROM duenios WHERE id = ? AND deleted = 0", [id]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new Duenio({ id: row.id, nombre: row.nombre, celular: row.celular, nombreMascota: row.nombreMascota, deleted: row.deleted, createdAt: row.created_at, updatedAt: row.updated_at, deletedAt: row.deleted_at });
        }

        return null;
    }

    static async deleteLogicoById(id) {
        const connection = await db.createConnection();

        const deletedAt = new Date();
        const [result] = connection.execute("UPDATE duenios SET deleted = 1, deleted_at = ? WHERE id = ?", [deletedAt, id]);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se pudo eliminar el dueño del cachorro");
        }

        return
    }

    static async deleteFisicoById(id) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("DELETE FROM duenios WHERE id = ?", [id]);
        connection.end();

        if (result.affectedRows == 0) {
            throw new Error("no se eliminó el dueño del cachorro");
        }

        return
    }

    static async updateById(id, { nombre, celular, nombreMascota }) {
        const connection = await db.createConnection();

        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE duenios SET nombre = ?, celular = ?, nombreMascota = ?, updated_at = ? WHERE id = ?", [nombre, celular, nombreMascota, updatedAt, id]);

        if (result.affectedRows == 0) {
            throw new Error("no se actualizó la información del dueño");
        }

        return
    }

    static async count() {
        const connection = await db.createConnection();
        const [rows] = await connection.query("SELECT COUNT(*) AS totalCount FROM duenios WHERE deleted = 0");
        connection.end();

        return rows[0].totalCount;
    }

    async save() {
        const connection = await db.createConnection();

        const createdAt = new Date();
        const [result] = await connection.execute("INSERT INTO duenios (nombre, celular, nombreMascota, created_at) VALUES (?, ?, ?, ?)", [this.nombre, this.celular, this.nombreMascota, createdAt]);

        connection.end();

        if (result.insertId === 0) {
            throw new Error("No se insertó el dueño");
        }
        
        this.id = result.insertId;
        this.deleted = 0;
        this.createdAt = createdAt;
        this.updatedAt = null;
        this.deletedAt = null;

        return
    }
}

module.exports = Duenio;