// src/lib/server/db.js
import pkg from 'pg';
// get env variables
import dotenv from 'dotenv';

// get username and password
dotenv.config();

let user = process.env.DB_USER;
let password = process.env.DB_PASS;
console.log(user, password);

const {Pool} = pkg;

const pool = new Pool({
    user: user,
    password: password,
    host: "localhost",
    port: 5432,
    database: "fieldflow",
});

