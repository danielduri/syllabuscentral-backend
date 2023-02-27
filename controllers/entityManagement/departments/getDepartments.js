import {verifyUserInfo} from "../../../functions/verifyUser.js";
import {getCoursesFromDepartmentID, getMembersFromDepartmentID} from "../../../functions/dataGetters.js";


export const getDepartments = (req, res, db) => {

    const {userID} = req.user;

    if(!userID){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(user => {
        if(user.userType>=1){

            db.select("departmentID", "departmentName", "departmentShorthand")
                .from("departments").where("departmentSchoolID", "=", user.schoolID)
                .orderBy("departmentName")
                .then(async data => {
                    let response = []
                    for (const item of data) {
                        const degree = {
                            departmentID: item.departmentID,
                            department: item.departmentName,
                            shorthand: item.departmentShorthand,
                            courses: await getCoursesFromDepartmentID(item.departmentID, db),
                            members: await getMembersFromDepartmentID(item.departmentID, db)
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