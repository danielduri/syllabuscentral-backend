import {verifyUserInfo} from "../../../functions/verifyUser.js";
import {getDegreeNameFromID} from "../../../functions/nameGetters.js";
import {getCoursesFromModuleID} from "../../../functions/dataGetters.js";

export const getModules = (req, res, db) => {

    const {userID} = req.user;

    if(!userID){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(user => {
        if(user.userType>=1){

            db.select("moduleID", "moduleName", "moduleDegree")
                .from("modules").where("moduleSchool", "=", user.schoolID)
                .orderBy("moduleDegree")
                .then(async data => {
                    let response = []
                    for (const item of data) {
                        const degree = {
                            moduleName: item.moduleName,
                            moduleID: item.moduleID,
                            moduleDegree: await getDegreeNameFromID(item.moduleDegree, db),
                            moduleDegreeID: item.moduleDegree,
                            courses: await getCoursesFromModuleID(item.moduleID, db)
                        }
                        response.push(degree)
                    }
                    res.json(response);
                })

        }else{
            res.status(403).json("you don't have permission to perform this action")
        }
    })
}