const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = 81;

app.use(express.urlencoded({ extended: true }));

const dbConfig = {
    host: "mysql",
    user: "root",
    password: "pass",
    database: "prueba",
};

// Función para esperar a que MySQL esté disponible
async function waitForMysql() {
    while (true) {
        try {
            const connection = mysql.createConnection(dbConfig);
            await new Promise((resolve, reject) => {
                connection.connect((err) => {
                    if (err) {
                        console.error("Error al conectar a MySQL:", err);
                        reject(err);
                        return;
                    }
                    console.log("Conexión exitosa a MySQL");
                    resolve();
                });
            });
            connection.end();
            break;
        } catch (err) {
            console.log("Esperando a que MySQL esté disponible...");
            await new Promise((resolve) => setTimeout(resolve, 3000)); // Espera 3 segundos
        }
    }
}

const server = async () => {
    try {
        // Esperamos a que MySQL esté disponible antes de iniciar el servidor
        await waitForMysql();

        // Configuración de la base de datos MySQL
        const db = mysql.createConnection(dbConfig);

        // Conectar a la base de datos MySQL
        db.connect((err) => {
            if (err) {
                console.error("Error al conectar a la base de datos:", err);
                return;
            }
            console.log("Conexión exitosa a la base de datos MySQL");
        });

        // Ruta raíz que realiza una consulta SQL y responde con una tabla HTML
        app.get("/", (_, res) => {
            // Realiza una consulta SQL para obtener datos de la tabla 'tu_tabla'
            const query = "SELECT * FROM alumnos";

            db.query(query, (err, result) => {
                if (err) {
                    console.error("Error al ejecutar la consulta SQL:", err);
                    res.status(500).send("Error interno del servidor");
                    return;
                }

                // Formulario HTML para agregar un nuevo alumno
                const formHtml = `
        <h2>Agregar Nuevo Alumno</h2>
        <form method="POST" action="/agregar">
        <label for="apellidos">Apellidos:</label>
        <input type="text" id="apellidos" name="apellidos" required><br>

        <label for="nombres">Nombres:</label>
        <input type="text" id="nombres" name="nombres" required><br>

        <label for="dni">DNI:</label>
        <input type="text" id="dni" name="dni" required><br>

        <input type="submit" value="Agregar">
        </form>
    `;

                // Generamos la tabla HTML con los datos de la consulta
                let tableHtml =
                    "<table><tr><th>ID</th><th>Apellidos 1</th><th>Nombres</th><th>DNI</th></tr>";
                result.forEach((row) => {
                    tableHtml += `<tr><td>${row.id}</td><td>${row.apellidos}</td><td>${row.nombres}</td><td>${row.dni}</td></tr>`;
                });
                tableHtml += "</table>";

                // Envía la tabla HTML como respuesta
                res.send(tableHtml + formHtml);
            });
        });

        app.post("/agregar", (req, res) => {
            const { apellidos, nombres, dni } = req.body;

            // Realiza una consulta SQL para insertar un nuevo alumno en la tabla 'alumnos'
            const insertQuery =
                "INSERT INTO alumnos (apellidos, nombres, dni) VALUES (?, ?, ?)";

            db.query(insertQuery, [apellidos, nombres, dni], (err, result) => {
                if (err) {
                    console.error("Error al insertar alumno:", err);
                    res.status(500).send("Error interno del servidor");
                    return;
                }

                console.log("Nuevo alumno agregado a la base de datos");
                console.log(result);
                // Redirige de nuevo a la página principal después de agregar el alumno
                res.redirect("/");
            });
        });

        // Iniciar el servidor
        app.listen(port, () => {
            console.log(
                `Servidor escuchando en el puerto ${port}. Ir a http://localhost:${port}`
            );
        });
    } catch (error) {
        console.error("No se pudo conectar a MySQL:", err);
        process.exit(1);
    }
};

server();
