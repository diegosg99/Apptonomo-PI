const express = require("express");
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mysql = require('mysql');
const moment = require('moment');

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
      let sql = 'INSERT INTO users VALUES ("'+user.uuid+'","'+user.nick+'","'+user.name+'","'+user.email+'","'+user.password+'","'+user.phone+'","'+user.address+'",POINT('+user.lat+','+user.lon+'),'+user.lat+',"'+user.lon+'","'+user.bornDate+'","'+user.photo+'",'+user.rating+');';
      mysqlQuery(sql);
      res.status(200).send({msg:"Usuario subido con éxito."});
    }catch(error){
      res.status(400).send({msg:"Error"});
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
    let sql = "SELECT U.name as userName, CONVERT (U.photo USING utf8) as userPhoto, U.rating as userRating, J.*, ST_AsText(J.locationPoint) as coordinates, ST_Distance_Sphere(J.locationPoint, POINT("+data.lat+","+data.lon+")) / 1000 as distance from jobs as J INNER JOIN users as U ON J.idUser = U.uuid HAVING distance < 3 AND J.idWorker = 'null' ORDER BY distance ASC LIMIT 5;";
      connection.query(sql, function(err, rows, fields) {
        if (err) throw err;  
          return res.json({user:rows});
        });
    }catch(error){
      return res.status(400).send({msg:"Error"});
    }
});
app.post('/works/filtered', (req, res) => {
  try {
    const data = req.body;
    let sql = `SELECT U.name as userName,
    CONVERT (U.photo USING utf8) as userPhoto,
    U.rating as userRating, J.*, ST_AsText(J.locationPoint) as coordinates,
    ST_Distance_Sphere(J.locationPoint,
    POINT(${data.lat},${data.lon})) / 1000 as distance 
    from jobs as J INNER JOIN users as U ON J.idUser = U.uuid 
    HAVING J.idWorker = 'null' AND J.name LIKE '%${data.filter}%' ORDER BY distance ASC LIMIT 5;`;
      connection.query(sql, function(err, rows, fields) {
        if (err) throw err;  
          return res.json({user:rows});
        });
    }catch(error){
      return res.status(400).send({msg:"Error"});
    }
});

app.get('/profile/getUser/:id', (req, res) => {
  try {
    const data = req.params.id;
    let sql = "SELECT U.uuid,U.name,U.phone,U.address,U.rating,U.email,CONVERT(U.photo USING utf8) as photo from users as U WHERE U.uuid = '"+data+"';";
    connection.query(sql, function(err, rows, fields) {
        if (err) throw err;
        res.status(200).send(rows[0]);
        });
    }catch(error){
      return res.status(400).send({msg:"Error"});
    }
});

app.post('/profile/rate/user', (req, res) => {
  try {
    const data = req.body;
    let date = moment();
    let sql = `INSERT INTO ratings VALUES ('${data.idRating}','${data.idJob}','${data.starring}','${data.idUser}','${data.idRated}','${data.comment}','${date}'); `;
    connection.query(sql, function(err, rows, fields) {
        if (err) throw err;
        res.status(200).send({msg:'Usuario valorado'});
        });
    }catch(error){
      return res.status(400).send({msg:"Error"});
    }
});

app.get('/profile/rates/getAll/:id',(req,res)=>{
  try{
    let id = req.params.id;
    let sql = `SELECT * FROM ratings WHERE idRated = '${id}';`;
    connection.query(sql, function(err, rows, fields) {
        if (err) throw err;
        res.status(200).send({rows});
        });
  }catch(error){
    res.status(400).send({msg:"Error"});
  }
});

app.get('/profile/rates/getProfileRates/:id',(req,res)=>{
  try{
    let id = req.params.id;
    let sql = `SELECT R.*,U.uuid,U.name FROM ratings AS R INNER JOIN users as U ON R.idRated = U.uuid WHERE U.uuid = '${id}';`;
    connection.query(sql, function(err, rows, fields) {
        if (err) throw err;
        res.status(200).send({rows});
        });
  }catch(error){
    res.status(400).send({msg:"Error"});
  }
});

app.post('/profile/rate/refresh', (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    let sql = `UPDATE users SET rating = ${data.starring} WHERE uuid = '${data.id}';`;
    connection.query(sql, function(err, rows, fields) {
        if (err) throw err;
        res.status(200).send({msg:'Usuario valorado'});
        });
    }catch(error){
      return res.status(400).send({msg:"Error"});
    }
});

