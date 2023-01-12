export function getDegreeNameFromID (degreeID, db) {
    return db.select('degreeDisplayName').from('degrees').where({'degreeID': degreeID}).then(data => {
        return data[0].degreeDisplayName;
    }).catch(error => console.log)
}

export function getDepartmentNameFromID (departmentID, db) {
    return db.select('departmentName').from('departments')
        .where({'departmentID': departmentID})
        .then(data => {
        return data[0].departmentName;
    }).catch(error => console.log)
}

export function getModuleNameFromID (moduleID, db) {
    return db.select('moduleName').from('modules').where({'moduleID': moduleID}).then(data => {
        return data[0].moduleName;
    }).catch(error => console.log)
}

export function getSubjectNameFromID (subjectID, db) {
    return db.select('subjectName').from('subjects').where({'subjectID': subjectID}).then(data => {
        return data[0].subjectName;
    }).catch(error => console.log)
}

export function getUserNameFromID (userID, db) {
    return db.select('userName').from('users').where({'userID': userID}).then(data => {
        return data[0].userName;
    }).catch(error => console.log)
}