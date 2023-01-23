import {verifyUserInfo, verifyUserPermissionForNewCourse} from "../../functions/verifyUser.js";
import {uploadModel} from "./uploadModel.js";
import {getCourseNameFromID} from "../../functions/nameGetters.js";

export async function newModel(req, res, db) {
    const {model} = req.body;
    const {userID} = req.user;

    if (!userID || !model) {
        res.status(400).json('incorrect form submission');
        return;
    }



    verifyUserInfo(userID, db).then(async user => {
        await getCourseNameFromID(model.code, user.schoolID, db).then(async data => {
            if (data) {
                console.log(data)
                res.json(`code already in use for course ${data.name}`)
            } else {
                if (user.userType >= 0) {
                    if (await verifyUserPermissionForNewCourse(user, model.department, db)) {
                        model.action = "create"
                        await uploadModel(model, db, res, user).then(resp => {
                            console.log("New model", model)
                        })
                    } else {
                        res.status(500).json("Forbidden action")
                    }
                }
            }
        })

    })
}