const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_JWT } = process.env;
const Usuario = require('../models/usuario.model');

const login = async (req, res) => {
    try {   
        const { user, password } = req.body;
        // Buscar el usuario por el nombre de usuario
        const usuario = await Usuario.getByUser(user);
        if (!usuario) {
            return res.status(400).json({
                message: "Usuario incorrecto"
            });
        }
        // Verificar la contraseña
        const passwordCorrecta = bcrypt.compareSync(password, usuario.password);
        
        if (!passwordCorrecta) {
            return res.status(400).json({
                message: "Contraseña incorrecta"
            });
        }

        // Generar token JWT
        const payload = {
            usuario: {
                idUsuario: usuario.idUsuario
            }
        };

        const token = jwt.sign(payload, SECRET_JWT);

        return res.status(200).json({
            message: "Acceso concedido",
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al intentar loguearse",
            error: error.message
        });
    }
};

module.exports = {
    login
};
