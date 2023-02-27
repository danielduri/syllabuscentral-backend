import {getSchoolNameFromID} from "../functions/dataGetters.js";
import {getDepartmentNameFromID, getUserNameFromID} from "../functions/nameGetters.js";

export async function installation(req, res, db, bcrypt) {

    const school0 = await getSchoolNameFromID(0, db)
    if (school0 === undefined) {
        await db("schools").insert({
            schoolID: 0,
            schoolName: "Administración Central"
        }).then(() => {
            console.log("Created school 0")
        })
    }

    const dept0 = await getDepartmentNameFromID(0, db)
    if (dept0 === undefined) {
        await db("departments").insert({
            departmentID: 0,
            departmentName: "Departamento Administración",
            departmentShorthand: "ADM",
            departmentSchoolID: 0
        }).then(() => {
            console.log("Created department 0")
        })
    }

    const user0 = await getUserNameFromID(0, db)
    if (user0 === undefined) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash("pass", salt);
        await db("users").insert({
            userID: 0,
            email: "super@syllabus.com",
            userName: "admin",
            passwordHash: hash,
            userType: 2,
            schoolID: 0,
            departmentID: 0
        }).then(() => {
            console.log("Created user 0")
        })
    }

    res.send("Installation complete")

}