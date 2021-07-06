require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const db = require("./db");

const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

// Get all restaurants
app.get("/api/v1/restaurants", async (req, res) => {
  const response = await db.query("SELECT * FROM restaurants");
  try {
    res.json({
      status: "success",
      count: response.rows.length,
      data: {
        restaurants: response.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Get individual restaurants
app.get("/api/v1/restaurants/:restaurantId", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM restaurants WHERE id = $1", [
      req.params.restaurantId,
    ]);
    res.status(200).json({
      status: "success",
      data: {
        restaurant: response.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Create a restaurant
app.post("/api/v1/restaurants", async (req, res) => {
  try {
    const response = await db.query(
      "INSERT INTO restaurants(name, location, price_range) VALUES($1, $2, $3) returning *",
      [req.body.name, req.body.location, req.body.price_range]
    );
    res.status(201).json({
      status: "success",
      data: {
        restaurant: response.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Update restaurants
app.put("/api/v1/restaurants/:restaurantId", async (req, res) => {
  try {
    const response = await db.query(
      "UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *",
      [
        req.body.name,
        req.body.location,
        req.body.price_range,
        req.params.restaurantId,
      ]
    );
    res.status(200).json({
      status: "success",
      data: {
        restaurant: response.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Delete a restaurant
app.delete("/api/v1/restaurants/:restaurantId", async (req, res) => {
  try {
    await db.query("DELETE FROM restaurants WHERE id = $1", [
      req.params.restaurantId,
    ]);
    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    console.log(err);
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
