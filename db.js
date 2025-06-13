const mysql = require('mysql2');

const fs = require('fs');

const local_db = {
  host: 'localhost',//bmbr-server.mysql.database.azure.com
  port: 3306,
  user: 'dbbd_admin',//atbvbruvth
  password: 'dbbd_admin',//Fj7BCi2u$CcTRRAx
  database: 'buscaminasbr_pruebas',
};

const azure_db = {
  host: 'bmbr-server.mysql.database.azure.com',
  port: 3306,
  user: 'atbvbruvth',
  password: 'Fj7BCi2u$CcTRRAx',
  database: 'buscaminasbr_pruebas', 
  //ssl: {ca: fs.readFileSync("DigiCertGlobalRootCA.crt.pem")}
}

const clever_cloud = {
  host: 'bcmnjyskkyjothonjycj-mysql.services.clever-cloud.com',
  port: 3306,
  user: 'ue40cj8vrpcwdsuo',//atbvbruvth
  password: '7PFH1wD0ppfFtTJd4Ka9',//Fj7BCi2u$CcTRRAx
  database: 'bcmnjyskkyjothonjycj',
}
// Set up the connection to the database
const connection = mysql.createConnection(clever_cloud);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;