import express from "express";
import bcrypt from "bcryptjs";
import knex from "knex";
//import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
//dotenv.config()
import cors from "cors";
import {handleSignIn} from "./controllers/signIn.js";
import {verifyToken} from "./functions/verifyToken.js";
import {userInfo} from "./controllers/userInfo.js";
import {createUser} from "./controllers/userActions/createUser.js";
import {changeEmail} from "./controllers/userActions/changeEmail.js";
import {changeName} from "./controllers/userActions/changeName.js";
import {changePassword} from "./controllers/userActions/changePassword.js";
import {modelViewer} from "./controllers/sourceManagement/modelViewer.js";
import {getModels} from "./controllers/sourceManagement/getModels.js";
import {getModel} from "./controllers/sourceManagement/getModel.js";
import {editModel} from "./controllers/sourceManagement/editModel.js";
import {deleteModel} from "./controllers/sourceManagement/deleteModel.js";

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

app.get('/', (req, res) => {res.send('Server is up')});
app.get('/userInfo', verifyToken, (req, res) => {userInfo(req, res, db)});
app.get('/getModel', verifyToken, (req, res) => {getModel(req, res, db)});
app.post('/createUser', (req, res) => createUser(req, res, db, bcrypt))
app.post('/signIn', (req, res) => handleSignIn(req, res, db, bcrypt));
app.put('/changeEmail', verifyToken, (req, res) => changeEmail(req, res, db));
app.put('/changeName', verifyToken, (req, res) => changeName(req, res, db));
app.put('/changePassword', verifyToken, (req, res) => changePassword(req, res, db, bcrypt));
app.put('/newModel', verifyToken, (req, res) => modelViewer(req, res, db));
app.put('/getModels', verifyToken, (req, res) => getModels(req, res, db));
app.put('/editModel', verifyToken, (req, res) => editModel(req, res, db));
app.put('/deleteModel', verifyToken, (req, res) => deleteModel(req, res, db));



app.listen(process.env.PORT || 3001, () => {
    console.log(`application is running on port ${process.env.PORT}`)
});