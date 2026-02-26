import express from "express";
import { authRouter } from "./modules/auth/auth.routes";
import { articlesRouter } from "./modules/articles/articles.routes";
import { authorRouter } from "./modules/author/author.routes";
import { errorHandler } from "./core/middleware/error";

const app = express();

app.use(express.json());

app.set("trust proxy", 1);

app.get("/health", (_req, res) => {
  res.status(200).json({
    Success: true,
    Message: "OK",
    Object: { status: "healthy" },
    Errors: null
  });
});

app.use("/auth", authRouter);
app.use("/articles", articlesRouter);
app.use("/author", authorRouter);

app.use(errorHandler);

export { app };
