"use strict";

const fs=require("node:fs");
const path=require("node:path");

class DAO {
  constructor(pool) {
    this.pool = pool;
  }

  insertarDestino(destino, callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        console.log("Ha ocurrido un error: ", err.message);
      } else {
        console.log("Conectado a la BD ");

        var imgRoute=destino[2];
        var img=undefined;
        try{
          img=fs.readFileSync(imgRoute);
        }
        catch(error){
          console.log("Ha ocurrido un error al leer la imagen: ",error);
          return;
        }

        destino[2]=img;
        console.log(destino)

        const sql =
          "Insert Into destinos (nombre, descripcion, imagen, precio) VALUES (?,?,?,?) ";
        connection.query(sql, destino, callback);
        connection.release();
      }
    });
  }

  leerDestinoId(id, callback){
    this.pool.getConnection((err, connection) => {
      if (err) {
        console.log("Ha ocurrido un error: ", err.message);
      } else {
        console.log("Conectado a la BD ");
        const sql ="Select * From destinos Where id = ?";
        connection.query(sql, id, callback);
        connection.release();
      }
    });
  }

  leerDestinoNombre(name, callback){
    this.pool.getConnection((err, connection) => {
      if (err) {
        console.log("Ha ocurrido un error: ", err.message);
      } else {
        console.log("Conectado a la BD ");
        const sql ="Select * From destinos Where nombre = ?";
        connection.query(sql, name, callback)
        connection.release();
      }
    });
  }

  reservaDestino(dato, callback){
    this.pool.getConnection((err, connection) => {
      if (err) {
        console.log("Ha ocurrido un error: ", err.message);
      } else {
        console.log("Conectado a la BD ");
        const sql =
          "Insert Into reservas (destino_id, nombre_cliente, correo_cliente, fecha_reserva) VALUES (?,?,?,?) ";
        connection.query(sql, dato, callback)
        connection.release();
      }
    });
  }

  terminarConexion(callback) {
    this.pool.end(callback);
  }
}

module.exports = DAO;