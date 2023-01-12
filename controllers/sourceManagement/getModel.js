import {verifyUserTypeAndSchool} from "../../functions/verifyUserTypeAndSchool.js";
import {
    getDegreeNameFromID,
    getDepartmentNameFromID,
    getModuleNameFromID,
    getSubjectNameFromID, getUserNameFromID
} from "../../functions/nameGetters.js";

export const getModel = (req, res, db) => {

    const {courseID} = req.query;
    const {userID} = req.user;
    console.log(courseID)

    if(!userID || !courseID){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserTypeAndSchool(userID, db).then(user => {
        if(user.userType>=0){
            db.select("ects", "courseID", "competences", "coordinatorID", "degreeID", "departmentID", "evaluation",
                "internationalName", "language", "literature", "minContents", "moduleID", "name", "period", "program",
                "results", "shorthand", "subjectID", "type", "year")
                .from("courses").where("schoolID", "=", user.schoolID)
                .where("courseID", courseID)
                .then(async data => {
                    const item = data[0]
                    const course = {
                        "degree": await getDegreeNameFromID(item.degreeID, db),
                        "year": item.year,
                        "period": item.period,
                        "language": item.language,
                        "code": item.courseID,
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
                })
        }else{
            res.status(403).json("you don't have permission to perform this action")
        }
    })
}