export function getDepartmentIDFromName (departmentName, schoolID, db) {
    return db.select('departmentID').from('departments').where({'departmentName': departmentName, 'departmentSchoolID': schoolID}).then(data => {
        return data[0];
    }).catch(error => console.log)
}

export function getModuleIDFromName (moduleName, degreeID, db) {
    return db.select('moduleID').from('modules').where({'moduleName': moduleName, 'moduleDegree': degreeID}).then(data => {
        return data[0];
    }).catch(error => console.log)
}

export function getSubjectIDFromName (subjectName, degreeID, db) {
    return db.select('subjectID').from('subjects').where({'subjectName': subjectName, 'subjectDegree': degreeID}).then(data => {
        return data[0];
    }).catch(error => console.log)
}

export function getUserIDFromName (userName, schoolID, db) {
    return db.select('userID').from('users').where({'userName': userName, "schoolID": schoolID}).then(data => {
        return data[0];
    }).catch(error => console.log)
}

export function getCoordinatorIDFromCourseID (courseID, schoolID, db) {
    return db.select('coordinatorID').from('courses').where({'courseID': courseID, "schoolID": schoolID}).then(data => {
        return data[0];
    }).catch(error => console.log)
}