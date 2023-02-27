import {verifyUserInfo} from "../../../functions/verifyUser.js";
import {getSchoolIDFromSubjectID, getSubjectIDFromName} from "../../../functions/idGetters.js";

export async function editSubject(req, res, db) {
    const {subjectID, degreeID, newName} = req.body;
    const {userID} = req.user;

    if (!userID || !newName || !subjectID || !degreeID) {
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        if(user.userType>=1 && await getSchoolIDFromSubjectID(subjectID, db)===user.schoolID){
            if(await getSubjectIDFromName(newName, degreeID, db)===undefined){
                db("subjects").update({
                    subjectName: newName
                }).where("subjectID", "=", subjectID).then(
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