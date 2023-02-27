import {verifyUserInfo} from "../../../functions/verifyUser.js";

export const getDegreeCoordinators = (req, res, db) => {
    const {userID} = req.user;

    if(!userID){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(user => {
        if(user.userType>=1){
            db.select("userName", "userID").from('users')
                .where('userType', ">=", 1)
                .andWhere("schoolID", "=", user.schoolID)
                .then(resp => {
                    res.json(resp);
                })
        }else{
            res.status(403).json("you don't have permission to perform this action")
        }
    })
}