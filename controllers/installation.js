import {getSchoolNameFromID} from "../functions/dataGetters.js";
import {getDepartmentNameFromID, getUserNameFromID} from "../functions/nameGetters.js";

export async function installation(req, res, db, bcrypt) {
    db.transaction(async function (trx) {

        let promises = [];

        const school0 = await getSchoolNameFromID(0, db)
        if (school0 === undefined) {
            promises.push(
                trx("schools").insert({
                    schoolID: 0,
                    schoolName: "Administración Central"
                }).then(() => {
                    console.log("Created school 0")
                })
            )
        }

        const dept0 = await getDepartmentNameFromID(0, db)
        if (dept0 === undefined) {
            promises.push(
                trx("departments").insert({
                    departmentID: 0,
                    departmentName: "Departamento Administración",
                    departmentShorthand: "ADM",
                    departmentSchoolID: 0
                }).then(() => {
                    console.log("Created department 0")
                })
            )
        }

        if (getUserNameFromID(0, db) === undefined) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash("pass", salt);
            promises.push(
                trx("users").insert({
                    userID: 0,
                    email: "super@syllabus.com",
                    userName: "admin",
                    userPassword: hash,
                    userType: 2,
                    schoolID: 0,
                    departmentID: 0
                }).then(() => {
                    console.log("Created user 0")
                })
            )
        }

        return Promise.all(promises).then(trx.commit).catch(trx.rollback);
    }).then(() => {
        res.json("Installation successful")
    }).catch(err => {
        res.status(400).json("Installation failed")
    })

}