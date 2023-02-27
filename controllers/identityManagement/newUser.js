import {verifyUserInfo} from "../../functions/verifyUser.js";
import {getUserIDFromEmail, getUserIDFromName} from "../../functions/idGetters.js";
import {validateName} from "../userActions/changeName.js";
import {validateEmail} from "../userActions/changeEmail.js";
import {validatePassword} from "../userActions/changePassword.js";

export async function newUser(req, res, db, bcrypt) {
    const {name, password, email, department} = req.body;
    const {userID} = req.user;

    if (!userID || !name || !password || !email || !department) {
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        if(user.userType>=1){

            const verifyName = await getUserIDFromName(name, user.schoolID, db)
            const verifyEmail = await getUserIDFromEmail(email, db)

            if(verifyName===undefined && verifyEmail===undefined){

                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);

                if(!validateName(name)){
                    res.status(400).json("Invalid name");
                    return;
                }

                if(!validateEmail(email)){
                    res.status(400).json("Invalid email");
                    return;
                }

                if(!validatePassword(password)){
                    res.status(400).json("Invalid password");
                    return;
                }

                db.insert({
                    userName: name,
                    passwordHash: hash,
                    email: email,
                    departmentID: department,
                    userType: 0,
                    schoolID: user.schoolID
                }).into("users")
                    .returning("userID")
                    .then(resp => {
                        res.json(resp[0].userID);
                    })
                    .catch(error => {
                        console.log(error)
                        res.status(400).json("Database error");
                    })
            }else if (verifyName!==undefined) {
                res.status(400).json("Used name");
            }else if (verifyEmail!==undefined) {
                res.status(400).json("Used email");
            }
        }
    })
}