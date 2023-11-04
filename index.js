"use strict";

const express = require("express");
const path = require("path");
const port = 3000;
const app = express();
const dao = require("./dao.js");
const pool = require("./pool.js");

var destinies_json = {}; // name, description, photo, price
var mapper_json = {};
var destPool = new pool("localhost", "admin_aw", "", "viajes");
var destDao = new dao(destPool.get_pool());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (request, response) => {
  response.status(200).render("index.ejs");
});

app.get("/index.html", (request, response) => {
  response.status(200).render("index.ejs");
});

app.get("/destinos.html", (request, response) => {
  response.status(200).render("destinos.ejs");
});

app.get("/nosotros.html", (request, response) => {
  response.status(200).render("nosotros.ejs");
});

app.get("/sostenibilidad.html", (request, response) => {
  response.status(200).render("sostenibilidad.ejs");
});

app.get("/reservas.html", (request, response) => {
  response.status(200).render("reservas.ejs");
});

app.get("/destinos/:id", (request, response, next) => {
  var id = request.params.id;
  var context;
    console.log("ENTRO")

  if (id in destinies_json) {
    console.log("ESTOY EN EL IF")
    context = destinies_json[id];
    response.status(200).render("generalDestiny.ejs", context);
  } else {
    console.log("ESTOY EN EL ELSE")
    destDao.leerDestinoId(id, (err, res) => {
      if (err) {
        console.log("ERROR AL LEER DESTINO", err);
        next();
      } else {
        if (res.length != 0) {
          res.map((obj) => {
            context=obj;
          });
          response.status(200).render("generalDestiny.ejs", {datos:context});
        }
        else{
            next();
        }
      }
    });
  }

 
});

app.get("/destinos/albacete.html", (request, response) => {
  //json=consulta  a la BD
  response.status(200).render("plantillaGeneral.ejs", { datos: json });
});

app.get("/destinos/china.html", (request, response) => {
  response.status(200).render("reservas.ejs");
});

app.use((request, response) => {
  response.status(404).send("<h1> Error 404: Route is not defined</h1>");
});

app.listen(port, (err) => {
  if (err) {
    console.log("An error ocurred while listening to server");
  } else {
    console.log(`Server listening on port http://localhost:${port} `);
  }
});
