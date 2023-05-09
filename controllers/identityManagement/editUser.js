import {verifyUserInfo} from "../../functions/verifyUser.js";
import {isEditable} from "./getUsers.js";
import {getSuperadminUserID, getUserIDFromEmail, getUserIDFromName} from "../../functions/idGetters.js";
import {validateEmail} from "../userActions/changeEmail.js";
import {validatePassword} from "../userActions/changePassword.js";
import {validateName} from "../userActions/changeName.js";

export async function editUser(req, res, db, bcrypt) {
    const {userID} = req.user;
    const userEdit = req.body.userID;
    const {name, password, email, department} = req.body;

    if (!userID || !userEdit) {
        res.status(400).json("incorrect form submission");
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        const editable = await isEditable(user, userEdit, db);
        if (editable === "yes" || editable==="self" || editable==="degree" || editable==="course") {

            let cont = true;

            if(name){
                if(!validateName(name)){
                    cont=false
                    res.status(400).json("Invalid name");
                }else {
                    const verifyName = await getUserIDFromName(name, user.schoolID, db)
                    if(verifyName!==undefined){
                        cont=false
                        res.status(400).json("Used name");
                    }
                }
            }

            if(cont && email){
                if(!validateEmail(email)){
                    cont=false
                    res.status(400).json("Invalid email");
                }else {
                    const verifyEmail = await getUserIDFromEmail(email, db)
                    if(verifyEmail!==undefined){
                        cont=false
                        res.status(400).json("Used email");
                    }
                }
            }

            if(cont && password){
                if(!validatePassword(password)){
                    cont=false
                    res.status(400).json("Invalid password");
                }
            }

            if(cont){
                db.transaction(function(trx) {

                    let promises = [];

                    if(name){
                        promises.push(
                            trx.from('users').update({
                                userName: name
                            }).where({userID: userEdit})
                                .catch(err => {
                                    console.log(err)
                                })
                        )
                    }

                    if(email){
                        promises.push(
                            trx.from('users').update({
                                email: email
                            }).where({userID: userEdit})
                                .catch(err => {
                                    console.log(err)
                                })
                        )
                    }

                    if(password){

                        const salt = bcrypt.genSaltSync(10);
                        const hash = bcrypt.hashSync(password, salt);

                        promises.push(
                            trx.from('users').update({
                                passwordHash: hash
                            }).where({userID: userEdit})
                                .catch(err => {
                                    console.log(err)
                                })
                        )
                    }

                    if(department){
                        promises.push(
                            trx.from('users').update({
                                departmentID: department
                            }).where({userID: userEdit})
                                .catch(err => {
                                    console.log(err)
                                })
                        )
                        promises.push(
                            getSuperadminUserID(db).then(superadminID => {
                                trx.from('courses').update({
                                    coordinatorID: superadminID
                                }).where({coordinatorID: userEdit})
                                    .catch(err => {
                                        console.log(err)
                                    })
                            })
                        )
                    }

                    return Promise.all(promises).then(trx.commit).catch(trx.rollback);

                })
                    .then(function() {
                        res.json("OK")
                    })
                    .catch(function(err) {
                        console.error(err);
                        res.status(400).json("Database error");
                    });
            }
        }
    })
}