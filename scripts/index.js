"use strict";

const mysql = require("mysql");
const dao = require("./dao.js");
const utils=require("./utils.js")

const pool = mysql.createPool({
  host: "localhost",
  user: "admin_aw",
  password: "",
  database: "viajes",
});

let dDeDao = new dao(pool);
let usuario = ["Pueblo Sergio", "Maravilloso pueblo para pasar el verano junto con Sergio", "(～﹃～)~zZ， (✿◡‿◡)， (￣、￣)", 21.3];
let str = "30/11/2023"

let date = utilsparseStrToDate(str)
let dato = [2, "Ana", "sergio@gmail.com", date];
dDeDao.reservaDestino(dato,cb_insertar)

function cb_insertar(err, resultado) {
  if (err) {
    console.log("ERROR AL INSERTAR DESTINO");
  } else {
    console.log(`EXITO AL INSERTAR DESTINO CON EL ID: ${resultado.insertId}`);
  }
}