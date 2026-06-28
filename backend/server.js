const connectDB = require("./db.js");
const cors = require('cors');
const express = require('express');
require('dotenv').config();
const router = require('./router.js');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use('/', router);

app.listen(process.env.PORT, ()=>{
    console.log(`server is running on port ${process.env.PORT}...`);
});
