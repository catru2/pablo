const db = require('../configs/db.config');

class Usuario {

    constructor({ id, user, password, deleted, createdAt, updatedAt, deletedAt }) {
        this.id = id;
        this.user = user;
        this.password = password;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    static async getAll({ offset, limit }, { sort, order }) {
        const connection = await db.createConnection();
        let query = "SELECT id, user, password, deleted, created_at, updated_at, deleted_at FROM usuarios WHERE deleted = 0";

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

    static async getByUser(user) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT id, user, password, deleted, created_at, updated_at, deleted_at FROM usuarios WHERE user = ? AND deleted = 0", [user]);
        connection.end();
    
        if (rows.length > 0) {
            const row = rows[0];
            return new Usuario({ id: row.id, user: row.user, password: row.password, deleted: row.deleted, createdAt: row.created_at, updatedAt: row.updated_at, deletedAt: row.deleted_at });
        }
    
        return null;
    }
    

    static async getById(id) {
        const connection = await db.createConnection();
        const [rows] = await connection.execute("SELECT id, user, password, deleted, created_at, updated_at, deleted_at FROM usuarios WHERE id = ? AND deleted = 0", [id]);
        connection.end();

        if (rows.length > 0) {
            const row = rows[0];
            return new Usuario({ id: row.id, user: row.user, password: row.password, deleted: row.deleted, createdAt: row.created_at, updatedAt: row.updated_at, deletedAt: row.deleted_at });
        }

        return null;
    }

    static async deleteFisicoById(id) {
        const connection = await db.createConnection();
        const [result] = await connection.execute("DELETE FROM usuarios WHERE id = ?", [id]);
        connection.end();

        if (result.affectedRows == 0) {
            throw new Error("no se eliminó el usuario");
        }

        return
    }

    static async updateById(id, { user, password }) {
        const connection = await db.createConnection();

        const updatedAt = new Date();
        const [result] = await connection.execute("UPDATE usuarios SET user = ?, password = ?, updated_at = ? WHERE id = ?", [user, password, updatedAt, id]);

        if (result.affectedRows == 0) {
            throw new Error("no se actualizó el usuario");
        }

        return
    }

    static async count() {
        const connection = await db.createConnection();
        const [rows] = await connection.query("SELECT COUNT(*) AS totalCount FROM usuarios WHERE deleted = 0");
        connection.end();

        return rows[0].totalCount;
    }

    async save() {
        const connection = await db.createConnection();

        const createdAt = new Date();
        const [result] = await connection.execute("INSERT INTO usuarios (user, password, created_at) VALUES (?, ?, ?)", [this.user, this.password, createdAt]);

        connection.end();

        if (result.insertId === 0) {
            throw new Error("No se insertó el usuario");
        }

        this.id = result.insertId;
        this.deleted = 0;
        this.createdAt = createdAt;
        this.updatedAt = null;
        this.deletedAt = null;

        return
    }
}

module.exports = Usuario;