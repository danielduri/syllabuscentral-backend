import {verifyUserInfo} from "../../../functions/verifyUser.js";
import {
    getDepartmentIDFromName,
    getDepartmentIDFromShorthand
} from "../../../functions/idGetters.js";

export async function editDepartment(req, res, db) {
    const {departmentID, name, shorthand} = req.body;
    const {userID} = req.user;

    if (!userID || !departmentID) {
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        if(user.userType>=1){
            let cont=true;
            if(name){
                if(await getDepartmentIDFromName(name, user.schoolID, db)!==undefined){
                    cont=false
                    res.json("used name")
                }
            }

            if(cont && shorthand) {
                if (await getDepartmentIDFromShorthand(shorthand, user.schoolID, db) !== undefined) {
                    cont=false
                    res.json("used shorthand")
                }
            }

            if(cont){
                db.transaction(function (trx) {

                    let promises = [];

                    if(name){
                        promises.push(
                            trx("departments").update({
                                departmentName: name
                            }).where("departmentID", "=", departmentID).catch(error => {
                                console.log(error)
                            })
                        )
                    }

                    if(shorthand){
                        promises.push(
                            trx("departments").update({
                                departmentShorthand: shorthand.toUpperCase()
                            }).where("departmentID", "=", departmentID).catch(error => {
                                console.log(error)
                            })
                        )
                    }

                    return Promise.all(promises).then(trx.commit).catch(trx.rollback);
                })
                    .then(function () {
                        res.json("OK")
                    })
                    .catch(function (error) {
                        console.error(error);
                        res.status(400).json("Database error");
                    });
            }

        }else{
            res.status(500).json("forbidden action")
        }
    })
}