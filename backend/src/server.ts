import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import "dotenv/config";
import routes from "./routes/index.js";
import { swaggerSpec } from "./config/swagger.js";
import { AppError } from "./utils/AppError.js";

const app = express();
app.use(express.json());

const origensPermitidas = process.env.FRONTEND_URL?.split(",");
app.use(cors(origensPermitidas ? { origin: origensPermitidas } : {}));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("api-coowork");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", routes);



app.use(
  (err: Partial<AppError>, req: Request, res: Response, next: NextFunction) => {
    console.error("Erro detectado na aplicação:", err);

    // Formato padrão de resposta de erro. Retorna o status de erro específico do objeto ou 500 (Erro Interno).
    return res.status(err.status || 500).json({
      error: true,
      message: err.message || "Erro interno no servidor.",
      code: err.code || "INTERNAL_SERVER_ERROR",
    });
  },
);

app.use((req: Request, res: Response) => {
  return res.status(404).json({
    error: true,
    message: `Rota ${req.originalUrl} não encontrada.`,
    code: "NOT_FOUND",
  });
});
