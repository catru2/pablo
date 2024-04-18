const Cachorro = require('../models/cachorro.model');

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        const {sort, order} = req.query;

        const cachorros = await Cachorro.getAll({offset, limit}, {sort, order});

        let response = {
            message: "cachorros obtenidos exitosamente",
            data: cachorros
        };

        if (page && limit) {
            const totalCachorros = await Cachorro.count();
            response = {
                ...response,
                total: totalCachorros,
                totalPages: Math.ceil(totalCachorros / limit),
                currentPage: page
            };
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener los cachorros",
            error: error.message
        });
    }
}


const getById = async (req, res) => {
    try {
        const idCachorro= req.params.id;
        const cachorro = await Cachorro.getById(idCachorro);

        if (!cachorro) {
            return res.status(404).json({
                message: `no se encontró el cachorro con id ${idCachorro}`
            });
        };

        return res.status(200).json({
            message: "cachorro encontrado exitosamente",
            cachorro
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el cachorro",
            error: error.message
        });
    }
}

const create = async (req, res) => {
    try {
        const cachorro = new Cachorro({
            nombre: req.body.nombre,
            edad: req.body.edad,
            duenio: req.body.duenio
        });

        await cachorro.save()

        return res.status(200).json({
            message: "cachorro creado exitosamente",
            cachorro
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al crear el cachorro",
            error: error.message
        });
    }
}

const deleteLogico = async (req, res) => {
    try {
        const idCachorro = req.params.id;

        await Cachorro.deleteLogicoById(idCachorro);

        return res.status(200).json({
            message: "se eliminó el cachorro correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el cachorro",
            error: error.message
        })
    }
}

const deleteFisico = async (req, res) => {
    try {
        const idCachorro = req.params.id;

        await Cachorro.deleteFisicoById(idCachorro);

        return res.status(200).json({
            message: "se eliminó el cachorro correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el cachorro",
            error: error.message
        })
    }
}

const update = async (req, res) => {
    try {
        const idCachorro = req.params.id;
        const datosActualizar = {
            nombre: req.body.nombre,
            edad: req.body.edad
        }

        await Cachorro.updateById(idCachorro, datosActualizar);

        return res.status(200).json({
            message: "el cachorro se actualizó correctamente"
        })
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar el cachorro",
            error: error.message
        })
    }
}

module.exports = {
    index,
    getById,
    create,
    delete: deleteFisico,
    update
}