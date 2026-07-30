import "./types/express";
import express, { Request, Response, NextFunction } from "express";
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
  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
        origin: "http://localhost:5173",
        credentials: true,
    }),
    apolloMiddleware
  );
  app.use("/api", restRouter);

  app.get("/", (req, res) => res.send("Server is running"));

  // 处理全局错误
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  });

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer();
