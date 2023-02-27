import {verifyUserInfo} from "../../../functions/verifyUser.js";
import {getSchoolIDFromDegreeID} from "../../../functions/idGetters.js";

export function deleteDegree(req, res, db){
    const {degreeID} = req.body;
    const {userID} = req.user;

    if(!userID || !degreeID){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        if (user.userType >= 1 && await getSchoolIDFromDegreeID(degreeID, db)) {
            db("degrees").where({"degreeID": degreeID}).returning("degreeID").del().then(id => {
                console.log("Deleted ", id[0])
                res.json("OK")
            })
        }else {
            res.status(500).json("Forbidden action")
        }
    })
}