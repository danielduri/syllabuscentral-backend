import {verifyUserInfo} from "../../../functions/verifyUser.js";

export function deleteSchool(req, res, db) {
    const {schoolID} = req.body;
    const {userID} = req.user;

    if (!userID || !schoolID) {
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(async user => {
        if (user.userType >= 2 && schoolID !== 1) {
            db.select("schoolID").from("schools").where("schoolID", "=", 1).then(async resp => {
                if (resp[0] === undefined) {
                    await db("schools").insert({
                        schoolID: 1,
                        schoolName: "Administración Central"
                    }).then(() => {
                        console.log("Created school 1")
                    })
                }

                await db("users").update({
                    schoolID: 1
                }).where("userType", ">=", 2)
                    .andWhere("schoolID", "=", schoolID).then(() => {
                        db("schools").where({"schoolID": schoolID}).returning("schoolID").del().then(id => {
                            console.log("Deleted ", id[0])
                            res.json("OK")
                        }, (error) => {
                            console.log(error)
                            res.status(500).json("Database error")
                        })
                    }, (error) => {
                        console.log(error)
                        res.status(500).json("Database error")
                    })
            }, (error) => {
                console.log(error)
                res.status(500).json("Database error")
            })
        } else {
            res.status(500).json("Forbidden action")
        }
    })
}