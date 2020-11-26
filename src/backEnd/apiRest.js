const express = require("express");
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'APP'
});

connection.connect();

const app = express();

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));

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
    const user = req.body;
      let sql = 'INSERT INTO users VALUES ("'+user.uuid+'","'+user.nick+'","'+user.name+'","'+user.email+'","'+user.password+'","'+user.address+'",POINT('+user.lat+','+user.lon+'),'+user.lat+',"'+user.lon+'","'+user.bornDate+'","'+user.photo+'",'+user.rating+');';
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

app.post('/user/location', (req, res) => {
    try {
      const data = req.body;
      let sql = 'SELECT uuid,name,address,lat,lon FROM users WHERE email = "'+data.email+'";';
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
      let sql = "SELECT U.name as userName,CONVERT (U.photo USING utf8) as userPhoto,U.rating as userRating,J.*,ST_AsText(J.locationPoint) as Coordinates, (ST_DISTANCE(POINT("+data.lat+","+data.lon+"), J.locationPoint)*1609.34) as distance from jobs as J INNER JOIN users as U ON J.idUser = U.uuid WHERE ST_Distance_Sphere(J.locationPoint, (POINT("+data.lat+","+data.lon+"))) <= (1000 * 1609.34) AND J.idWorker = 'null';";
      connection.query(sql, function(err, rows, fields) {
        if (err) throw err;  
          return res.json({user:rows});
        });
    }catch(error){
      return res.status(400).send({msg:"Error"});
    }
});

app.get('/works/getImage/:id', (req, res) => {
  try {
    const data = req.params.id;
    let sql = "SELECT CONVERT(J.photo USING utf8) as photo from jobs as J WHERE idWork = '"+data+"';";
    connection.query(sql, function(err, rows, fields) {
        if (err) throw err;  
        const im = rows[0].photo.split(",")[1];
        const image = Buffer.from(im,'base64');
        res.setHeader('Content-Type','image/png');
        res.setHeader('Content-Lenght',image.length)
        res.status(200).send(image);
        });
    }catch(error){
      return res.status(400).send({msg:"Error"});
    }
});

app.post('/works/setWorker', (req, res) => {
  try {
    const data = req.body;
    let sql = "UPDATE jobs SET idWorker = '"+data.idWorker+"' WHERE idWork = '"+data.idWork+"';";
    connection.query(sql, function(err, rows, fields) {
        if (err) throw err;  
        return res.status(200).send({msg:"Trabajador seleccionado."});
        });
    }catch(error){
      return res.status(400).send({msg:"Error"});
    }
});


app.post('/create/job', (req, res) => {
  try {
    const data = req.body;
      let sql = "INSERT INTO jobs (idWork, idUser, idWorker, name, location,locationPoint,lat,lon, labels,description,price,photo,done) VALUES ('"+data.idWork+"', '"+data.idUser+"', '"+data.idWorker+"', '"+data.name+"', '"+data.location+"', POINT ("+data.lat+","+data.lon+"), "+data.lat+", "+data.lon+", '"+data.labels+"','"+data.description+"',"+data.price+",'"+data.photo+"',0);";
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
  console.log(`¡Aplicación escuchando en el puerto 3003!`),
);