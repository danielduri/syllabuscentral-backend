import {verifyUserInfo} from "../../../functions/verifyUser.js";
import {getDegreeIDFromRawName, getSchoolIDFromUserID} from "../../../functions/idGetters.js";
import {rawify} from "../../../functions/misc.js";
import {getUserTypeFromUserID} from "../../../functions/dataGetters.js";
import {validateName} from "../../userActions/changeName.js";

export async function newDegree(req, res, db) {
    const {name, duration, coordinator} = req.body;
    const {userID} = req.user;

    if (!userID || !name || !duration || !coordinator) {
        res.status(400).json('incorrect form submission');
        return;
    }

    if(!validateName(name)){
        res.status(400).json('bad name');
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        if(user.userType>=1){
            const rawName=rawify(name)
            if(await getDegreeIDFromRawName(rawName, user.schoolID, db)===undefined &&
                await getUserTypeFromUserID(coordinator, db)>=1 &&
                await getSchoolIDFromUserID(coordinator, db)===user.schoolID){
                db.insert({
                    degreeDisplayName: name,
                    degreeRawName: rawName,
                    degreeDuration: duration,
                    coordinatorID: coordinator,
                    schoolID: user.schoolID
                }).into("degrees")
                    .returning("degreeID")
                    .then(resp => {
                        res.json(resp[0].degreeID);
                    })
                    .catch(error => {
                        console.log(error)
                        res.status(400).json("Database error");
                    })
            }else{
                res.json("used")
            }
        }
    })
}