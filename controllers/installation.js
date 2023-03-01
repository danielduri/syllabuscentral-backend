import {getSchoolNameFromID} from "../functions/dataGetters.js";
import {getDepartmentNameFromID, getUserNameFromID} from "../functions/nameGetters.js";

export async function installation(req, res, db, bcrypt) {

    const school1 = await getSchoolNameFromID(1, db)
    let school1ID
    if (school1 === undefined) {
        await db("schools").insert({
            schoolName: "Administración Central"
        }).returning("schoolID").then((schoolID) => {
            school1ID = schoolID
            console.log("Created school 1")
        }).catch((error) => {
            console.log(error)
            res.send(error)
        })
    }

    console.log("school1ID", school1ID)

    const dept1 = await getDepartmentNameFromID(1, db)
    let dept1ID
    if (dept1 === undefined) {
        await db("departments").insert({
            departmentName: "Departamento Administración",
            departmentShorthand: "ADM",
            departmentSchoolID: school1ID
        }).returning("departmentID").then((departmentID) => {
            dept1ID = departmentID
            console.log("Created department 1")
        }).catch((error) => {
            console.log(error)
            res.send(error)
        })
    }

    console.log("dept1ID", dept1ID)

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
        }).returning("userID").then((userID) => {
            user1ID = userID
            console.log("Created user 1")
        }).catch((error) => {
            console.log(error)
            res.send(error)
        })
    }

    console.log("user1ID", user1ID)

    res.send("Installation complete")

}