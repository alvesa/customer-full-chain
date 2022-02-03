import express from "express";
import bodyParser from 'body-parser';
const PORT = 3000;

const api = express();
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));

api.listen(PORT);

export default api;