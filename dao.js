"use strict";

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
        const sql =
          "Insert Into destinos (nombre, descripcion, imagen, precio) VALUES (?,?,?,?) ";
        connection.query(sql, destino, callback);
        connection.release();
      }
    });
  }

  terminarConexion(callback) {
    this.pool.end(callback);
  }
}

module.exports = DAO;
