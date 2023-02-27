export function getDegreeNameFromID (degreeID, db) {
    return db.select('degreeDisplayName').from('degrees').where({'degreeID': degreeID}).then(data => {
        return data[0] ? data[0].degreeDisplayName : undefined;
    }).catch(error => console.log(error))
}

export function getCourseNameFromID (courseID, schoolID, db) {
    return db.select('name').from('courses').where({'courseid': courseID, 'schoolID': schoolID}).then(data => {
        return data[0] ? data[0].name : undefined;
    }).catch(error => console.log(error))
}

export function getDepartmentNameFromID (departmentID, db) {
    return db.select('departmentName').from('departments')
        .where({'departmentID': departmentID})
        .then(data => {
            return data[0]? data[0].departmentName : undefined;
    }).catch(error => console.log(error))
}

export function getModuleNameFromID (moduleID, db) {
    return db.select('moduleName').from('modules').where({'moduleID': moduleID}).then(data => {
        return data[0] ? data[0].moduleName : undefined;
    }).catch(error => console.log(error))
}

export function getSubjectNameFromID (subjectID, db) {
    return db.select('subjectName').from('subjects').where({'subjectID': subjectID}).then(data => {
        return data[0] ? data[0].subjectName : undefined;
    }).catch(error => console.log(error))
}

export function getUserNameFromID (userID, db) {
    return db.select('userName').from('users').where({'userID': userID}).then(data => {
        return data[0] ? data[0].userName : undefined;
    }).catch(error => console.log(error))
}