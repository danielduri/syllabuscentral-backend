import express from "express";
import bcrypt from "bcryptjs";
import knex from "knex";
//import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
//dotenv.config()
import handleSignIn from "./controllers/signIn.js";
import cors from "cors";
import {changeEmail, changeName, changePassword, createUser} from "./controllers/userActions.js";
import {verifyToken} from "./controllers/commonFunctions.js";
import userInfo from "./controllers/userInfo.js";

const app = express();

app.use("/img", express.static('img'))

const db = knex({
    client: 'pg',
    connection: {
        host : process.env.host,
        port : process.env.dbPort,
        user : process.env.user,
        password : process.env.password,
        database : process.env.database
    }
});

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {res.send('Server is up')});
app.get('/userInfo', verifyToken, (req, res) => {userInfo(req, res, db)});
app.post('/createUser', (req, res) => createUser(req, res, db, bcrypt))
app.post('/signIn', (req, res) => handleSignIn(req, res, db, bcrypt));
app.put('/changeEmail', verifyToken, (req, res) => changeEmail(req, res, db));
app.put('/changeName', verifyToken, (req, res) => changeName(req, res, db));
app.put('/changePassword', verifyToken, (req, res) => changePassword(req, res, db, bcrypt));


app.listen(process.env.PORT || 3001, () => {
    console.log(`application is running on port ${process.env.PORT}`)
});