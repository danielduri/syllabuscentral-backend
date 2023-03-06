import {verifyUserInfo} from "../../../functions/verifyUser.js";
import {getSchoolIsAdm} from "../../../functions/dataGetters.js";
import {getSchoolAdmID} from "../../../functions/idGetters.js";
import {admSchool} from "../../installation.js";

export function deleteSchool(req, res, db) {
    const {schoolID} = req.body;
    const {userID} = req.user;

    if (!userID || !schoolID) {
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        if (user.userType >= 2) {
            if(await getSchoolIsAdm(schoolID, db)){
                res.status(500).json("Forbidden action")
            }else{

                const school1ID = await admSchool(db)

                if (school1ID === "error") {
                    res.status(500).json("Database error")
                    return
                }

                console.log("school1ID", school1ID)


                await db("users").update({
                    schoolID: school1ID
                }).where("userType", ">=", 2)
                    .andWhere("schoolID", "=", schoolID).then(() => {
                        db("schools").where({"schoolID": schoolID}).returning("schoolID").del().then(id => {
                            console.log("Deleted ", id[0])
                            res.json("OK")
                        }, (error) => {
                            console.log(error)
                            res.status(500).json("Database error")
                        })
                    }, (error) => {
                        console.log(error)
                        res.status(500).json("Database error")
                    })
            }
        } else {
            res.status(500).json("Forbidden action")
        }
    })
}