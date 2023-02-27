import {verifyUserInfo} from "../../functions/verifyUser.js";
import {isEditable} from "./getUsers.js";

export async function promoteUser(req, res, db) {
    const {userID, newUserType} = req.body;
    const {userID: currentUserID} = req.user;

    if (!currentUserID || !userID || !newUserType===undefined) {
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(currentUserID, db).then(async user => {
        const editable = await isEditable(user, userID, db);
        if (user.userType >= 2 && (editable === "yes" || editable==="course")) {
            db("users").update({
                userType: newUserType
            }).where("userID", "=", userID).then(() => {
                res.json("OK")
            })
        } else {
            res.status(500).json("Forbidden action")
        }
    })
}