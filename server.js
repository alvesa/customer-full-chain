import express from "express";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const PORT = 3000;

const api = express();
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));

api.listen(PORT);

export default {api,jwt};