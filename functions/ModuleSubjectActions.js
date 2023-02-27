import {getSchoolIDFromDegreeID} from "./idGetters.js";

export function checkSubjectCount(subjectID, db){
    return db.select("subjectCount").from("subjects").where({"subjectID": subjectID}).then((count) => {
        if(count[0].subjectCount===0){
            db("subjects").where("subjectID", subjectID).del().then((ret) => {}, (error) => {
                console.log(error)
            });
        }
    })
}

export function checkModuleCount(moduleID, db){
    return db.select("moduleCount").from("modules").where({"moduleID": moduleID}).then((count) => {
        if(count[0].moduleCount===0){
            db("modules").where("moduleID", moduleID).del().then((ret) => {}, (error) => {
                console.log(error)
            });
        }
    })
}

export async function createSubject(subject, degree, db) {
    return db.insert({
        subjectName: subject,
        subjectDegree: degree,
        subjectSchool: await getSchoolIDFromDegreeID(degree, db)
    }).into("subjects").returning("subjectID").then(id => {
        return id[0].subjectID;
    })
}

export async function createModule(module, degree, db) {
    return db.insert({
        moduleName: module,
        moduleDegree: degree,
        moduleSchool: await getSchoolIDFromDegreeID(degree, db)
    }).into("modules").returning("moduleID").then(id => {
        return id[0].moduleID;
    })
}

