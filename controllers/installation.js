import {getSchoolNameFromID} from "../functions/dataGetters.js";
import {getDepartmentNameFromID, getUserNameFromID} from "../functions/nameGetters.js";
import {getSchoolAdmID} from "../functions/idGetters.js";

export async function admSchool(db) {
    const schoolAdmID = await getSchoolAdmID(db)

    if (schoolAdmID === undefined) {
        return await db("schools").insert({
            schoolName: "Administración Central",
            schoolAdm: true
        }).returning("schoolID").then((schoolID) => {
            console.log("Created school ", schoolID[0].schoolID)
            return schoolID[0].schoolID
        }).catch((error) => {
            console.log(error)
            return "error"
        })
    }else{
        return schoolAdmID
    }
}

export async function installation(req, res, db, bcrypt) {

    let school1ID = await admSchool(db)

    if (school1ID === "error") {
        res.send("Database error")
        return
    }

    console.log("school1ID", school1ID)

    let dept1ID
    await db("departments").insert({
        departmentName: "Departamento Administración",
        departmentShorthand: "ADM",
        departmentSchoolID: school1ID
    }).returning("departmentID").then((departmentID) => {
        dept1ID = departmentID[0].departmentID
        console.log("Created department 1")
    }).catch((error) => {
        console.log(error)
        res.send(error)
    })

    if(dept1ID === undefined){
        return
    }

    console.log("dept1ID", dept1ID)

    let user1ID
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
        user1ID = userID[0].userID
        console.log("Created user 1")
    }).catch((error) => {
        console.log(error)
        res.send(error)
    })

    if(user1ID === undefined){
        return
    }

    console.log("user1ID", user1ID)

    res.send("Installation complete. Login using super@syllabus.com, password 'pass'.")

}