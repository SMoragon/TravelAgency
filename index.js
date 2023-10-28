"use strict";
const mysql = require("mysql");
const dao = require("./dao.js");

const pool = mysql.createPool({
  host: "localhost",
  user: "admin_aw",
  password: "",
  database: "viajes",
});

let dDeDao = new dao(pool);
let usuario = ["Pueblo de Ana Mena", "Maravilloso pueblo para pasar el verano junto con los familiares de Ana Mena", "(～﹃～)~zZ， (✿◡‿◡)， (￣、￣)", 21.3];
dDeDao.insertarDestino(usuario,cb_insertarDestino)

function cb_insertarDestino(err, resultado) {
  if (err) {
    console.log("ERROR AL INSERTAR DESTINO");
  } else {
    console.log(`EXITO AL INSERTAR DESTINO CON EL ID: ${resultado.insertId}`);
  }
}