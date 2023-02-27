import {verifyUserInfo} from "../../functions/verifyUser.js";

export const getDegreeNames = (req, res, db) => {
    const {userID} = req.user;

    if(!userID){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(user => {
        db.select("degreeDisplayName", "degreeID").from('degrees')
            .where("schoolID", "=", user.schoolID)
            .then(resp => {
                res.json(resp);
            })
    })
}