app.get('/users/getImage/:id', (req, res) => {
  try {
    const data = req.params.id;
    let sql = "SELECT CONVERT(U.photo USING utf8) as photo from users as U WHERE U.uuid = '"+data+"';";
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

app.get('/works/getImage/:id', (req, res) => {
  try {
    const data = req.params.id;
    let sql = "SELECT CONVERT(J.photo USING utf8) as photo from jobs as J WHERE idWork = '"+data+"';";
    connection.query(sql, function(err, rows, fields) {
        if (err) throw err; 
        if (rows[0].photo != null){
          const im = rows[0].photo.split(",")[1];
          const image = Buffer.from(im,'base64');
          res.setHeader('Content-Type','image/png');
          res.setHeader('Content-Lenght',image.length)
          res.status(200).send(image);
        }
        });
    }catch(error){
      return res.status(400).send({msg:"Error"});
    }
});

app.get('/works/getWork/:id', (req, res) => {
  try {
    const data = req.params.id;
    let sql = `SELECT U.name as userName,U.phone as phone,
    CONVERT (U.photo USING utf8) as userPhoto,
    U.rating as userRating, J.*, ST_AsText(J.locationPoint) as coordinates
    from jobs as J INNER JOIN users as U ON J.idUser = U.uuid
    WHERE J.idWork = '${data}';`;

    connection.query(sql, function(err, rows, fields) {
        if (err) throw err; 
          res.status(200).send(rows[0]);
        });
    }catch(error){
      return res.status(400).send({msg:"Error"});
    }
});

app.post('/profile/work/cancel', (req, res) => {
  try {
    const data = req.body;
    let sql = "DELETE FROM jobs WHERE idWork = '"+data.id+"';";
    connection.query(sql, function(err, rows, fields) {
        if (err) throw err;  
        return res.status(200).send({msg:"Trabajado cancelado."});
        });
    }catch(error){
      return res.status(400).send({msg:"Error"});
    }
});

app.post('/profile/work/quitWorker', (req, res) => {
  try {
    const data = req.body;
    let sql = "UPDATE jobs SET idWorker = 'null' WHERE idWork = '"+data.id+"';";
    connection.query(sql, function(err, rows, fields) {
        if (err) throw err;  
        return res.status(200).send({msg:"Te has quitado de la tarea."});
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

app.post('/profile/user/photo',(req,res)=>{
  try{
    const data = req.body;
    let sql = "UPDATE users SET photo = '"+data.photo+"' WHERE uuid = '"+data.id+"';";
    connection.query(sql, function(err, rows, fields) {
        if (err) throw err;  
        res.status(200).send({msg:"Foto cambiada."});
        });
  }catch(error){
    res.status(400).send({msg:"Error"});
  }
})

app.post('/profile/user/info', (req, res) => {
  try {
    const data = req.body;
      let sql = 'SELECT uuid,name,address,rating from users WHERE email = "'+data.email+'";';
      connection.query(sql, function(err, rows, fields) {
        if (err) throw err;  
        res.json(rows[0]);
      });     
      res.status(200);
      }catch(error){
      return res.status(400).send({msg:"Error"});
    }
});

app.post('/profile/user/waiting', (req, res) => {
  try {
    const data = req.body;
    let sql = 'SELECT idWork,idUser,idWorker,name, price from jobs WHERE idUser= "'+data.id+'";';
    connection.query(sql, function(err, rows, fields) {
      if (err) throw err;  
      res.json(rows);
      });  
      res.status(200);
      }catch(error){
      return res.status(400).send({msg:"Error"});
    }
});

app.post('/profile/user/accepted', (req, res) => {
  try {
    const data = req.body;
    let sql = 'SELECT idWork,idUser,idWorker,name, price from jobs WHERE idWorker= "'+data.id+'";';
    connection.query(sql, (err, rows, fields) => {
      res.json(rows);
    });     
      res.status(200);
      }catch(error){
      return res.status(400).send({msg:"Error"});
    }
});

app.post('/create/job', (req, res) => {
  try {
    const data = req.body;
      let sql = "INSERT INTO jobs (idWork, idUser, idWorker, name, location,locationPoint,lat,lon, labels,description,price,photo) VALUES ('"+data.idWork+"', '"+data.idUser+"', '"+data.idWorker+"', '"+data.name+"', '"+data.location+"', POINT ("+data.lat+","+data.lon+"), "+data.lat+", "+data.lon+", '"+data.labels+"','"+data.description+"',"+data.price+",'"+data.photo+"');";
      mysqlQuery(sql);
      res.status(200).send("Tranajo subido");
    }catch(error){
      res.status(400).send({msg:"Error"});
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