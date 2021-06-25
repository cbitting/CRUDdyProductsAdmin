import { createServer } from "http";
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import { join } from "path";
import { Low, JSONFile } from "lowdb";
import { v4 as uuidv4 } from "uuid";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import healthApi from './routes/health.js';
import productsApi from './routes/products.js';


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.disable("x-powered-by");

app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", 1);
  res.setHeader(
    "Cache-Control",
    "no-cache, no-store, must-revalidate, private"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});





const __dirname = path.resolve();
const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);



const swaggerDefinition = {
  openapi: '3.0.3',
    info: {
      title: 'CRUDdy Products API',
      version: '1.0.1',
    },
    servers: [
      {
        url: 'http://localhost:4200',
        description: 'Development server',
      },
    ],
};

const options = {
  swaggerDefinition,
  apis: ['./server/routes/*.js'],
};


const openapiSpecification = await swaggerJsdoc(options);

console.dir(openapiSpecification);

app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));


app.use('/api/health', healthApi);

app.use('/api/products', productsApi);


//just for creating a new db file if needed.
app.get("/api/createsampledata", async function (req, res) {
  await db.read();
  console.log("create sample" + uuidv4());
  if (!db.data) {
    db.data = { products: [] };
  }

  const { products } = db.data;
  console.dir(products);
  if (!products) {
    console.log("created sample data");
    db.data = { products: [] };
  }
  products.push({
    id: uuidv4(),
    name: "Banana Slicer",
    descrip: "Cut bananas the easy way.",
    price: 24.99,
    archived: false,
  });
  products.push({
    id: uuidv4(),
    name: "300 Function Swiss Army Knife",
    descrip: "Literally has everything you need.",
    price: 199.99,
    archived: false,
  });
  products.push({
    id: uuidv4(),
    name: "Red Copper Pan",
    descrip: "Never sticks - just like my diet.",
    price: 49.99,
    archived: true,
  });

  // Write data to db.json
  await db.write();
  return res.send({ status: "Created sample data." });
});



const port = process.env.PORT || 8080;

let server = null;

server = createServer(app);

server.listen(port, () =>
  console.log("CRUDdyProducts app listening on port " + port)
);
