import {verifyUserInfo} from "../../functions/verifyUser.js";

export const getDepartmentNames = (req, res, db) => {
    const {userID} = req.user;

    if(!userID){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(user => {
        db.select("departmentName", "departmentID").from('departments')
            .where("departmentSchoolID", "=", user.schoolID)
            .then(resp => {
                res.json(resp);
            })
    })
}