export function getDepartmentIDFromName (departmentName, schoolID, db) {
    return db.select('departmentID').from('departments').where({'departmentName': departmentName, 'departmentSchoolID': schoolID}).then(data => {
        return data[0].departmentID;
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
    })
}