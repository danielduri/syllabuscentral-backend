import {verifyUserInfo} from "../../../functions/verifyUser.js";

export async function newSchool(req, res, db) {
    const {schoolName} = req.body;
    const {userID} = req.user;

    if (!userID || !schoolName) {
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        if(user.userType>=2){
            db.insert({
                schoolName: schoolName
            }).into("schools")
                .returning("schoolID")
                .then(id => {
                    console.log("Created ", id[0])
                    res.json("OK")
                }, (error) => {
                    console.log(error)
                    res.json("database error")
                });
        }
    })
}