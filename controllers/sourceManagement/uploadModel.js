import {checkModuleCount, checkSubjectCount, createModule, createSubject} from "../../functions/ModuleSubjectActions.js";
import {verifyDepartment, verifyModel, verifyModule, verifySubject, verifyYear} from "../../functions/verifyModel.js";
import {getModuleIDFromCourseID, getSubjectIDFromCourseID} from "../../functions/idGetters.js";

export async function uploadModel(model, db, res, user) {

    const {
        degree, year, period, language, code, name, intlName, shorthand,
        type, ECTS, department, coordinator, minContents, program,
        results, evaluation, literature, competences
    } = model

    let {subject, module} = model

    const verifyResult = verifyModel(model)
    if (verifyResult !== "valid") {
        res.status(400).json(verifyResult)
    } else {
        const vYear = await verifyYear(model, db)
        const vDept = await verifyDepartment(model, db)
        const vSubject = await verifySubject(model, db)
        const vModule = await verifyModule(model, db)

        if(!vYear){
            res.status(400).json("invalid year")
        }else if(!vDept){
            res.status(400).json("invalid department")
        }else if(vSubject!=="create" && !Number.isInteger(vSubject)){
            res.status(400).json("invalid subject")
        }else if(vModule!=="create" && !Number.isInteger(vModule)){
            res.status(400).json("invalid module")
        }else{
            if(vSubject==="create"){
                subject = await createSubject(model.subject, model.degree, db);
            }
            if(vModule==="create"){
                module = await createModule(model.module, model.degree, db)
            }
            if(model.action==="create"){
                db.insert({
                    ects: ECTS,
                    courseid: code,
                    competences: JSON.stringify(competences),
                    coordinatorID: coordinator,
                    degreeID: degree,
                    departmentID: department,
                    evaluation: evaluation,
                    internationalName: intlName,
                    language: language,
                    literature: literature,
                    minContents: minContents,
                    moduleID: module,
                    name: name,
                    period: period,
                    program: program,
                    results: results,
                    shorthand: shorthand.toUpperCase(),
                    subjectID: subject,
                    type: type,
                    year: year,
                    schoolID: user.schoolID
                }).into("courses").returning("courseid").then(done => {
                    res.json("OK");
                    return true;
                }).catch(error => {
                    console.log(error)
                    res.status(400).json("Database error");
                })
            }else if(model.action==="update"){
                const oldModule = await getModuleIDFromCourseID(model.code, user.schoolID, db)
                const oldSubject = await getSubjectIDFromCourseID(model.code, user.schoolID, db)
                db("courses").update({
                    ects: ECTS,
                    competences: JSON.stringify(competences),
                    coordinatorID: coordinator,
                    degreeID: degree,
                    departmentID: department,
                    evaluation: evaluation,
                    internationalName: intlName,
                    language: language,
                    literature: literature,
                    minContents: minContents,
                    moduleID: module,
                    name: name,
                    period: period,
                    program: program,
                    results: results,
                    shorthand: shorthand.toUpperCase(),
                    subjectID: subject,
                    type: type,
                    year: year
                }).where("courseid", model.code).andWhere("schoolID", user.schoolID)
                    .returning(["subjectID", "moduleID"]).then((resp) => {
                    checkSubjectCount(oldSubject, db)
                    checkModuleCount(oldModule, db)
                    res.json("OK");
                    return true;
                }).catch(error => {
                    console.log(error)
                    res.status(400).json("Error during update");
                })
            }else{
                res.status(400).json("invalid action")
            }
        }
    }
    /*

        db.select("degreeDuration").from("degrees").where("degreeID", "=", degree).then(async data => {
            //check degree existence, and year within its duration
            if (year <= data[0].degreeDuration && year > 0) {
                //check if period is 0, 1 or 2
                if (period >= 0 && period <= 2) {
                    //check if shorthand's length is <=5
                    if (shorthand.length <= 5) {
                        //check if type is correct
                        if (type === "Obligatoria" || type === "Formación básica" || type === "Optativa" || type === "Trabajo de fin de grado") {
                            //check if ECTS is [TBD]
                            if (ECTS % 0.5 === 0) {
                                //check existance OR create new
                                let subjectExists=false;
                                if (Number.isInteger(subject)) {
                                    await db.select('subjectDegree').from('subjects').where('subjectID', "=", subject).then(data => {
                                            if(data[0].subjectDegree===degree){
                                                subjectExists=true;
                                            }
                                    })
                                }else{
                                    await db.select("subjectID").from("subjects").whereILike("subjectName", subject)
                                        .andWhere("subjectDegree", "=", degree).then(async (ret) => {
                                            if (ret.length === 0) {
                                                await db.insert({
                                                    subjectName: subject,
                                                    subjectDegree: degree
                                                }).into("subjects").returning("subjectID").then(id => {
                                                    subject = id[0].subjectID;
                                                })
                                                subjectExists = true
                                            }else{
                                                subject = ret[0].subjectID
                                                subjectExists=true
                                            }
                                        })
                                }
                                if(!subjectExists){
                                    validated = false
                                    res.status(400).json("invalid subject")
                                }else{
                                    //check existance OR create new
                                    let moduleExists=false;
                                    if (Number.isInteger(module)) {
                                        await db.select('moduleDegree').from('modules').where('moduleID', "=", module).then(data => {
                                            if(data[0].moduleDegree===degree){
                                                moduleExists=true;
                                            }
                                        })
                                    }else{
                                        await db.select("moduleID").from("modules").whereILike("moduleName", module)
                                            .andWhere("moduleDegree", "=", degree).then(async (ret) => {
                                                if (ret.length === 0) {
                                                    await db.insert({
                                                        moduleName: module,
                                                        moduleDegree: degree
                                                    }).into("modules").returning("moduleID").then(id => {
                                                        module = id[0].moduleID;
                                                    })
                                                    moduleExists = true
                                                }else{
                                                    module = ret[0].moduleID
                                                    moduleExists=true
                                                }
                                            })
                                    }
                                    if(!moduleExists){
                                        validated = false
                                        res.status(400).json("invalid module")
                                    }else{
                                        //check coordinator and department
                                        db.select("departmentID").from("users").where("userID", "=", coordinator).then(data => {
                                            if(data[0].departmentID === department){
                                                if(model.action==="create"){
                                                    db.insert({
                                                        ects: ECTS,
                                                        courseid: code,
                                                        competences: JSON.stringify(competences),
                                                        coordinatorID: coordinator,
                                                        degreeID: degree,
                                                        departmentID: department,
                                                        evaluation: evaluation,
                                                        internationalName: intlName,
                                                        language: language,
                                                        literature: literature,
                                                        minContents: minContents,
                                                        moduleID: module,
                                                        name: name,
                                                        period: period,
                                                        program: program,
                                                        results: results,
                                                        shorthand: shorthand.toUpperCase(),
                                                        subjectID: subject,
                                                        type: type,
                                                        year: year,
                                                        schoolID: user.schoolID
                                                    }).into("courses").returning("courseid").then(done => {
                                                        res.json("OK");
                                                        return validated;
                                                    }).catch(error => {
                                                        console.log(error)
                                                        res.status(400).json("Code already in use");
                                                    })
                                                }
                                                if(model.action==="update"){
                                                    //get old module and subject in case they change
                                                    db.select(["moduleID", "subjectID"]).from("courses").where("courseid", model.code).andWhere("schoolID", user.schoolID)
                                                        .then(ret => {
                                                            const oldModule = ret[0].moduleID, oldSubject = ret[0].subjectID

                                                            db("courses").update({
                                                                ects: ECTS,
                                                                competences: JSON.stringify(competences),
                                                                coordinatorID: coordinator,
                                                                degreeID: degree,
                                                                departmentID: department,
                                                                evaluation: evaluation,
                                                                internationalName: intlName,
                                                                language: language,
                                                                literature: literature,
                                                                minContents: minContents,
                                                                moduleID: module,
                                                                name: name,
                                                                period: period,
                                                                program: program,
                                                                results: results,
                                                                shorthand: shorthand.toUpperCase(),
                                                                subjectID: subject,
                                                                type: type,
                                                                year: year
                                                            }).where("courseid", model.code).andWhere("schoolID", user.schoolID)
                                                                .returning(["subjectID", "moduleID"]).then((resp) => {
                                                                checkSubjectCount(oldSubject, db)
                                                                checkModuleCount(oldModule, db)
                                                                res.json("OK");
                                                                return validated;
                                                            }).catch(error => {
                                                                console.log(error)
                                                                res.status(400).json("Error during update");
                                                            })
                                                        })
                                                }
                                            }else{
                                                validated = false
                                                res.status(400).json("invalid coordinator or department")
                                            }
                                        })
                                    }
                                }

                            } else {
                                validated = false
                                res.status(400).json("invalid ECTS")
                            }
                        } else {
                            validated = false
                            res.status(400).json("invalid type")
                        }
                    } else {
                        validated = false
                        res.status(400).json("invalid shorthand")
                    }
                } else {
                    validated = false
                    res.status(400).json("invalid period")
                }
            } else {
                validated = false
                res.status(400).json("invalid year")
            }
        }).catch(error => {
            console.log(error)
            validated=false
            res.status(400).json("invalid degree")
        })



    return validated;

     */
}