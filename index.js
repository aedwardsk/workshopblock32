require("dotenv").config();
//import expess
const express = require("express");
const morgan = require("morgan");
const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL || "postgres://localhost:5432/acme_icecream_db");
//store port in a variable
console.log(process.env.PORT);

//initialize express
const app = express();
//middleware
app.use(morgan("dev"));
//parse any incoming json data
app.use(express.json());
//routes after middleware
app.get("/api/flavors", async (req, res, next) => {
  try {
    const SQL = /*sql*/ `
   SELECT * FROM flavors;
   `;
    const response = await client.query(SQL);
    console.log(response.row);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

app.post("/api/flavors", async (req, res) => {
  try {
    console.log(req.body);
    const SQL = /*sql*/ `
    INSERT INTO flavors (txt, ranking) VALUES ($1, $2) RETURNING *;
    `;
    const response = await client.query(SQL, [req.body.txt, req.body.ranking]);
    res.send(response.rows[0]);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/api/flavors/:id", async (req, res, next) => {
  res.send({ "this is were the flavors will be": "flavors" });
});

app.delete("/api/flavors/:id", async (req, res, next) => {
  res.send({ "this is were the flavors will be": "flavors" });
});

//init function - this will handle all three functions.

async function init() {
  //connect to database
  await client.connect();
  console.log("connected to database");
  //add data to database
  const SQL = /*sql*/ `
  DROP TABLE IF EXISTS flavors;
  CREATE TABLE flavors(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_favorite BOOLEAN 
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    txt VARCHAR(255)
  );
  INSERT INTO flavors (name, txt, is_favorite ) VALUES 
  ('Vanilla', 'Ingredients: Milk, Sugar, Cream, Corn Syrup, Natural Flavor, Vanilla Bean Extract', true),
  ('Chocolate', 'Ingredients: Milk, Sugar, Cream, Corn Syrup, Natural Flavor, Cocoa Powder', true),
  ('Strawberry', 'Ingredients: Milk, Sugar, Cream, Corn Syrup, Natural Flavor, Strawberry Puree', true),
  ('Mint Chocolate Chip', 'Ingredients: Milk, Sugar, Cream, Corn Syrup, Natural Flavor, Chocolate Chips, Mint Extract', true),
  ('Rocky Road', 'Ingredients: Milk, Sugar, Cream, Corn Syrup, Natural Flavor, Marshmallows, Almonds, Chocolate Chips', false),
  ('Butter Pecan', 'Ingredients: Milk, Sugar, Cream, Corn Syrup, Natural Flavor, Pecans', false),
  `;
  await client.query(SQL);
  //start server
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port 3000 ${process.env.PORT}`);
  });
}

init();
