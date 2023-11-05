"use strict";

const fs = require("node:fs");
const path = require("node:path");

// Clase para conectar con la BD. Recibe un pool de conexiones ya inicializado como argumento.
class DAO {
  constructor(pool) {
    this.pool = pool;
  }

  /* Función que, dado un nombre, descripción, una ruta de imagen local y un precio, lo inserta en la BD.
   Si no existe el path de la imagen, manda el error al callback. */
  insertarDestino(destino, callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err)
        //console.log("Ha ocurrido un error: ", err.message);
      } else {
        // console.log("Conectado a la BD ");

        var imgRoute = destino[2];
        var img = undefined;
        try {
          img = fs.readFileSync(imgRoute);
        } catch (error) {
          callback(error);
          return;
        }

        destino[2] = img;

        const sql =
          "Insert Into destinos (nombre, descripcion, imagen, precio) VALUES (?,?,?,?) ";
        connection.query(sql, destino, callback);
        connection.release();
      }
    });
  }

   /* Función que, dado un identificador de destino, lee el destino asociado a ese ID de la BD y devuelve todos
   sus parámetros (en caso de haberlos). */
  leerDestinoId(id, callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        //console.log("Conectado a la BD ");
        const sql = "Select * From destinos Where id = ?";
        connection.query(sql, id, callback);
        connection.release();
      }
    });
  }

  /* Función que, dado un nombre de destino, lee el destino con ese nombre de la BD y devuelve todos
   sus parámetros (en caso de haberlos). */
  leerDestinoNombre(name, callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err)
      } else {
       // console.log("Conectado a la BD ");
        const sql = "Select * From destinos Where nombre = ?";
        connection.query(sql, name, callback);
        connection.release();
      }
    });
  }

 /* Función que, dado un id válido de destino, un nombre, un correo, una fecha de reserva de ida y una de vuelta, genera
   una nueva reserva en la tabla correspondiente. */
  reservaDestino(dato, callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err)
      } else {
       // console.log("Conectado a la BD ");
        const sql =
          "Insert Into reservas (destino_id, nombre_cliente, correo_cliente, fecha_reserva_ida, fecha_reserva_vuelta)"+
          +" VALUES (?,?,?,?,?) ";
        connection.query(sql, dato, callback);
        connection.release();
      }
    });
  }

  // Función que cierra el pool de conexiones una vez se hyaa terminado de hacer consultas.
  terminarConexion(callback) {
    this.pool.end(callback);
  }
}

module.exports = DAO;
