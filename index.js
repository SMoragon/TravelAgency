"use strict";

const express = require("express");
const path = require("path");
const port = 3000;
const app = express();
const dao = require("./dao.js");
const pool = require("./pool.js");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const mysqlsession = require("express-mysql-session");
const MYSQLStore = mysqlsession(session);
const sessionStore = new MYSQLStore({
  host: "localhost",
  user: "admin_aw",
  password: "",
  database: "viajes",
});
const middlewareSession = session({
  saveUninitialized: false,
  secret: "viajesElCorteIngles224",
  resave: false,
  store: sessionStore,
});

var destPool = new pool("localhost", "admin_aw", "", "viajes");
var destDao = new dao(destPool.get_pool());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(middlewareSession);

app.use(expressValidator());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
// Enrutamiento de las páginas principales de nuestra aplicación.
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

// Gestión de las rutas de destinos paramétricas (es decir, aquellas en las que el usuario en lugar de
// introducir un nombre de destino, introduce un id).
app.get("/destinos/:id", (request, response, next) => {
  sendToDestinyId(request, response, next);
});

// Gestión de las páginas de destino en función de su nombre.
app.get("/destinos/albacete.html", (request, response, next) => {
  sendToDestiny(response, "Albacete", next);
});

app.get("/destinos/china.html", (request, response, next) => {
  sendToDestiny(response, "China", next);
});

app.get("/destinos/hawaii.html", (request, response, next) => {
  sendToDestiny(response, "Hawaii", next);
});

app.get("/destinos/milan.html", (request, response, next) => {
  sendToDestiny(response, "Milan", next);
});

app.get("/destinos/praga.html", (request, response, next) => {
  sendToDestiny(response, "Praga", next);
});

app.get("/destinos/rio.html", (request, response, next) => {
  sendToDestiny(response, "Río de Janeiro", next);
});

app.get("/register", (request, response, next) => {
  response.status(200).render("register.ejs");
});

app.post("/register", (request, response, next) => {
  destDao.buscarUsuario(request.body["user-email"], (err, res) => {
    if (err) {
      response.status(403).render("register.ejs", {
        errors: "Ha ocurrido un error interno en el acceso a la BD.",
      });
    } else {
      if (res.length != 0) {
        response.status(403).render("register.ejs", {
          errors: "El correo introducido ya está registrado.",
        });
      } else {
        var datos = [request.body["user-email"], request.body["user-password"]];
        destDao.registrarUsuario(datos, (err, res) => {
          if (err) {
            response.status(403).render("register.ejs", {
              errors: "Ha ocurrido un error interno en el acceso a la BD.",
            });
          } else {
            response.status(200).render("registroCompletado.ejs");
          }
        });
      }
    }
  });
});

app.get("/login", (request, response, next) => {
  response.status(200).render("login.ejs");
});

app.post("/login", (request, response, next) => {
  destDao.buscarUsuario(request.body["user-email"], (err, res) => {
    if (err) {
      response.status(403).render("login.ejs", {
        errors: "Ha ocurrido un error interno en el acceso a la BD.",
      });
    } else {
      if (res.length == 0) {
        response.status(403).render("login.ejs", {
          errors: "El usuario introducido no está registrado.",
        });
      } else {
        var context;
        res.map((obj) => {
          context = obj;
        });

        if (request.body["user-password"] != context.contraseña) {
          response.status(403).render("login.ejs", {
            errors: "La contraseña introducida no es correcta.",
          });
        } else {
          request.session.isLogged = true;
          request.session.user = request.body["user-email"];
          response.status(200).render("index.ejs"); // De momento index, ya cogeremos la ruta en la que estaba
        }
      }
    }
  });
});

app.post("/procesar_formulario", async (request, response) => {
  // Se procede a la validación de los datos del usuario.
  validateForm(request);

  request.getValidationResult().then(async (result) => {
    // Si no hay errores, subimos la información a la BD.
    if (result.isEmpty()) {
      reservar(request, response);
    }
    // Si no, se vuelve a renderizar la página en la que estaba el usuario, con el formulario
    // abierto, relleno y con los errores que se han producido.
    else {
      destDao.leerDestinoNombre(request.body["site-name"], (err, res) => {
        if (err) {
          next();
        } else {
          var context;
          if (res.length != 0) {
            res.map((obj) => {
              context = obj;
            });
            response.status(200).render("generalDestiny.ejs", {
              errores: result.mapped(),
              datos: context,
              body: request.body,
              showModal: true,
            });
          } else {
            next();
          }
        }
      });
    }
  });
});

// Middleware para manejar rutas que no pertenezcan a la aplicación.
app.use((request, response) => {
  response.status(404).send("<h1> Error 404: Route is not defined</h1>");
});

// Función para iniciar el servidor, que espera las peticiones del usuario.
app.listen(port, (err) => {
  if (err) {
    console.log("An error ocurred while listening to server");
  } else {
    console.log(`Server listening on port http://localhost:${port} `);
  }
});

function reservar(request, response) {
  destDao.leerDestinoNombre(request.body["site-name"], (err, res) => {
    if (err) {
      response.status(403).send(`<h1>Error:${err}</h1>`);
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
          response.status(403).send(`<h1>Error:${err}</h1>`);
        } else {
          response.render("reservaCompletada.ejs", {
            nombre: request.body["site-name"],
          });
        }
      });
    }
  });
}

// Dado un nombre de destino, redirige al usuario a la página de destino asociada a ese nombre
// (si existe).
function sendToDestiny(response, name, next) {
  destDao.leerDestinoNombre(name, (err, res) => {
    if (err) {
      next();
    } else {
      var context;
      if (res.length != 0) {
        res.map((obj) => {
          context = obj;
        });
        response
          .status(200)
          .render("generalDestiny.ejs", { datos: context, showModal: false });
      } else {
        next();
      }
    }
  });
}

// Dado un identificador de destino, redirige al usuario a la página de destino asociada a ese id
// (si existe).
function sendToDestinyId(request, response, next) {
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
        response
          .status(200)
          .render("generalDestiny.ejs", { datos: context, showModal: false });
      } else {
        next();
      }
    }
  });
}

// Validación de todos los datos introducidos por el usuario en el formulario de reserva.
function validateForm(request) {
  // Todos los campos han de ser no vacíos.
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
}
