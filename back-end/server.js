var mysql = require("mysql");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { uuid } = require("uuidv4");

const port = 7800;
app.use(bodyParser());
app.use(cors());
let pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "vishnu",
});

app.get("/", (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) res.status(500).send("DB connection error");
    connection.query(`SELECT * FROM TODO`, function (error, results, fields) {
      connection.release();
      if (error) {
        console.log(error);
        res.status(500).send(error);
      }
      res.send(results);
    });
  });
});

app.post("/todos", function (req, res) {
  pool.getConnection(function (err, connection) {
    if (err) res.status(500).send("DB connection error");
    let val = [[req.body.title, req.body.completed]];
    connection.query(
      "INSERT INTO TODO (title,markComplete) VALUES ?",
      [val],
      function (error, results, fields) {
        connection.release();
        if (error) {
          console.log(error);
          res.status(500).send(error);
        }
        res.send(results);
      }
    );
  });
});

app.delete("/user/:id", function (req, res) {
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(`DELETE FROM TODO WHERE id = ${req.params.id}`, function (
      error,
      results,
      fields
    ) {
      connection.release();
      if (error) res.status(500).send(error);
      res.send(results);
    });
  });
});

app.put("/user/:id", function (req, res) {
  pool.getConnection(function (err, connection) {
    if (err) res.status(500).send("DB connection error");
    connection.query(
      `UPDATE TODO SET markComplete = ${!req.body.completed} WHERE id = ${
        req.params.id
      }`,
      function (error, results, fields) {
        connection.release();
        if (error) {
          console.log(error);
          res.status(500).send(error);
        }
        res.send(results);
      }
    );
  });
});

app.listen(port, () => console.log(`example app listening on port ${port}!`));
