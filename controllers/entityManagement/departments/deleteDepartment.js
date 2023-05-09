import {verifyUserInfo} from "../../../functions/verifyUser.js";
import {
    getSchoolIDFromDepartmentID
} from "../../../functions/idGetters.js";
import {getDepartmentHeadcount} from "../../../functions/countGetters.js";

export function deleteDepartment(req, res, db){
    const {departmentID} = req.body;
    const {userID} = req.user;

    if(!userID || !departmentID){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        if (user.userType >= 1
            && await getSchoolIDFromDepartmentID(departmentID, db)===user.schoolID
            && await getDepartmentHeadcount(departmentID, db)==="0") {
            db("departments").where({"departmentID": departmentID}).returning("departmentID").del().then(id => {
                console.log("Deleted ", id[0])
                res.json("OK")
            }).catch(e => {
                console.log(e)
                res.status(400).json("Database error")
            })
        }else {
            res.status(500).json("Forbidden action")
        }
    })
}