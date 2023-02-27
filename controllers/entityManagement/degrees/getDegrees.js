import {verifyUserInfo} from "../../../functions/verifyUser.js";
import {getUserNameFromID} from "../../../functions/nameGetters.js";
import {getCourseCount, getECTSCount, getModuleCount, getSubjectCount} from "../../../functions/countGetters.js";


export const getDegrees = (req, res, db) => {

    const {userID} = req.user;

    if(!userID){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(user => {
        if(user.userType>=1){

            db.select("degreeID", "degreeDisplayName", "degreeDuration", "coordinatorID")
                .from("degrees").where("schoolID", "=", user.schoolID)
                .orderBy("degreeDisplayName")
                .then(async data => {
                    let response = []
                    for (const item of data) {
                        const degree = {
                            degreeID: item.degreeID,
                            name: item.degreeDisplayName,
                            duration: item.degreeDuration,
                            coordinator: await getUserNameFromID(item.coordinatorID, db),
                            coordinatorID: item.coordinatorID,
                            courses: await getCourseCount(item.degreeID, db),
                            subjects: await getSubjectCount(item.degreeID, db),
                            modules: await getModuleCount(item.degreeID, db),
                            ECTS: await getECTSCount(item.degreeID, db)
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