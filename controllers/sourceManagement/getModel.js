import {verifyUserInfo} from "../../functions/verifyUser.js";
import {
    getDegreeNameFromID,
    getDepartmentNameFromID,
    getModuleNameFromID,
    getSubjectNameFromID, getUserNameFromID
} from "../../functions/nameGetters.js";

export const getModel = (req, res, db) => {

    const {courseid} = req.query;
    const {userID} = req.user;
    console.log(courseid)

    if(!userID || !courseid){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(user => {
        if(user.userType>=0){
            db.select("ects", "courseid", "competences", "coordinatorID", "degreeID", "departmentID", "evaluation",
                "internationalName", "language", "literature", "minContents", "moduleID", "name", "period", "program",
                "results", "shorthand", "subjectID", "type", "year")
                .from("courses").where("schoolID", "=", user.schoolID)
                .where("courseid", courseid)
                .then(async data => {
                    const item = data[0]
                    if(user.userType>=1 || item.departmentID===user.departmentID){
                        const course = {
                            "degree": await getDegreeNameFromID(item.degreeID, db),
                            "year": item.year,
                            "period": item.period,
                            "language": item.language,
                            "code": item.courseid,
                            "name": item.name,
                            "intlName":item.internationalName,
                            "shorthand": item.shorthand,
                            "type": item.type,
                            "ECTS": item.ects,
                            "subject": await getSubjectNameFromID(item.subjectID, db),
                            "module": await getModuleNameFromID(item.moduleID, db),
                            "department": await getDepartmentNameFromID(item.departmentID, db),
                            "coordinator": await getUserNameFromID(item.coordinatorID, db),
                            "minContents": item.minContents,
                            "program": item.program,
                            "competences": item.competences,
                            "results": item.results,
                            "evaluation": item.evaluation,
                            "literature": item.literature,
                        }
                        res.json(course);
                    }else{
                        res.status(403).json("you don't have permission to perform this action")
                    }
                }
                )
        }
    })
}