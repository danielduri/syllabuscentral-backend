import {verifyUserInfo} from "../../../functions/verifyUser.js";
import {getSchoolIDFromSubjectID} from "../../../functions/idGetters.js";

export function deleteSubject(req, res, db){
    const {subjectID} = req.body;
    const {userID} = req.user;

    if(!userID || !subjectID){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        if (user.userType >= 1
            && await getSchoolIDFromSubjectID(subjectID, db)===user.schoolID) {
            db("subjects").where({"subjectID": subjectID}).returning("subjectID").del().then(id => {
                console.log("Deleted ", id[0])
                res.json("OK")
            })
        }else {
            res.status(500).json("Forbidden action")
        }
    })
}