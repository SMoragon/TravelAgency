"use strict";

const express = require("express");
const path = require("path");
const port = 3000;
const app = express();
const dao = require("./dao.js");
const pool = require("./pool.js");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");

var destPool = new pool("localhost", "admin_aw", "", "viajes");
var destDao = new dao(destPool.get_pool());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressValidator());

function checkFecha(data) {
  var fecha1 = data[0];
  var fecha2 = data[1];
  //fecha1 = `${fecha1.getFullYear()}-${fecha1.getMonth() + 1}-${fecha1.getDate()}`;
  //fecha2 = `${fecha2.getFullYear()}-${fecha2.getMonth() + 1}-${fecha2.getDate()}`;
  return fecha1 < fecha2;
}

app.use(bodyParser.urlencoded({ extended: true }));

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
  destDao.leerDestinoId(id, (err, res) => {
    if (err) {
      next();
    } else {
      var context;
      if (res.length != 0) {
        res.map((obj) => {
          context = obj;
        });
        response.status(200).render("generalDestiny.ejs", { datos: context, showModal:false });
      } else {
        next();
      }
    }
  });
});

app.get("/destinos/albacete.html", (request, response, next) => {
  destDao.leerDestinoNombre("Albacete", (err, res) => {
    if (err) {
      next();
    } else {
      var context;
      if (res.length != 0) {
        res.map((obj) => {
          context = obj;
        });
        response.status(200).render("generalDestiny.ejs", { datos: context, showModal:false });
      } else {
        next();
      }
    }
  });
});

app.get("/destinos/china.html", (request, response, next) => {
  destDao.leerDestinoNombre("china", (err, res) => {
    if (err) {
      next();
    } else {
      var context;
      if (res.length != 0) {
        res.map((obj) => {
          context = obj;
        });
        response.status(200).render("generalDestiny.ejs", { datos: context, showModal:false });
      } else {
        next();
      }
    }
  });
});

app.get("/destinos/hawaii.html", (request, response, next) => {
  destDao.leerDestinoNombre("hawaii", (err, res) => {
    if (err) {
      next();
    } else {
      var context;
      if (res.length != 0) {
        res.map((obj) => {
          context = obj;
        });
        response.status(200).render("generalDestiny.ejs", { datos: context, showModal:false });
      } else {
        next();
      }
    }
  });
});

app.get("/destinos/milan.html", (request, response, next) => {
  destDao.leerDestinoNombre("milan", (err, res) => {
    if (err) {
      next();
    } else {
      var context;
      if (res.length != 0) {
        res.map((obj) => {
          context = obj;
        });
        response.status(200).render("generalDestiny.ejs", { datos: context, showModal:false });
      } else {
        next();
      }
    }
  });
});

app.get("/destinos/praga.html", (request, response, next) => {
  destDao.leerDestinoNombre("praga", (err, res) => {
    if (err) {
      next();
    } else {
      var context;
      if (res.length != 0) {
        res.map((obj) => {
          context = obj;
        });
        response.status(200).render("generalDestiny.ejs", { datos: context, showModal:false });
      } else {
        next();
      }
    }
  });
});

app.get("/destinos/rio.html", (request, response, next) => {
  destDao.leerDestinoNombre("Río de Janeiro", (err, res) => {
    if (err) {
      next();
    } else {
      var context;
      if (res.length != 0) {
        res.map((obj) => {
          context = obj;
        });
        response.status(200).render("generalDestiny.ejs", { datos: context, showModal:false });
      } else {
        next();
      }
    }
  });
});

app.post("/procesar_formulario", async (request, response) => {
  // Todos los campos han de ser no vacíos.
  var arr_check = [
    "client-full-name",
    "client-email",
    "client-res-from-date",
    "client-res-to-date",
  ];

  // request
  //  .checkBody(arr_check, "Todos los campos deben estar rellenos.")
  // .notEmpty();
  request
    .checkBody(
      "client-full-name",
      "El campo 'Nombre y apellidos' debe estar completo."
    )
    .notEmpty();
  // El campo email ha de ser una dirección de correo válida.
  request
    .checkBody(
      "client-email",
      "La dirección de correo electrónico no es válida."
    )
    .notEmpty()
    .isEmail();

  // La fecha de ida debe ser posterior a la actual.
  request
    .checkBody(
      "client-res-from-date",
      "La fecha de ida debe de ser posterior o la misma que la actual, y no vacía."
    )
    .notEmpty()
    .isAfter(new Date().toDateString());

  // La fecha de vuelta debe ser posterior a la de ida.
  request
    .checkBody(
      "client-res-to-date",
      "La fecha de vuelta debe de ser posterior o la misma a la de la ida, y no vacía."
    )
    .notEmpty()
    .isAfter(new Date(request.body["client-res-from-date"]).toDateString())
    .isAfter(new Date().toDateString());

  /*  console.log("actual: ",new Date().toDateString())
    console.log("ida: ",new Date(request.body["client-res-from-date"]).toDateString())
    console.log("vuelta: ",new Date(request.body["client-res-from-date"]).toDateString())*/
  request.getValidationResult().then(async (result) => {
    // Si no hay errores, subimos la información a la BD.
    if (result.isEmpty()) {
      //var res_result=await reservar(result);
      response.redirect("/");
    } else {
      console.log(request.body["client-full-name"])
      console.log("errores: ", result.mapped());
      destDao.leerDestinoNombre(request.body["site-name"], (err, res) => {
        if (err) {
          next();
        } else {
          var context;
          if (res.length != 0) {
            res.map((obj) => {
              context = obj;
            });
            response.status(200).render("generalDestiny.ejs", { errores: result.mapped(), datos: context, body:request.body, showModal:true });
          } else {
            next();
          }
        }
      });
    }
  });
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

function reservar(request, response, name) {
  destDao.leerDestinoNombre(name, (err, res) => {
    if (err) {
      response.status(404).send("<h1> Error 404: Error inesperado</h1>");
    } else {
      var datos = [
        res[0].id,
        request.body["client-full-name"],
        request.body["client-email"],
        new Date(request.body["client-res-from-date"]),
        new Date(request.body["client-res-to-date"]),
      ];
      destDao.reservaDestino(datos, (err, res) => {
        if (err) {
          console.log(err);
          response.status(404).send(`Error`);
        } else {
          response.render("reservaCompletada.ejs", { nombre: name });
        }
      });
    }
  });
}

async function reservar(result) {
  var name = result.site - name;

  var id = await destDao.leerDestinoNombre(name, async (err, res) => {
    if (err) return -1;
    else {
      return res[0].id;
    }
  });

  if (id == -1) {
    return "Ha habido un error al buscar el destino";
  } else {
    var to_insert = [id];
    result.array.forEach((element) => {
      to_insert.push(element.value);
    });

    var res_result = await destDao.reservaDestino(
      to_insert,
      async (err, res) => {
        if (err) {
          return err;
        } else {
          return "¡Reserva completada!";
        }
      }
    );
  }

  return res_result;
}
