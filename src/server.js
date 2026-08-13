import 'dotenv/config'
import express from "express";
import cors from "cors";

// Controllers
import AlumnosController from "./controllers/alumnos-controller.js"
import CursosController from "./controllers/cursos-controller.js"
import MateriasController from "./controllers/materias-controller.js"
import AuthController from "./controllers/auth-controller.js"

const app = express();
const port = process.env.PORT || 3000;

// Agrego los Middlewares
app.use(cors());
app.use(express.json());

// Endpoint de autenticación
app.use("/api/auth", AuthController);

// Endpoints
app.use("/api/alumnos", AlumnosController);
app.use("/api/cursos", CursosController);
app.use("/api/materias", MateriasController);

// Inicio el Server y lo pongo a escuchar
app.listen(port, () => {
    console.log("server.js");
    console.log(`Listening on http://localhost:${port}`)
});