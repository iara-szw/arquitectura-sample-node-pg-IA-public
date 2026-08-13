import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // No existe el header
    if (!authHeader) {
        return res.status(401).json({
            error: "Falta el header Authorization"
        });
    }

    // El formato no es Bearer <token>
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Header Authorization mal formado"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: "Falta el token"
        });
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = payload;

        next();

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                error: "El token expiró"
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                error: "El token es inválido"
            });
        }

        return res.status(401).json({
            error: "No se pudo validar el token"
        });
    }
};

export default authMiddleware;