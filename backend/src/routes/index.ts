import { Router } from "express";


import usuarioRoutes from "./usuarioRoutes.js"
import authRoutes from "./authRoutes.js"
import salasRoutes from "./salasRoutes.js"
import reservasRoutes from "./reservasRoutes.js"

const router = Router();

router.get("/health", (req , res) => {

    return res.json({
        status: "ok",
        uptime : process.uptime(),
        timeStamp: new Date().toISOString()
    })
})


router.get("/", (req, res) => {
  return res.json({
    message: "Bem-vindo à API do Sistema de Gestão e Reserva de Coworking!",
    version: "1.0.0",
  });
});

router.use("/usuarios" , usuarioRoutes)
router.use("/auth", authRoutes);   // vira POST /api/auth/login
router.use("/salas" , salasRoutes);
router.use("/reservas" , reservasRoutes);

export default router; 

