import {verifyUserInfo} from "../../../functions/verifyUser.js";
import {getSchoolIDFromDegreeID, getSubjectIDFromName} from "../../../functions/idGetters.js";
import {createSubject} from "../../../functions/ModuleSubjectActions.js";

export async function newSubject(req, res, db) {
    const {name, degree} = req.body;
    const {userID} = req.user;

    if (!userID || !name || !degree || degree==="") {
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        if(user.userType>=1 && await getSchoolIDFromDegreeID(degree, db)===user.schoolID){
            if(await getSubjectIDFromName(name, degree, db)===undefined){
                 createSubject(name, degree, db).then(
                    () => {res.json("OK")},
                    (error) => {
                        console.log(error)
                        res.json("database error")
                    }
                )
            }else{
                res.status(500).json("used name")
            }
        }
    })
}