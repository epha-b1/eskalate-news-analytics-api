import express from "express";
import { authRouter } from "./routes/auth.routes";
import { articlesRouter } from "./routes/articles.routes";
import { authorRouter } from "./routes/author.routes";
import { errorHandler } from "./middleware/error";

const app = express();

app.use(express.json());

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
