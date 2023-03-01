import {getSchoolNameFromID} from "../functions/dataGetters.js";
import {getDepartmentNameFromID, getUserNameFromID} from "../functions/nameGetters.js";

export async function installation(req, res, db, bcrypt) {

    const school1 = await getSchoolNameFromID(1, db)
    if (school1 === undefined) {
        await db("schools").insert({
            schoolID: 1,
            schoolName: "Administración Central"
        }).then(() => {
            console.log("Created school 1")
        })
    }

    const dept1 = await getDepartmentNameFromID(1, db)
    if (dept1 === undefined) {
        await db("departments").insert({
            departmentID: 1,
            departmentName: "Departamento Administración",
            departmentShorthand: "ADM",
            departmentSchoolID: 1
        }).then(() => {
            console.log("Created department 1")
        })
    }

    const user1 = await getUserNameFromID(1, db)
    if (user1 === undefined) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash("pass", salt);
        await db("users").insert({
            userID: 1,
            email: "super@syllabus.com",
            userName: "admin",
            passwordHash: hash,
            userType: 2,
            schoolID: 1,
            departmentID: 1
        }).then(() => {
            console.log("Created user 1")
        })
    }

    res.send("Installation complete")

}