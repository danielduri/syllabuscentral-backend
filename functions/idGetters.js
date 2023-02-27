export function getDepartmentIDFromName (departmentName, schoolID, db) {
    return db.select('departmentID').from('departments').where({'departmentName': departmentName, 'departmentSchoolID': schoolID}).then(data => {
        if(data[0]){
            return data[0].departmentID;
        }else{
            return undefined
        }
    }).catch(error => console.log(error))
}

export function getDepartmentIDFromShorthand (departmentShorthand, schoolID, db) {
    return db.select('departmentID').from('departments').where({'departmentShorthand': departmentShorthand.toUpperCase(), 'departmentSchoolID': schoolID}).then(data => {
        if(data[0]){
            return data[0].departmentID;
        }else{
            return undefined
        }
    }).catch(error => console.log(error))
}

export function getModuleIDFromName (moduleName, degreeID, db) {
    return db.select('moduleID').from('modules').where({'moduleName': moduleName, 'moduleDegree': degreeID}).then(data => {
        return data[0];
    }).catch(error => console.log(error))
}

export function getModuleIDFromCourseID (courseID, schoolID, db) {
    return db.select('moduleID').from('courses').where({'courseid': courseID, 'schoolID': schoolID}).then(data => {
        return data[0].moduleID;
    }).catch(error => console.log(error))
}

export function getSubjectIDFromCourseID (courseID, schoolID, db) {
    return db.select('subjectID').from('courses').where({'courseid': courseID, 'schoolID': schoolID}).then(data => {
        return data[0].subjectID;
    }).catch(error => console.log(error))
}


export function getSubjectIDFromName (subjectName, degreeID, db) {
    return db.select('subjectID').from('subjects').where({'subjectName': subjectName, 'subjectDegree': degreeID}).then(data => {
        return data[0];
    }).catch(error => console.log(error))
}

export function getUserIDFromName (userName, schoolID, db) {
    return db.select('userID').from('users').where({'userName': userName, "schoolID": schoolID}).then(data => {
        return data[0];
    }).catch(error => console.log(error))
}

export function getUserIDFromEmail (userEmail, db) {
    return db.select('userID').from('users').where({'email': userEmail}).then(data => {
        return data[0];
    }).catch(error => console.log(error))
}

export function getCoordinatorIDFromCourseID (courseID, schoolID, db) {
    return db.select('coordinatorID').from('courses').where({'courseid': courseID, "schoolID": schoolID}).then(data => {
        return data[0].coordinatorID;
    }).catch(error => console.log(error))
}

export function getCoordinatorIDFromDegreeID (degreeID, db) {
    return db.select('coordinatorID').from('degrees').where({'degreeID': degreeID}).then(data => {
        return data[0].coordinatorID;
    }).catch(error => console.log(error))
}

export function getDegreeIDFromCourseID (courseID, schoolID, db) {
    return db.select('degreeID').from('courses').where({'courseid': courseID, "schoolID": schoolID}).then(data => {
        return data[0].degreeID;
    }).catch(error => console.log(error))
}

export function getDegreeCoordinatorIDFromCourseID (courseID, schoolID, db) {
    return getDegreeIDFromCourseID(courseID, schoolID, db).then(degreeID => {
        getCoordinatorIDFromDegreeID(degreeID, db).then(data => {
            return data;
        }).catch(error => console.log(error))
    }).catch(error => console.log(error))
}

export function getDegreesCoordinatedByUser (userID, db) {
    return db.select('degreeID').from('degrees').where({"coordinatorID": userID}).then(data => {
        return data[0]
    }).catch(error => console.log(error))
}

export function getDegreeIDFromRawName (rawName, schoolID, db) {
    return db.select("degreeID").from("degrees").where({"degreeRawName": rawName, "schoolID": schoolID}).then(data => {
        return data[0]
    }).catch(error => console.log(error))
}

export const getDepartmentIDFromUserID = async (userID, db) => {
    return await db.select("departmentID").from("users").where("userID", "=", userID).then(data => {
        return data[0].departmentID
    }).catch(error => console.log(error))
}

export const getSchoolIDFromUserID = async (userID, db) => {
    return await db.select("schoolID").from("users").where("userID", "=", userID).then(data => {
        return data[0].schoolID
    }).catch(error => console.log(error))
}

export const getSchoolIDFromCourseID = async (courseID, db) => {
    return await db.select("schoolID").from("courses").where("courseid", "=", courseID).then(data => {
        return data[0].schoolID
    }).catch(error => console.log(error))
}

export const getSchoolIDFromDegreeID = async (degreeID, db) => {
    return await db.select("schoolID").from("degrees").where("degreeID", "=", degreeID).then(data => {
        return data[0].schoolID
    }).catch(error => console.log(error))
}

export const getSchoolIDFromDepartmentID = async (departmentID, db) => {
    return await db.select("departmentSchoolID").from("departments").where("departmentID", "=", departmentID).then(data => {
        return data[0].departmentSchoolID
    }).catch(error => console.log(error))
}

export const getSchoolIDFromModuleID = async (moduleID, db) => {
    return await db.select("moduleSchool").from("modules").where("moduleID", "=", moduleID).then(data => {
        return data[0].moduleSchool
    }).catch(error => console.log(error))
}

export const getSchoolIDFromSubjectID = async (subjectID, db) => {
    return await db.select("subjectSchool").from("subjects").where("subjectID", "=", subjectID).then(data => {
        return data[0].subjectSchool
    }).catch(error => console.log(error))
}