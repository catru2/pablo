const Duenio = require('../models/duenio.model');

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        const {sort, order} = req.query;

        const duenios = await Duenio.getAll({offset, limit}, {sort, order});

        let response = {
            message: "dueños obtenidos exitosamente",
            data: duenios
        };

        if (page && limit) {
            const totalDuenios = await Duenio.count();
            response = {
                ...response,
                total: totalDuenios,
                totalPages: Math.ceil(totalDuenios / limit),
                currentPage: page
            };
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener los dueños",
            error: error.message
        });
    }
}


const getById = async (req, res) => {
    try {
        const idDuenio= req.params.id;
        const duenio = await Duenio.getById(idDuenio);

        if (!duenio) {
            return res.status(404).json({
                message: `no se encontró el dueño con id ${idDuenio}`
            });
        };

        return res.status(200).json({
            message: "dueño encontrado exitosamente",
            duenio
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al obtener el dueño",
            error: error.message
        });
    }
}

const create = async (req, res) => {
    try {
        const duenio = new Duenio({
            nombre: req.body.nombre,
            celular: req.body.celular,
            nombreMascota: req.body.nombreMascota
        });

        await duenio.save()

        return res.status(200).json({
            message: "dueño creado exitosamente",
            duenio
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al crear el dueño",
            error: error.message
        });
    }
}

const deleteLogico = async (req, res) => {
    try {
        const idDuenio = req.params.id;

        await Duenio.deleteLogicoById(idDuenio);

        return res.status(200).json({
            message: "se eliminó el dueño correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el dueño",
            error: error.message
        })
    }
}

const deleteFisico = async (req, res) => {
    try {
        const idDuenio = req.params.id;

        await Duenio.deleteFisicoById(idDuenio);

        return res.status(200).json({
            message: "se eliminó el dueño correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al eliminar el dueño",
            error: error.message
        })
    }
}

const update = async (req, res) => {
    try {
        const idDuenio = req.params.id;
        const datosActualizar = {
            nombre: req.body.nombre,
            celular: req.body.celular,
            nombreMascota: req.body.nombreMascota
        }

        await Duenio.updateById(idDuenio, datosActualizar);

        return res.status(200).json({
            message: "el dueño se actualizó correctamente"
        })
    } catch (error) {
        return res.status(500).json({
            message: "ocurrió un error al actualizar el dueño",
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