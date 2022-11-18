import express from "express";
import bcrypt from "bcryptjs";
import knex from "knex";
import handleSignIn from "./controllers/Login.js";
import cors from "cors";
import userInfo from "./controllers/userInfo.js";
import {changeEmail, changeName, changePassword, createUser} from "./controllers/userActions.js";

const app = express();

app.use("/img", express.static('img'))

const db = knex({
    client: 'pg',
    connection: {
        host : 'localhost',
        port : 6000,
        user : '',
        password : '',
        database : 'postgres'
    }
});

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    console.log("DEBUG ONLY");
    db.select('*').from('users').then(response => res.json(response));
});

app.get('/', (req, res) => {res.send('Server is up')});
app.post('/createUser', (req, res) => createUser(req, res, db, bcrypt))
app.post('/signIn', (req, res) => {handleSignIn(req, res, db, bcrypt)});
app.post('/userInfo', (req, res) => {userInfo(req, res, db)});
app.put('/changeEmail', (req, res) => changeEmail(req, res, db, bcrypt));
app.put('/changeName', (req, res) => changeName(req, res, db, bcrypt));
app.put('/changePassword', (req, res) => changePassword(req, res, db, bcrypt));


app.listen(process.env.PORT || 3001, () => {
    console.log(`application is running on port ${process.env.PORT}`)
});