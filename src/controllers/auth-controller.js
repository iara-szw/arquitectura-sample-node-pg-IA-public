    import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Credenciales fijas únicamente para el TP educativo
const usuarioValido = "admin";
const contraseniaValida = "123456";

router.post("/login", (req, res) => {
    const { usuario, contrasenia } = req.body;

    // Verificar que lleguen los datos
    if (!usuario || !contrasenia) {
        return res.status(400).json({
            error: "Usuario y contraseña son obligatorios"
        });
    }

    // Login educativo con credenciales fijas
    // En producción NO se debería guardar la contraseña en texto plano.
    if (
        usuario !== usuarioValido ||
        contrasenia !== contraseniaValida
    ) {
        return res.status(401).json({
            error: "Credenciales inválidas"
        });
    }

    // Crear JWT
    const token = jwt.sign(
        {
            usuario: usuario
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1h"
        }
    );

    return res.status(200).json({
        mensaje: "Login exitoso",
        token: token
    });
});

export default router;