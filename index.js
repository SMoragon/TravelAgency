"use strict";

const express = require("express");
const path = require("path");
const port = 3000;
const app = express();
const dao = require("./dao.js");
const pool = require("./pool.js");
const bodyParser= require ("body-parser")
const expressValidator = require("express-validator");

var destPool = new pool("localhost", "admin_aw", "", "viajes");
var destDao = new dao(destPool.get_pool());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  expressValidator()
);

function checkFecha (data) {
  var fecha1=data[0];
  var fecha2=data[1];
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
        response.status(200).render("generalDestiny.ejs", { datos: context });
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
        response.status(200).render("generalDestiny.ejs", { datos: context });
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
        response.status(200).render("generalDestiny.ejs", { datos: context });
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
        response.status(200).render("generalDestiny.ejs", { datos: context });
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
        response.status(200).render("generalDestiny.ejs", { datos: context });
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
        response.status(200).render("generalDestiny.ejs", { datos: context });
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
        response.status(200).render("generalDestiny.ejs", { datos: context });
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

  // El campo email ha de ser una dirección de correo válida.
  console.log(request.body)
  request.checkBody("client-email", "Dirección de correo no válida").isEmail();

  // La fecha de ida debe ser posterior a la actual.
  request
    .checkBody(
      "client-res-from-date",
      "La fecha actual debe ser anterior a la de ida"
    )
    .isAfter();

  // La fecha de vuelta debe ser posterior a la actual.
  request
    .checkBody(
      "client-res-to-date",
      "La fecha actual debe ser anterior a la de vuelta"
    )
    .isAfter();

  // La fecha de vuelta debe ser posterior a la de ida.
  var dates_check = ["client-res-from-date", "client-res-to-date"];
  request
    .checkBody(dates_check, "La fecha de ida debe ser anterior a la de vuelta")
    .customSanitizer(checkFecha(dates_check));

  request.getValidationResult().then(async (result) => {
    // Si no hay errores, subimos la información a la BD.
    if (result.isEmpty()) {
      var res_result=await reservar(result);
      response.send(`<h1> ${res_result} </h1>`);
    } else {
      console.log(result.mapped())
      //response.render("resForm", { errores: result.array() });
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

async function reservar(result){

   var name=result.site-name;

   var id= await destDao.leerDestinoNombre(name,async (err,res)=>{
    if(err) return -1;
    else{
      return res[0].id;
    }
   });

   if(id==-1){
    return "Ha habido un error al buscar el destino";
   }
   else{
    var to_insert=[id];
    result.array.forEach(element => {
      to_insert.push(element.value);
    });

    var res_result= await destDao.reservaDestino(to_insert,async(err,res)=>{
      if(err){
        return err;
      } 
      else{
        return "¡Reserva completada!";
      }
    });
   }
   
   return res_result;
}