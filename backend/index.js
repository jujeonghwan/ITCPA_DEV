const Joi = require('joi');
const bodyparser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const express = require('express');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyparser.json());

// database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

// check database connection
db.connect(err => {
  if (err) { console.log('dberr'); }
  console.log('database connected...');
});

////////////////////////////////////////////////////////////////////////////////
// root
app.get('/', (req, res) => {
  res.send('ITCPA API!!!');
});

////////////////////////////////////////////////////////////////////////////////
// sammple code for crud
// get all data
app.get('/user', (req,res) => {
  let qr = 'SELECT * FROM user';

  db.query(qr, (err, result) => {
      if (err) {
          console.log(err, 'errs');
      }

      if (result.length >= 0) {
          res.send({
              message: 'all user data',
              data: result
          });
      }
  });
});

// get single data
app.get('/user/:id', (req,res) => {
  
  let gID = req.params.id;

  let qr = `SELECT * FROM user WHERE id = ${gID}`;

  db.query(qr, (err, result) => {
      if (err) { console.log(err); }

      if (result.length > 0) {
          res.send({
              message: 'get single data',
              data: result
          });
      }
      else {
          res.send({
              message: 'data not found'
          });
      }
  });
});

// create data
app.post('/user', (req, res) => {

  // console.log('postdata');
  console.log(req.body, 'createdata');

  ////////////////////////////////////////
  // Validation with joi // require('joi');
  const schema = {
    fullName: Joi.string().min(3).required()
  }
  const result = Joi.ValidationError(req.body, schema);
  
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  // Validation with joi
  ////////////////////////////////////////


  let fullName = req.body.fullname;
  let eMail = req.body.email;
  let mb = req.body.mobile;

  let qr = `INSERT INTO user (fullname, email, mobile)
              VALUES ('${fullName}', '${eMail}', '${mb}')`;

  db.query(qr, (err, result) => {
      if (err) { console.log(err); }
      console.log(result, 'result');

      res.send({
          message: 'data inserted'
      });
  });
});

// update single data
app.put('/user/:id',(req, res)=>{

  console.log(req.body,'updatedata');

  let gID = req.params.id;
  let fullName = req.body.fullname;
  let eMail = req.body.email;
  let mb = req.body.mobile;

  let qr = `update user set fullname = '${fullName}', email='${eMail}', mobile='${mb}' where id = ${gID}`;

  db.query(qr,(err,result)=>{
      if(err){console.log(err);}
      console.log(result, 'result');

      res.send({
          message:'data updated'
      });
  })
})

// delete single data
app.delete('/user/:id',(req,res)=>{
  let qID = req.params.id;
  let qr = `delete from user where id='${qID}'`;
  db.query(qr, (err,result)=>{
      if(err){console.log(err);}
      res.send({
          message:'data deleted'
      })
  });
});

// PORT
const port =  process.env.EXPRESS_PORT || 3000;
app.listen(port, () => {
  console.log(`server running on port ${port}...`);
});