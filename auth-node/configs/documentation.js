import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const BASE_PATH = '/AureaRestaurant/Admin/v1';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Áurea Restaurant API",
      version: "1.0.0",
      description: "Documentación de la API del sistema de restaurante",
    },
    servers: [
      {
        url: `http://localhost:3020${BASE_PATH}`,
        description: "Servidor local",
      },
    ],
    tags: [
      { name: "Restaurante", description: "Gestión de restaurantes" },
      { name: "Categoria", description: "Gestión de categorías" },
      { name: "Cliente", description: "Gestión de clientes" },
      { name: "Mesa", description: "Gestión de mesas" },
      { name: "Producto", description: "Gestión de productos" },
      { name: "Pedido", description: "Gestión de pedidos" },
      { name: "Reservacion", description: "Gestión de reservaciones" },
    ],
  },
  apis: [
    "./src/restaurante/restaurante.routes.js",
    "./src/mesas/mesas.routes.js",
    "./src/producto/producto.routes.js",
    "./src/cliente/cliente.routes.js",
    "./src/reservacion/reservacion.routes.js",
    "./src/pedido/pedido.routes.js",
    "./src/categoria/categoria.routes.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));
  console.log(" Swagger docs disponibles en http://localhost:3020/api-docs");
};