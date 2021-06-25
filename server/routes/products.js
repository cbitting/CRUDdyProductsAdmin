import { Router } from "express";
import path from "path";
import { join } from "path";
import { Low, JSONFile } from "lowdb";
import { v4 as uuidv4 } from "uuid";

const __dirname = path.resolve();
const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

var productsApi = Router();

/**
 * @openapi
 * /api/products/product/{id}:
 *   get:
 *     summary: Retrieve a product by the product ID.
 *     description: Retrieve a product by the product ID and returns the product object.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID ID of the product to retrieve.
 *         schema:
 *           type: string
 *           example: 57c7fc0b-5d0b-4b36-934d-b4ed45c7b6b9
 *     responses:
 *       200:
 *         description: Returns a product json.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
productsApi.get("/product/:id", async function (req, res) {
  console.log(req.params.id);
  await db.read();

  if (!db.data) {
    db.data = { products: [] };
  }

  const { products } = db.data;
  const product = products.find((p) => p.id == req.params.id);

  return res.send(JSON.stringify(product));
});

/**
 * @openapi
 * /api/products/view/{name}:
 *   get:
 *     summary: Retrieve a product by the product name.
 *     description: Retrieve a product by the product name and returns the product object.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: name of the product to retrieve.
 *         schema:
 *           type: string
 *           example: Red Copper Pan
 *     responses:
 *       200:
 *         description: Returns a product json.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
productsApi.get("/view/:name", async function (req, res) {
  //if you want to get via name
  console.log(req.params.id);
  await db.read();

  if (!db.data) {
    db.data = { products: [] };
  }

  const { products } = db.data;
  const product = products.find((p) => p.name == req.params.name);

  return res.send(JSON.stringify(product));
});

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by the product id.
 *     description: Sets a product to archived.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id of the product to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns a product json.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
productsApi.delete("/:id", async function (req, res) {
  console.log("delete prod." + req.params.id);

  await db.read();

  if (!db.data) {
    db.data = { products: [] };
  }

  const { products } = db.data;
  console.dir(products);
  if (!products) {
    db.data = { products: [] };
  }

  let dbProduct = null;
  products.forEach((p) => {
    if (p.id == req.params.id) {
      p.archived = true;

      dbProduct = p;
    }
  });

  await db.write();

  return res.send(dbProduct);
});

/**
 * @openapi
 * /api/products:
 *   post:
 *     summary: Creates a new product.
 *     description: Adds a new product from a json product object passed.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name.
 *                 example: Sample Product
 *               descrip:
 *                 type: string
 *                 description: Product description.
 *                 example: This sample product will change your life.
 *               price:
 *                 type: number
 *                 description: Product price.
 *                 example: 50.00
 *     responses:
 *       200:
 *         description: Returns a product json.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
productsApi.post("/", async function (req, res) {
  console.log("create prod.");

  await db.read();

  if (!db.data) {
    db.data = { products: [] };
  }

  const { products } = db.data;
  console.dir(products);
  if (!products) {
    db.data = { products: [] };
  }
  let product = req.body;
  product.id = uuidv4();
  product.archived = false;
  products.push(product);

  await db.write();
  return res.send(product);
});

/**
 * @openapi
 * /api/products:
 *   put:
 *     summary: Updates a product.
 *     description: Updates a product from a json product object passed.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Product ID.
 *                 example: 643ad598-f886-491b-b5a4-5789a431724c
 *               name:
 *                 type: string
 *                 description: Product name.
 *                 example: Sample Product
 *               descrip:
 *                 type: string
 *                 description: Product description.
 *                 example: This sample product will change your life.
 *               price:
 *                 type: number
 *                 description: Product price.
 *                 example: 50.00
 *     responses:
 *       200:
 *         description: Returns a product json.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
productsApi.put("/", async function (req, res) {
  console.log("update prod.");

  await db.read();

  if (!db.data) {
    db.data = { products: [] };
  }

  const { products } = db.data;
  console.dir(products);

  if (!products) {
    db.data = { products: [] };
  }

  let product = req.body;
  let dbProduct = null;
  products.forEach((p) => {
    if (p.id == product.id) {
      p.name = product.name;
      p.descrip = product.descrip;
      p.price = product.price;
      dbProduct = p;
    }
  });

  await db.write();

  return res.send(dbProduct);
});

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Retrieves all active products.
 *     description: Retrieves products and returns the product objects array. Doesn't include archived.
 *     responses:
 *       200:
 *         description: Returns a products json.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
productsApi.get("/", async function (req, res) {
  await db.read();

  if (!db.data) {
    db.data = { products: [] };
  }

  const { products } = db.data;

  let rProducts = [];
  //filter out deleted because lowdb file thing is too simple
  products.forEach((p) => {
    if (p.archived == false) {
      rProducts.push(p);
    }
  });

  return res.send(JSON.stringify(rProducts));
});

/**
 * @openapi
 * /api/products/archived:
 *   get:
 *     summary: Retrieves all archived (deleted) products.
 *     description: Retrieves deleted products and returns the product objects array. Doesn't include active.
 *     responses:
 *       200:
 *         description: Returns a products json.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

productsApi.get("/archived", async function (req, res) {

  await db.read();

  if (!db.data) {
    db.data = { products: [] };
  }

  const { products } = db.data;

  let rProducts = [];
  //filter because lowdb file thing is too simple
  products.forEach((p) => {

    if (p.archived == true) {
      rProducts.push(p);
    }
  });

  return res.send(JSON.stringify(rProducts));
});

export default productsApi;
