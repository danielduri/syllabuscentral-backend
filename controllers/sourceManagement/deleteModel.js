import {verifyUserTypeAndSchool} from "../../functions/verifyUserTypeAndSchool.js";
import {getCoordinatorIDFromCourseID} from "../../functions/idGetters.js";
import {uploadModel} from "./uploadModel.js";
import {checkModuleCount, checkSubjectCount} from "../../functions/checkCounts.js";

export function deleteModel(req, res, db){
    const {model} = req.body;
    const {userID} = req.user;

    if(!userID || !model){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserTypeAndSchool(userID, db).then(async user => {
        if (user.userType >= 0) {
            let cont = false;
            if (user.userType === 0) {
                await getCoordinatorIDFromCourseID(model.courseID).then(response => {
                        if (user.userID === response){
                            cont=true;
                        }
                })
            }else{
                cont=true;
            }

            if(cont){
                db("courses").where({"courseID": model, "schoolID": user.schoolID}).del().returning(["subjectID", "moduleID"]).then((resp) => {
                    checkSubjectCount(resp[0].subjectID, db)
                    checkModuleCount(resp[0].moduleID, db)
                    res.json("OK")
                })
            }
        }
    })
}