// módulo utilizado expresamente para insertar los destinos en la BD ("en sucio")

"use strict";

const mysql = require("mysql");
const dao = require("./dao.js");
const path = require("node:path");
const pool = require("./pool.js")

/*const pool = mysql.createPool({
  host: "localhost",
  user: "admin_aw",
  password: "",
  database: "viajes",
});

var p=new pool("localhost", "admin_aw", "", "viajes");
var destDao = new dao(p.get_pool());

var imgPath = path.join(__dirname,"public","Images","rioasaExt.jpg");

var destino = ["Río de Janeiro", "Imagen del amanecer de Rio de Janeiro", imgPath, 312.99];

destDao.insertarDestino(destino,cb_insertar)*/

/*
var dest_id = "Hawaii"; // nombre o id del destino
destDao.leerDestinoNombre(dest_id, cb_leer);*/

function cb_leer(err, res) {
  if (err) {
    //console.log("ERROR AL LEER DESTINO", err);
  } else {
    if (res.length == 0){ 
      //console.log("No se ha encontrado ningún destino.");
    }
    else {
      res.map((obj) => {
       // console.log(
       //   `Nombre: ${obj.nombre}, Descripción: ${obj.descripcion}, Precio: ${obj.precio}`
       // );
      });
    }
  }
}

function cb_insertar(err, resultado) {
  if (err) {
  //  console.log("ERROR AL INSERTAR DESTINO", err);
  } else {
   // console.log(`EXITO AL INSERTAR DESTINO CON EL ID: ${resultado.insertId}`);
  }
}
