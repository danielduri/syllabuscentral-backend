import {verifyUserInfo} from "../../../functions/verifyUser.js";
import {getDepartmentIDFromName, getDepartmentIDFromShorthand} from "../../../functions/idGetters.js";
import {validateName} from "../../userActions/changeName.js";

export async function newDepartment(req, res, db) {
    const {name, shorthand} = req.body;
    const {userID} = req.user;

    if (!userID || !name || !shorthand) {
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        if(user.userType>=1){
            if(!validateName(name)){
                res.status(400).json('bad name');
                return;
            }
            if(await getDepartmentIDFromName(name, user.schoolID, db)===undefined){
                if(await getDepartmentIDFromShorthand(shorthand, user.schoolID, db)===undefined) {
                    db.insert({
                        departmentName: name,
                        departmentShorthand: shorthand.toUpperCase(),
                        departmentSchoolID: user.schoolID
                    }).into("departments")
                        .returning("departmentID")
                        .then(resp => {
                            res.json("OK");
                        })
                        .catch(error => {
                            console.log(error)
                            res.status(400).json("Database error");
                        })
                }else{
                    res.status(400).json("used shorthand");
                }
            }else {
                res.status(400).json("used name");
            }
        }
    })
}