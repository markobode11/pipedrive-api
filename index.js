import express, { json } from "express";
import api from './src/api/index.js'

const app = express();
const PORT = process.env.PORT;

// Register api routes
app.use("", api());

// Add middlewares
app.use(json());

app.listen(PORT, () => console.log(`Application running on localhost:${PORT}`));
