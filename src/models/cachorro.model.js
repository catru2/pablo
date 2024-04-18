const db = require('../configs/db.config');

class Cachorro {

    constructor({ id, nombre, edad, duenio, deleted, createdAt, updatedAt, deletedAt }) {
        this.id = id;
        this.nombre = nombre;
        this.edad = edad;
        this.duenio = duenio;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    static async getAll({ offset, limit }, { sort, order }) {
        const connection = await db.createConnection();
        let query = "SELECT id, nombre, edad, duenio, deleted, created_at, updated_at, deleted_at FROM cachorros WHERE deleted = 0 ORDER BY LEFT(nombre, 1)";

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
        const [rows] = await connection.execute("SELECT id, nombre, edad, duenio, deleted, created_at, updated_at, deleted_at FROM cachorros WHERE id = ? AND deleted = 0", [id]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new Cachorro({ id: row.id, nombre: row.nombre, edad: row.edad, duenio: row.duenio, deleted: row.deleted, createdAt: row.created_at, updatedAt: row.updated_at, deletedAt: row.deleted_at });
        }

        return null;
    }

    static async deleteLogicoById(id) {
        const connection = await db.createConnection();

        const deletedAt = new Date();
        const [result] = connection.execute("UPDATE cachorros SET deleted = 1, deleted_at = ? WHERE id = ?", [deletedAt, id]);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("No se pudo eliminar el cachorro");
        }

        return
    }

    static async deleteFisicoById(id) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("DELETE FROM cachorros WHERE id = ?", [id]);
        connection.end();

        if (result.affectedRows == 0) {
            throw new Error("no se eliminó el cachorro");
        }

        return
    }

    static async updateById(id, { nombre, edad}) {
        const connection = await db.createConnection();

        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE cachorros SET nombre = ?, edad = ?, updated_at = ? WHERE id = ?", [nombre, edad, updatedAt, id]);

        if (result.affectedRows == 0) {
            throw new Error("no se actualizó la información del cachorro");
        }

        return
    }

    static async count() {
        const connection = await db.createConnection();
        const [rows] = await connection.query("SELECT COUNT(*) AS totalCount FROM cachorros WHERE deleted = 0");
        connection.end();

        return rows[0].totalCount;
    }

    async save() {
        const connection = await db.createConnection();

        const createdAt = new Date();
        const [result] = await connection.execute("INSERT INTO cachorros (nombre, edad, duenio, created_at) VALUES (?, ?, ?, ?)", [this.nombre, this.edad, this.duenio, createdAt]);

        connection.end();

        if (result.insertId === 0) {
            throw new Error("No se insertó el cachorro");
        }
        
        this.id = result.insertId;
        this.deleted = 0;
        this.createdAt = createdAt;
        this.updatedAt = null;
        this.deletedAt = null;

        return
    }
}

module.exports = Cachorro;