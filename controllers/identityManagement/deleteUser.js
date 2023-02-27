import {verifyUserInfo} from "../../functions/verifyUser.js";
import {isEditable} from "./getUsers.js";

export async function deleteUser(req, res, db) {
    const userDelete = req.body.userID;
    const {userID} = req.user;

    if(!userID || !userDelete){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        if (await isEditable(user, userDelete, db)==="yes") {
            db("users").where({"userID": userDelete}).returning("userID").del().then((id) => {
                console.log("Deleted ", id[0])
                res.json("OK")
            })
        }else {
            res.status(500).json("Forbidden action")
        }
    })
}
