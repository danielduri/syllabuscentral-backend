import {verifyUserInfo, verifyUserPermissionForCourse} from "../../functions/verifyUser.js";
import {checkModuleCount, checkSubjectCount} from "../../functions/ModuleSubjectActions.js";

export function deleteModel(req, res, db){
    const {model} = req.body;
    const {userID} = req.user;

    if(!userID || !model){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        if (user.userType >= 0) {

            if(await verifyUserPermissionForCourse(user, model, db)){
                db("courses").where({"courseid": model, "schoolID": user.schoolID}).del().returning(["subjectID", "moduleID"]).then((resp) => {
                    checkSubjectCount(resp[0].subjectID, db)
                    checkModuleCount(resp[0].moduleID, db)
                    console.log("Deleted model ", model)
                    res.json("OK")
                })
            }else {
                res.status(500).json("Forbidden action")
            }
        }
    })
}