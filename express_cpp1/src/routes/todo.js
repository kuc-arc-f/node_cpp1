import express from 'express';
import LibConfig from "../lib/LibConfig.js";
import koffi from "koffi"

const router = express.Router();

router.post('/create', async function(req, res) {
  const retObj = {ret: 500, data: null};
  try {
    const lib = koffi.load(LibConfig.LIB_PATH);
    const todoAdd = lib.func('char* todo_add(const char* input)');    
    const body = req.body
    console.log(body);
    todoAdd(body.title);
    return res.json(body);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/list', async function(req, res) {
  const retObj = {ret: 500, data: null};
  try {
    const lib = koffi.load(LibConfig.LIB_PATH);
    const todo_list = lib.func('char* todo_list()');    
    const body = req.body
    //console.log(body);
    const items = todo_list();
    return res.json(items);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


export default router;
