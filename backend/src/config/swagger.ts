import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Coworking",
      version: "1.0.0",
      description: "Sistema de reserva de salas de coworking"
    },
    servers: [{ url: "/api" }],
    components: {
      // define o esquema de autenticação JWT (pro botão "Authorize" aparecer)
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        Usuario: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            nome: { type: "string", example: "Admin Teste" },
            email: { type: "string", example: "admin@coowork.com" },
            cpf: { type: "string", example: "11111111111" },
            isAdmin: { type: "boolean", example: true }
          }
        },
        NovoUsuarioInput: {
          type: "object",
          required: ["nome", "email", "cpf", "senha"],
          properties: {
            nome: { type: "string", example: "Maria Silva" },
            email: { type: "string", example: "maria@example.com" },
            cpf: { type: "string", example: "12345678900" },
            senha: { type: "string", format: "password", example: "senha123" }
          }
        },
        AtualizarUsuarioInput: {
          type: "object",
          properties: {
            nome: { type: "string" },
            email: { type: "string" },
            cpf: { type: "string" },
            senha: { type: "string", format: "password", description: "Deixe em branco pra manter a senha atual" }
          }
        },
        LoginInput: {
          type: "object",
          required: ["email", "senha"],
          properties: {
            email: { type: "string", example: "admin@coowork.com" },
            senha: { type: "string", format: "password", example: "senha123" }
          }
        },
        LoginResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            usuario: { $ref: "#/components/schemas/Usuario" }
          }
        },
        Sala: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            nome: { type: "string", example: "Sala Foco" },
            preco: { type: "number", example: 25 },
            capacidade: { type: "integer", example: 1 },
            descricao: { type: "string", nullable: true, example: "Sala individual, ideal pra chamadas." }
          }
        },
        SalaComDisponibilidade: {
          allOf: [
            { $ref: "#/components/schemas/Sala" },
            {
              type: "object",
              properties: {
                disponibilidade: {
                  type: "object",
                  properties: {
                    manha: { type: "boolean" },
                    tarde: { type: "boolean" },
                    noite: { type: "boolean" }
                  }
                }
              }
            }
          ]
        },
        SalaInput: {
          type: "object",
          required: ["nome", "preco", "capacidade"],
          properties: {
            nome: { type: "string", example: "Sala Foco" },
            preco: { type: "number", example: 25 },
            capacidade: { type: "integer", example: 1 },
            descricao: { type: "string", example: "Sala individual, ideal pra chamadas." }
          }
        },
        Reserva: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            diaDaReserva: { type: "string", format: "date-time" },
            turno: { type: "string", enum: ["manha", "tarde", "noite"] },
            status: { type: "string", enum: ["pendente", "confirmada", "cancelada"] },
            expireAt: { type: "string", format: "date-time", nullable: true },
            sala: {
              type: "object",
              properties: {
                nome: { type: "string" },
                preco: { type: "number" },
                capacidade: { type: "integer" }
              }
            }
          }
        },
        NovaReservaInput: {
          type: "object",
          required: ["idDaSala", "diaDaReserva", "turno"],
          properties: {
            idDaSala: { type: "integer", example: 1 },
            diaDaReserva: { type: "string", format: "date", example: "2026-08-05" },
            turno: { type: "string", enum: ["manha", "tarde", "noite"] }
          }
        },
        Erro: {
          type: "object",
          properties: {
            error: { type: "boolean", example: true },
            message: { type: "string", example: "Mensagem descrevendo o erro." },
            code: { type: "string", example: "CODIGO_DO_ERRO" }
          }
        }
      }
    },
    // aplica bearerAuth como padrão; rotas públicas removem com security: []
    security: [{ bearerAuth: [] }]
  },
  // onde ele procura os comentários — aponta pros teus arquivos de rota
  apis: ["./src/routes/*.ts"]
};

export const swaggerSpec = swaggerJsdoc(options);
