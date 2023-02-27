import {verifyUserInfo} from "../../../functions/verifyUser.js";
import {getDegreeNameFromID} from "../../../functions/nameGetters.js";
import {getCoursesFromSubjectID} from "../../../functions/dataGetters.js";

export const getSubjects = (req, res, db) => {

    const {userID} = req.user;

    if(!userID){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(user => {
        if(user.userType>=1){

            db.select("subjectID", "subjectName", "subjectDegree")
                .from("subjects").where("subjectSchool", "=", user.schoolID)
                .orderBy("subjectDegree")
                .then(async data => {
                    let response = []
                    for (const item of data) {
                        const degree = {
                            subjectName: item.subjectName,
                            subjectID: item.subjectID,
                            subjectDegree: await getDegreeNameFromID(item.subjectDegree, db),
                            subjectDegreeID: item.subjectDegree,
                            courses: await getCoursesFromSubjectID(item.subjectID, db)
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