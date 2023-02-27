import {verifyUserInfo} from "../../../functions/verifyUser.js";

export async function editSchool(req, res, db) {
    const {schoolName, schoolID} = req.body;
    const {userID} = req.user;

    if (!userID || !schoolName || !schoolID) {
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        if(user.userType>=2){
            db("schools").update({
                schoolName: schoolName
            }).where("schoolID", "=", schoolID).then(
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