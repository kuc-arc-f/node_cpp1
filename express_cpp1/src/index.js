
import express from 'express';
import cookieParser from "cookie-parser";

//import LibConfig from './lib/LibConfig';
//import commonRouter from './routes/common';
import todoRouter from './routes/todo.js';

const app = express();
import 'dotenv/config'

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
console.log("env=", process.env.NODE_ENV)
//console.log(process.env);

const errorObj = {ret: "NG", messase: "Error"};

//app.use('/api/common', commonRouter);
app.use('/api/todo', todoRouter);

//Middleware
app.get('/*', function(req, res, next) {
  /*
  const COOKIE_NAME = LibConfig.COOKIE_NAME;
  if (req.path !== "/login") {
    if (!req.cookies[ COOKIE_NAME ]) {
      return res.redirect('/login');
    }
  }
  next();
  */
});

//start
const PORT = 3000;
app.listen({ port: PORT }, () => {
  console.log(`Start-Server: http://localhost:${PORT}`);
});
console.log('start');
