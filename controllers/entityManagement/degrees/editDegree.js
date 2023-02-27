import {verifyUserInfo} from "../../../functions/verifyUser.js";
import {getDegreeIDFromRawName, getSchoolIDFromUserID} from "../../../functions/idGetters.js";
import {rawify} from "../../../functions/misc.js";
import {getUserTypeFromUserID} from "../../../functions/dataGetters.js";

export async function editDegree(req, res, db) {
    const {name, degreeID, coordinator} = req.body;
    const {userID} = req.user;

    if (!userID || !degreeID || !coordinator) {
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        if(user.userType>=1){
            let cont=true;
            if(name){
                const rawName=rawify(name)
                if(await getDegreeIDFromRawName(rawName, user.schoolID, db)===undefined){
                    db("degrees").update({
                        degreeDisplayName: name,
                        degreeRawName: rawName,
                    }).where("degreeID", "=", degreeID).catch(error => {
                        cont=false
                        console.log(error)
                        res.status(400).json("Database error");
                    })
                }else{
                    cont=false
                    res.json("used")
                }
            }

            if(await getUserTypeFromUserID(coordinator, db)>=1 && cont &&
                await getSchoolIDFromUserID(coordinator, db)===user.schoolID){
                db("degrees").update({
                    coordinatorID: coordinator
                }).where("degreeID", "=", degreeID)
                    .returning("degreeID").then(resp => {
                    console.log(resp)
                    res.json(resp[0].degreeID);
                }).catch(error => {
                        console.log(error)
                        res.status(400).json("Database error");
                    })
            }
        }else{
            res.status(500).json("forbidden action")
        }
    })
}