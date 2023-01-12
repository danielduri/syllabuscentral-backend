import {verifyUserTypeAndSchool} from "../../functions/verifyUserTypeAndSchool.js";
import {getDegreeNameFromID, getDepartmentNameFromID, getUserNameFromID} from "../../functions/nameGetters.js";

export const getModels = (req, res, db) => {

    const {search} = req.body;
    const {userID} = req.user;

    if(!userID){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserTypeAndSchool(userID, db).then(user => {
        if(user.userType>=0){

            let searchText=""
            let code=null;
            if(search){
                if(!Number.isNaN(Number.parseInt(searchText))){
                    code=Number.parseInt(searchText)
                }
                searchText=search
            }

            db.select("degreeID", "name", "courseID", "year", "shorthand", "ects", "departmentID", "coordinatorID", "type")
                .from("courses").where("schoolID", "=", user.schoolID)
                .andWhereILike("name", `%${searchText}%`)
                .orWhereILike("shorthand", `%${searchText}%`)
                .modify(function(queryBuilder) {
                    if (Number.parseInt(searchText)) {
                        queryBuilder.orWhere("courseID", "=", Number.parseInt(searchText));
                    }
                })
                //.orWhere("courseID", "=", code)
                .orderBy("degreeID")
                .then(async data => {
                    let response = []
                    for (const item of data) {
                        let add = true;
                        if(user.userType===0){
                            if(item.coordinatorID!==userID){
                                add=false;
                            }
                        }
                        if(add){
                            const course = {
                                degree: await getDegreeNameFromID(item.degreeID, db),
                                name: item.name,
                                courseID: item.courseID,
                                shorthand: item.shorthand,
                                ECTS: item.ects,
                                department: await getDepartmentNameFromID(item.departmentID, db),
                                coordinator: await getUserNameFromID(item.coordinatorID, db),
                                type: item.type
                            }
                            response.push(course)
                        }
                    }
                    res.json(response);
                })


        }else{
            res.status(403).json("you don't have permission to perform this action")
        }
    })
}