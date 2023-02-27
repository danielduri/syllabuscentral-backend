import {verifyUserInfo} from "../../../functions/verifyUser.js";

export async function switchSchool(req, res, db) {
    const {schoolID} = req.body;
    const {userID} = req.user;

    if (!userID || schoolID===undefined) {
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        if(user.userType>=2){
            db("users").update({
                schoolID: schoolID
            }).where("userID", "=", userID).then(
                () => {res.json("OK")},
                (error) => {
                    console.log(error)
                    res.json("Database error")
                }
            )

        }else{
            res.status(500).json("forbidden action")
        }
    })
}