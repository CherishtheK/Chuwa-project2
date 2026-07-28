import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import cors from "cors";
dotenv.config();
import createApolloMiddleware from "./graphql/server";
import restRouter from "./rest";

const app = express();
const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  app.use(express.json());
  app.use(cors());

  const apolloMiddleware = await createApolloMiddleware();
  app.use("/graphql", apolloMiddleware);
  app.use("/api", restRouter);

  app.get("/", (req, res) => res.send("Server is running"));

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer();
