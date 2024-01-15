import "dotenv/config";
import express from "express";
import "express-async-errors"
import { startDatabase } from "./database.js";
import { routes } from "./Routes/index.routes.js"
import { handleErrors } from "./Middlewares/handleErrors.middlewares.js";
import cors from 'cors';

const corsOptions = {
  origin: 'https://tonton-one.vercel.app/register',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};


export const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.use("/", routes)
app.use(handleErrors)

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, async () => {
  await startDatabase();
  console.log(`app running on port: ${PORT}`);
});
