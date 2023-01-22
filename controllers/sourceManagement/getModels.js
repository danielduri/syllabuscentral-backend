import {verifyUserInfo} from "../../functions/verifyUser.js";
import {getDegreeNameFromID, getDepartmentNameFromID, getUserNameFromID} from "../../functions/nameGetters.js";


export const getModels = (req, res, db) => {

    const {search} = req.body;
    const {userID} = req.user;

    if(!userID){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(user => {
        if(user.userType>=0){

            let searchText=""
            if(search){
                searchText=search
            }

            db.select("degreeID", "name", "courseid", "year", "shorthand", "ects", "departmentID", "coordinatorID", "type")
                .from("courses").where("schoolID", "=", user.schoolID)
                .modify(function(queryBuilder) {
                    if(user.userType===0){
                        queryBuilder.andWhere({"departmentID": user.departmentID});
                    }
                }).andWhere(function() {
                    this.whereILike("name", `%${searchText}%`)
                        .orWhereILike("shorthand", `${searchText}%`)
                        .orWhere(db.raw(`courseid::TEXT LIKE '${searchText}%'`))
            })
                .orderBy(["degreeID", "courseid"])
                .then(async data => {
                    let response = []
                    for (const item of data) {
                        /*
                        let add = true;
                        if(user.userType===0){
                            if(item.departmentID !== user.departmentID){
                                add=false
                            }
                        }
                        if(add){
                         */

                        const course = {
                            degree: await getDegreeNameFromID(item.degreeID, db),
                            name: item.name,
                            courseid: item.courseid,
                            shorthand: item.shorthand,
                            ECTS: item.ects,
                            department: await getDepartmentNameFromID(item.departmentID, db),
                            coordinator: await getUserNameFromID(item.coordinatorID, db),
                            type: item.type
                        }
                        response.push(course)
                    }
                    res.json(response);
                })




        }else{
            res.status(403).json("you don't have permission to perform this action")
        }
    })
}