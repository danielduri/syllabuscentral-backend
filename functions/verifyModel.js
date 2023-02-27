import {getDegreeDurationFromDegreeID, getModuleDegreeFromID, getSubjectDegreeFromID} from "./dataGetters.js";
import {getDepartmentIDFromUserID, getModuleIDFromName, getSubjectIDFromName} from "./idGetters.js";

export const verifyModel = (model) => {
    const {degree, year, period, language, code, name, intlName, shorthand,
        type, ECTS, department, coordinator, minContents, program, results,
        evaluation, literature, competences, subject, module} = model

    const {basic, general, specific} = competences

    if(degree===null || degree===undefined || !Number.isInteger(degree)){
        return("degreeID")
    }else if(year===null || year===undefined || !Number.isInteger(year)){
        return("year")
    }else if(period===null || period===undefined || !Number.isInteger(period)){
        return("period")
    }else if(language===null || language===undefined || language===""){
        return("language")
    }else if(code===null || code===undefined || !Number.parseInt(code)){
        return("code")
    }else if(name===null || name===undefined || name===""){
        return("courseName")
    }else if(intlName===null || intlName===undefined || intlName===""){
        return("intlName")
    }else if(shorthand===null || shorthand===undefined || shorthand===""){
        return("shorthand")
    }else if(type===null || type===undefined || type===""){
        return("type")
    }else if(ECTS===null || ECTS===undefined || ECTS%0.5!==0){
        return("ECTS")
    }else if(subject===null || subject===undefined || subject===""){
        return("subject")
    }else if(module===null || module===undefined || module===""){
        return("module")
    }else if(department===null || department===undefined || !Number.isInteger(department)){
        return("department")
    }else if(coordinator===null || coordinator===undefined || !Number.isInteger(coordinator)){
        return("coordinator")
    }else if(minContents===null || minContents===undefined || !Array.isArray(minContents)){
        return("minContents")
    }else if(program===null || program===undefined || !Array.isArray(program)){
        return("program")
    }else if(results===null || results===undefined || !Array.isArray(results)){
        return("results")
    }else if(evaluation===null || evaluation===undefined || evaluation===""){
        return("evaluation")
    }else if(literature===null || literature===undefined || !Array.isArray(literature)){
        return("literature")
    }else if(basic===null || basic===undefined || !Array.isArray(basic)){
        return("basic")
    }else if(general===null || general===undefined || !Array.isArray(general)){
        return("general")
    }else if(specific===null || specific===undefined || !Array.isArray(specific)){
        return("specific")
    }else if (!checkPeriod(model)){
        return("invalid period")
    }else if (!checkECTS(model)){
        return("invalid ECTS")
    }else if (!checkType(model)){
        return("invalid type")
    }else if (!checkShorthand(model)){
        return("invalid shorthand")
    }else{
        return("valid")
    }
}

const checkPeriod = (model) => {
    return (model.period >= 0 && model.period <= 2)
}

const checkShorthand = (model) => {
    let regex = /^[\w-_.]*$/;
    return !(model.shorthand.length < 2 || model.shorthand.length > 5 || !regex.test(model.shorthand));
}

const checkType = (model) => {
    return (model.type === "Obligatoria" || model.type === "Formación básica" || model.type === "Optativa" || model.type === "Trabajo de fin de grado")
}

const checkECTS = (model) => {
    return (model.ECTS % 0.5 === 0)
}

export const verifyYear = async (model, db) => {
    return await getDegreeDurationFromDegreeID(model.degree, db).then(data => {
        return (model.year >= 0 && model.year <= data);
    })
}

export const verifyDepartment = async (model, db) => {
    return await getDepartmentIDFromUserID(model.coordinator, db).then(data => {
        return (data === model.department);
    })
}

export const verifySubject = async (model, db) => {
    if (Number.isInteger(model.subject)) {
        return await getSubjectDegreeFromID(model.subject, db).then(data => {
            if (data === model.degree){
                return model.subject
            }
        })
    }else{
        return await getSubjectIDFromName(model.subject, model.degree, db).then(data => {
            if (data===undefined){
                return "create"
            }else{
                return data.subjectID
            }
        })
    }
}

export const verifyModule = async (model, db) => {
    if (Number.isInteger(model.module)) {
        return await getModuleDegreeFromID(model.module, db).then(data => {
            if (data === model.degree){
                return model.module
            }
        })
    }else{
        return await getModuleIDFromName(model.module, model.degree, db).then(data => {
            if (data===undefined){
                return "create"
            }else{
                return data.moduleID
            }
        })
    }
}
