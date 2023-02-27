import {verifyUserInfo} from "../../../functions/verifyUser.js";
import {getSchoolIDFromModuleID} from "../../../functions/idGetters.js";

export function deleteModule(req, res, db){
    const {moduleID} = req.body;
    const {userID} = req.user;

    if(!userID || !moduleID){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        if (user.userType >= 1
            && await getSchoolIDFromModuleID(moduleID, db)===user.schoolID) {
            db("modules").where({"moduleID": moduleID}).returning("moduleID").del().then(id => {
                console.log("Deleted ", id[0])
                res.json("OK")
            })
        }else {
            res.status(500).json("Forbidden action")
        }
    })
}