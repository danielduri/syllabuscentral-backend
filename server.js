import express from "express";
import bcrypt from "bcryptjs";
import knex from "knex";
//import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
//dotenv.config()
import cors from "cors";
import multer from "multer"
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
import {uploadDoc} from "./controllers/sourceManagement/uploadDoc.js";
import {newModel} from "./controllers/sourceManagement/newModel.js";

const app = express();

app.use("/img", express.static('img'))

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
    }
});

let filename = ""
const fileLocation = "pdfs"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, fileLocation)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        filename=file.originalname.substring(0, file.originalname.length-4) + '-' + uniqueSuffix + file.originalname.substring(file.originalname.length-4)
        cb(null, filename)
    }
})

const upload = multer({ storage: storage })

app.use(cors())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cors());



app.get('/', (req, res) => {res.send('Server is up')});
app.get('/userInfo', verifyToken, (req, res) => {userInfo(req, res, db)});
app.get('/getModel', verifyToken, (req, res) => {getModel(req, res, db)});
app.post('/createUser', (req, res) => createUser(req, res, db, bcrypt))
app.post('/signIn', (req, res) => handleSignIn(req, res, db, bcrypt));
app.put('/changeEmail', verifyToken, (req, res) => changeEmail(req, res, db));
app.put('/changeName', verifyToken, (req, res) => changeName(req, res, db));
app.put('/changePassword', verifyToken, (req, res) => changePassword(req, res, db, bcrypt));
app.put('/modelViewer', verifyToken, (req, res) => modelViewer(req, res, db));
app.put('/getModels', verifyToken, (req, res) => getModels(req, res, db));
app.put('/newModel', verifyToken, (req, res) => newModel(req, res, db));
app.put('/editModel', verifyToken, (req, res) => editModel(req, res, db));
app.put('/deleteModel', verifyToken, (req, res) => deleteModel(req, res, db));
/*
app.post('/uploadDoc', upload.single('file'), function (req, res) {
    res.json("OK")
})
 */
app.post('/uploadDoc', verifyToken, upload.single('file'), (req, res) => uploadDoc(res, filename, fileLocation))



app.listen(process.env.PORT || 3001, () => {
    console.log(`application is running on port ${process.env.PORT ? process.env.PORT : '3001'}`)
});