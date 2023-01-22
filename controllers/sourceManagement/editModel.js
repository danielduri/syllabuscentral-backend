import {verifyUserInfo, verifyUserPermissionForCourse} from "../../functions/verifyUser.js";
import {uploadModel} from "./uploadModel.js";

export function editModel(req, res, db){
    const {model} = req.body;
    const {userID} = req.user;

    if(!userID || !model){
        res.status(400).json('incorrect form submission');
        return;
    }


    verifyUserInfo(userID, db).then(async user => {
        if (user.userType >= 0) {
            if(await verifyUserPermissionForCourse(user, model.code, db)){
                model.action="update"
                await uploadModel(model, db, res, user).then(resp => {
                    console.log("Edited model", model)
                })
            }else {
                res.status(500).json("Forbidden action")
            }
        }
    })
}