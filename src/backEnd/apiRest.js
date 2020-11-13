const express = require("express");
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mysql      = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'APP'
});

connection.connect();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/login/user', (req, res) => {
  try {
    const data = req.body;
    const payload = {
      sub: data.email,
    }
    const token = jwt.sign(payload,'Bearer');

    let sql = 'SELECT email,password FROM users WHERE email = "'+data.email+'";';
      connection.query(sql, function(err, rows, fields) {
        if (err) throw err;  
          return res.json({user:rows[0],token:token});
        });
    }catch(error){
      return res.status(400);
  }
}); 

app.post('/register/user', (req, res) => {
  try 
  {
    const data = req.body;
      let sql = 'INSERT INTO users VALUES ("'+data.uuid+'","'+data.nick+'","'+data.name+'","'+data.email+'","'+data.password+'","'+data.address+'",POINT('+data.lat+','+data.lon+'),"'+data.lat+'","'+data.lon+'","'+data.bornDate+'",'+data.photo+','+data.rating+');';
      mysqlQuery(sql);
      return res.status(200).send({msg:"Usuario subido con éxito."});
    }catch(error){
      return res.status(400).send({msg:"Error"});
    }
});

app.post('/verify', (req, res) => {
  const token = req.body.token;
  const decoded = jwt.verify(token,'Bearer');
  return res.status(200).send(JSON.stringify(decoded));
});

//_______________________JOBS__________________________

app.post('/user/location', (req, res) => {
    try {
      const data = req.body;
      let sql = 'SELECT name,address,lat,lon FROM users WHERE email = "'+data.email+'";';
      connection.query(sql, function(err, rows, fields) {
      
      if (err) throw err;  
      return res.json({user:rows[0]});
    });
    }catch(error){
      return res.status(400).send({msg:"Error"});
    }
});


app.post('/data/user', (req, res) => {
  try {
    const data = req.body;
      let sql = 'SELECT * FROM users WHERE email = "'+data.email+'";';
      connection.query(sql, function(err, rows, fields) {
        if (err) throw err;  
          res.json({user:rows[0]});
        });
      return res.status(200);
    }catch(error){
      return res.status(400).send({msg:"Error"});
    }
});


app.post('/works/latest', (req, res) => {
  try {
    const data = req.body;
      let sql = "SELECT *,ST_AsText(locationPoint) as Coordinates, (ST_DISTANCE(POINT("+data.lat+","+data.lon+"), locationPoint)*1609.34) as distance from jobs WHERE ST_Distance_Sphere(locationPoint, (POINT("+data.lat+","+data.lon+"))) <= (1000 * 1609.34);";

      connection.query(sql, function(err, rows, fields) {
        if (err) throw err;  
          return res.json({user:rows});
        });
      //return res.status(200);
    }catch(error){
      return res.status(400).send({msg:"Error"});
    }
                      /*
                  select idUser,name, description,price,ST_AsText(locationPoint) as Coordinates,location, 
                  (ST_DISTANCE(POINT("+data.lat+","+data.lon+"), locationPoint)*1609.34) as distance 
                  from jobs
                  WHERE ST_Distance_Sphere(locationPoint, (POINT("+data.lat+","+data.lon+"))) <= (1000 * 1609.34);
                      */
});


app.post('/create/job', (req, res) => {
  try {
    const data = req.body;
      let sql = "INSERT INTO jobs (idWork, idUser, idWorker, name, location,locationPoint,lat,lon, labels,description,price,photo,done) VALUES ('"+data.idWork+"', '"+data.idUser+"', '"+data.idWorker+"', '"+data.name+"', '"+data.location+"', POINT ("+data.lat+","+data.lon+"), "+data.lat+", "+data.lon+", '"+data.labels+"','"+data.description+"',"+data.price+","+data.photo+",0);";
      mysqlQuery(sql);
      return res.status(200);
    }catch(error){
      return res.status(400).send({msg:"Error"});
    }
});

const mysqlQuery = (sql) => {
  data = connection.query(sql, function(err, rows, fields) {
    if (err) throw err;  
  });
}

app.listen(3003, () =>
  console.log(`¡Aplicación de ejemplo escuchando en el puerto 3003!`),
);