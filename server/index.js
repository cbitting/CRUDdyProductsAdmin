import { createServer } from "http";
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import { join } from "path";
import { Low, JSONFile } from "lowdb";
import { v4 as uuidv4 } from "uuid";

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

app.get("/api/health", function (req, res) {
  return res.send({ status: "OK" });
});

const __dirname = path.resolve();
const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

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

app.get("/api/product/:id", async function (req, res) {
  console.log(req.params.id);
  await db.read();

  if (!db.data) {
    db.data = { products: [] };
  }

  const { products } = db.data;
  const product = products.find((p) => p.id == req.params.id);

  return res.send(JSON.stringify(product));
});

app.get("/api/product/view/:name", async function (req, res) {
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

app.delete("/api/product/:id", async function (req, res) {
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

app.post("/api/product", async function (req, res) {
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

app.put("/api/product", async function (req, res) {
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

app.get("/api/products", async function (req, res) {
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

app.get("/api/products/archived", async function (req, res) {
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

const port = process.env.PORT || 8080;

let server = null;

server = createServer(app);

server.listen(port, () =>
  console.log("CRUDdyProducts app listening on port " + port)
);
