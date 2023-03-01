import {getSchoolNameFromID} from "../functions/dataGetters.js";
import {getDepartmentNameFromID, getUserNameFromID} from "../functions/nameGetters.js";

export async function installation(req, res, db, bcrypt) {

    const school1 = await getSchoolNameFromID(1, db)
    let school1ID
    if (school1 === undefined) {
        await db("schools").insert({
            schoolName: "Administración Central"
        }).returning("schoolID").then((schoolID) => {
            school1ID = schoolID.schoolID
            console.log("Created school 1")
        })
    }

    const dept1 = await getDepartmentNameFromID(1, db)
    let dept1ID
    if (dept1 === undefined) {
        await db("departments").insert({
            departmentName: "Departamento Administración",
            departmentShorthand: "ADM",
            departmentSchoolID: school1ID
        }).returning("departmentID").then(() => {
            dept1ID = departmentID.departmentID
            console.log("Created department 1")
        })
    }

    const user1 = await getUserNameFromID(1, db)
    let user1ID
    if (user1 === undefined) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash("pass", salt);
        await db("users").insert({
            email: "super@syllabus.com",
            userName: "admin",
            passwordHash: hash,
            userType: 2,
            schoolID: school1ID,
            departmentID: dept1ID
        }).returning("userID").then(() => {
            user1ID = userID.userID
            console.log("Created user 1")
        })
    }

    res.send("Installation complete")

}