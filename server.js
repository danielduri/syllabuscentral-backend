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
import {getDegrees} from "./controllers/entityManagement/degrees/getDegrees.js";
import {getDegreeCoordinators} from "./controllers/entityManagement/degrees/getDegreeCoordinators.js";
import {newDegree} from "./controllers/entityManagement/degrees/newDegree.js";
import {deleteDegree} from "./controllers/entityManagement/degrees/deleteDegree.js";
import {editDegree} from "./controllers/entityManagement/degrees/editDegree.js";
import {getDepartments} from "./controllers/entityManagement/departments/getDepartments.js";
import {deleteDepartment} from "./controllers/entityManagement/departments/deleteDepartment.js";
import {newDepartment} from "./controllers/entityManagement/departments/newDepartment.js";
import {editDepartment} from "./controllers/entityManagement/departments/editDepartment.js";
import {getDegreeNames} from "./controllers/entityManagement/getDegreeNames.js";
import {getModules} from "./controllers/entityManagement/modules/getModules.js";
import {editModule} from "./controllers/entityManagement/modules/editModule.js";
import {newModule} from "./controllers/entityManagement/modules/newModule.js";
import {deleteModule} from "./controllers/entityManagement/modules/deleteModule.js";
import {getSubjects} from "./controllers/entityManagement/subjects/getSubjects.js";
import {editSubject} from "./controllers/entityManagement/subjects/editSubject.js";
import {newSubject} from "./controllers/entityManagement/subjects/newSubject.js";
import {deleteSubject} from "./controllers/entityManagement/subjects/deleteSubject.js";
import {getSchools} from "./controllers/entityManagement/schools/getSchools.js";
import {editSchool} from "./controllers/entityManagement/schools/editSchool.js";
import {deleteSchool} from "./controllers/entityManagement/schools/deleteSchool.js";
import {newSchool} from "./controllers/entityManagement/schools/newSchool.js";
import {switchSchool} from "./controllers/entityManagement/schools/switchSchool.js";
import {getDepartmentNames} from "./controllers/identityManagement/getDepartmentNames.js";
import {getUsers} from "./controllers/identityManagement/getUsers.js";
import {newUser} from "./controllers/identityManagement/newUser.js";
import {deleteUser} from "./controllers/identityManagement/deleteUser.js";
import {editUser} from "./controllers/identityManagement/editUser.js";
import {promoteUser} from "./controllers/identityManagement/promoteUser.js";

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
app.get('/getDegreeCoordinators', verifyToken, (req, res) => {getDegreeCoordinators(req, res, db)});
app.get('/getDegrees', verifyToken, (req, res) => getDegrees(req, res, db));
app.get('/getDepartments', verifyToken, (req, res) => getDepartments(req, res, db));
app.get('/getDegreeNames', verifyToken, (req, res) => {getDegreeNames(req, res, db)});
app.get('/getModules', verifyToken, (req, res) => {getModules(req, res, db)});
app.get('/getSubjects', verifyToken, (req, res) => {getSubjects(req, res, db)});
app.get('/getSchools', verifyToken, (req, res) => {getSchools(req, res, db)});
app.get('/getDepartmentNames', verifyToken, (req, res) => {getDepartmentNames(req, res, db)});
app.get('/getUsers', verifyToken, (req, res) => {getUsers(req, res, db)});

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

app.put('/newDegree', verifyToken, (req, res) => newDegree(req, res, db));
app.put('/deleteDegree', verifyToken, (req, res) => deleteDegree(req, res, db));
app.put('/editDegree', verifyToken, (req, res) => editDegree(req, res, db));

app.put('/newDepartment', verifyToken, (req, res) => newDepartment(req, res, db));
app.put('/deleteDepartment', verifyToken, (req, res) => deleteDepartment(req, res, db));
app.put('/editDepartment', verifyToken, (req, res) => editDepartment(req, res, db));

app.put('/editModule', verifyToken, (req, res) => editModule(req, res, db));
app.put('/newModule', verifyToken, (req, res) => newModule(req, res, db));
app.put('/deleteModule', verifyToken, (req, res) => deleteModule(req, res, db));

app.put('/editSubject', verifyToken, (req, res) => editSubject(req, res, db));
app.put('/newSubject', verifyToken, (req, res) => newSubject(req, res, db));
app.put('/deleteSubject', verifyToken, (req, res) => deleteSubject(req, res, db));

app.put('/editSchool', verifyToken, (req, res) => editSchool(req, res, db));
app.put('/newSchool', verifyToken, (req, res) => newSchool(req, res, db));
app.put('/deleteSchool', verifyToken, (req, res) => deleteSchool(req, res, db));
app.put('/switchSchool', verifyToken, (req, res) => switchSchool(req, res, db));

app.put('/editUser', verifyToken, (req, res) => editUser(req, res, db, bcrypt));
app.put('/newUser', verifyToken, (req, res) => newUser(req, res, db, bcrypt));
app.put('/deleteUser', verifyToken, (req, res) => deleteUser(req, res, db));
app.put('/promoteUser', verifyToken, (req, res) => promoteUser(req, res, db));

/*
app.post('/uploadDoc', upload.single('file'), function (req, res) {
    res.json("OK")
})
 */
app.post('/uploadDoc', verifyToken, upload.single('file'), (req, res) => uploadDoc(res, filename, fileLocation))



app.listen(process.env.PORT || 3001, () => {
    console.log(`application is running on port ${process.env.PORT ? process.env.PORT : '3001'}`)
});