import {verifyUserInfo} from "../../functions/verifyUser.js";
import {getDepartmentNameFromID} from "../../functions/nameGetters.js";
import {getUserTypeFromUserID} from "../../functions/dataGetters.js";
import {getCourseCoordinatorCountByUser, getDegreeCoordinatorCountByUser} from "../../functions/countGetters.js";

export const getUsers = (req, res, db) => {

    const {userID} = req.user;

    if(!userID){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(user => {
        if(user.userType>=1){

            db.select("userID", "email", "userName", "departmentID", "userType")
                .from("users").where("schoolID", "=", user.schoolID)
                .orderBy("userID")
                .then(async data => {
                    let response = []
                    for (const item of data) {
                        const userResult = {
                            userID: item.userID,
                            email: item.email,
                            userName: item.userName,
                            departmentID: item.departmentID,
                            departmentName: await getDepartmentNameFromID(item.departmentID, db),
                            userType: item.userType,
                            isEditable: await isEditable(user, item.userID, db)
                        }
                        response.push(userResult)
                    }
                    res.json(response);
                })

        }else{
            res.status(403).json("you don't have permission to perform this action")
        }
    })
}

export const isEditable = async (user, userID, db) => {
    if (user.userID === userID) {
        return "self"
    }

    if (userID === 1) {
        return "admin"
    }

    const type = await getUserTypeFromUserID(userID, db);
    if (user.userType === 1) {
        if (type >= 1) {
            return "rank"
        }
    }else if (user.userType >= 2) {
        if (type >= 2) {
            return "rank"
        }
    }

    const countDegrees = await getDegreeCoordinatorCountByUser(userID, db);
    if (countDegrees > 0) {
        return "degree"
    }

    const countCourses = await getCourseCoordinatorCountByUser(userID, db);
    if (countCourses > 0) {
        return "course"
    }

    return "yes"

}