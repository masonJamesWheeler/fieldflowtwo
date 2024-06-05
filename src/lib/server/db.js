// src/lib/server/db.js
import pkg from 'pg';

const {Pool} = pkg;

const pool = new Pool({
    user: "masewheeler",
    password: "Brewen12!!",
    host: "localhost",
    port: 5432,
    database: "fieldflow",
});

