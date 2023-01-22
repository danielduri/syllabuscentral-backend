export const getDegreeDurationFromDegreeID = async (degreeID, db) => {
    return await db.select("degreeDuration").from("degrees").where("degreeID", "=", degreeID).then( data => {
        return data[0].degreeDuration
    }).catch(error => console.log(error))
}

export const getSubjectDegreeFromID = async (subjectID, db) => {
    return await db.select('subjectDegree').from('subjects').where('subjectID', "=", subjectID).then(data => {
        return data[0].subjectDegree
    }).catch(error => console.log(error))
}

export const getModuleDegreeFromID = async (moduleID, db) => {
    return await db.select('moduleDegree').from('modules').where('moduleID', "=", moduleID).then(data => {
        return data[0].moduleDegree
    }).catch(error => console.log(error))
}

export const getDepartmentIDFromUserID = async (userID, db) => {
    return await db.select("departmentID").from("users").where("userID", "=", userID).then(data => {
        return data[0].departmentID
    }).catch(error => console.log(error))
}
