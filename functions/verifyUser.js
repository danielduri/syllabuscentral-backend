//Returns a promise that will yield 0 if USER, 1 if ADMIN, 2 if SUPERADMIN
import {getCoordinatorIDFromCourseID} from "./idGetters.js";
import {getDepartmentIDFromUserID} from "./dataGetters.js";

export const verifyUserInfo = async (userID, db) => {
    return await db.select('userID', 'userType', 'schoolID', 'departmentID').from('users').where({
        'userID': userID
    }).then(data => {
        if (data[0] !== undefined) {
            return data[0]
        } else {
            return null;
        }
    }).catch(err => {
        console.log(err)
        return null;
    })
}

export const verifyUserPermissionForCourse = async (user, courseID, db) => {
    if (user.userType === 0) {
        return getCoordinatorIDFromCourseID(courseID, user.schoolID, db).then(response => {
            return user.userID === response;
        }).catch(error => {
            console.log(error)
        })
    } else {
        return true
    }
}

export const verifyUserPermissionForNewCourse = async (user, departmentID, db) => {
    if (user.userType === 0) {
        return getDepartmentIDFromUserID(user.userID, db).then(response => {
            return departmentID === response;
        }).catch(error => {
            console.log(error)
        })
    } else {
        return true
    }
}


