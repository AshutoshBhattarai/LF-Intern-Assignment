/* --------------------------------- Imports -------------------------------- */
import express, { Express } from "express";
import "reflect-metadata";
import config from "./configs/Index";
import routes from "./routes/Index";
import databaseConnection from "./database/connection";
import logHandler from "./middlewares/LogHandler";
import errorHandler from "./middlewares/ErrorHandler";

/* -------------------------- Server initialization ------------------------- */
const app: Express = express();
const PORT = config.serverPort;
/* --------------------------- Database connection -------------------------- */
databaseConnection();
/* ------------------------------- Middlewares ------------------------------ */
// Middleware to parse request body
app.use(express.json());
// Middleware to parse url encoded request body
app.use(express.urlencoded({ extended: false }));
// Middleware to handle logging
app.use(logHandler);
// Middleware to handle routes
app.use(routes);
// Middleware to handle errors
app.use(errorHandler);
/* --------------------------- Running the server --------------------------- */
// Server is running on port 5005
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
