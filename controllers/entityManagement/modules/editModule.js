import {verifyUserInfo} from "../../../functions/verifyUser.js";
import {getModuleIDFromName, getSchoolIDFromModuleID,} from "../../../functions/idGetters.js";

export async function editModule(req, res, db) {
    const {moduleID, degreeID, newName} = req.body;
    const {userID} = req.user;

    if (!userID || !newName || !moduleID || !degreeID) {
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        if(user.userType>=1 && await getSchoolIDFromModuleID(moduleID, db)===user.schoolID){
            if(await getModuleIDFromName(newName, degreeID, db)===undefined){
                db("modules").update({
                    moduleName: newName
                }).where("moduleID", "=", moduleID).then(
                    () => {res.json("OK")},
                    (error) => {
                        console.log(error)
                        res.json("Database error")
                    }
                )
            }else{
                res.status(500).json("used name")
            }

        }else{
            res.status(500).json("forbidden action")
        }
    })
}