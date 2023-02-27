import {verifyUserInfo} from "../../../functions/verifyUser.js";
import {getDepartmentIDFromName, getDepartmentIDFromShorthand} from "../../../functions/idGetters.js";

export async function newDepartment(req, res, db) {
    const {name, shorthand} = req.body;
    const {userID} = req.user;

    if (!userID || !name || !shorthand) {
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        if(user.userType>=1){
            if(await getDepartmentIDFromName(name, user.schoolID, db)===undefined &&
                await getDepartmentIDFromShorthand(shorthand, user.schoolID, db)===undefined){
                db.insert({
                    departmentName: name,
                    departmentShorthand: shorthand.toUpperCase(),
                    departmentSchoolID: user.schoolID
                }).into("departments")
                    .returning("departmentID")
                    .then(resp => {
                        res.json(resp[0].departmentID);
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