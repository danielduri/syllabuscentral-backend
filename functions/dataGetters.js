import {getDegreeNameFromID} from "./nameGetters.js";

export const getDegreeDurationFromDegreeID = async (degreeID, db) => {
    return await db.select("degreeDuration").from("degrees").where("degreeID", "=", degreeID).then( data => {
        return data[0] ? data[0].degreeDuration : undefined
    }).catch(error => console.log(error))
}

export const getSubjectDegreeFromID = async (subjectID, db) => {
    return await db.select('subjectDegree').from('subjects').where('subjectID', "=", subjectID).then(data => {
        return data[0] ? data[0].subjectDegree : undefined
    }).catch(error => console.log(error))
}

export const getModuleDegreeFromID = async (moduleID, db) => {
    return await db.select('moduleDegree').from('modules').where('moduleID', "=", moduleID).then(data => {
        return data[0] ? data[0].moduleDegree : undefined
    }).catch(error => console.log(error))
}

export const getUserTypeFromUserID = async (userID, db) => {
    return await  db.select("userType").from("users").where({"userID": userID}).then(data => {
        return data[0] ? data[0].userType : undefined
    }).catch(error => console.log(error))
}

export const getCoursesFromDepartmentID = async (departmentID, db) => {
    return await db.select("name", "courseid", "degreeID", "year").from("courses").where({"departmentID": departmentID}).then(async data => {
        let response = []
        for (const datum of data) {
            const degree = await getDegreeNameFromID(datum.degreeID, db)
            response.push({
                courseid: datum.courseid,
                name: datum.name,
                year: datum.year,
                degree: degree
            })
            //response.push(`${datum.courseid}: ${datum.name}, ${datum.year}º ${degree}`)
        }
        return response
    })
}

export const getCoursesFromModuleID = async (moduleID, db) => {
    return await db.select("name", "courseid", "degreeID", "year").from("courses").where({"moduleID": moduleID}).then(async data => {
        let response = []
        for (const datum of data) {
            const degree = await getDegreeNameFromID(datum.degreeID, db)
            response.push({
                courseid: datum.courseid,
                name: datum.name,
                year: datum.year,
                degree: degree
            })
            //response.push(`${datum.courseid}: ${datum.name}, ${datum.year}º ${degree}`)
        }
        return response
    })
}

export const getCoursesFromSubjectID = async (subjectID, db) => {
    return await db.select("name", "courseid", "degreeID", "year").from("courses").where({"subjectID": subjectID}).then(async data => {
        let response = []
        for (const datum of data) {
            const degree = await getDegreeNameFromID(datum.degreeID, db)
            response.push({
                courseid: datum.courseid,
                name: datum.name,
                year: datum.year,
                degree: degree
            })
            //response.push(`${datum.courseid}: ${datum.name}, ${datum.year}º ${degree}`)
        }
        return response
    })
}

export const getMembersFromDepartmentID = async (departmentID, db) => {
    return await db.select("userName", "userID").from("users").where({"departmentID": departmentID}).then(async data => {
        let response = []
        for (const datum of data) {
            response.push({
                userName: datum.userName,
                userID: datum.userID
            })
        }
        return response
    })
}

export const getSchoolNameFromID = async (schoolID, db) => {
    return await db.select("schoolName").from("schools").where({"schoolID": schoolID}).then(data => {
        return data[0] ? data[0].schoolName : undefined
    }).catch(error => console.log(error))
}