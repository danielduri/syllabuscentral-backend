import {checkModuleCount, checkSubjectCount} from "../../functions/checkCounts.js";

export function uploadModel(model, db, res, user){

    const {degree, year, period, language, code, name, intlName, shorthand,
        type, ECTS, department, coordinator, minContents, program,
        results, evaluation, literature, competences} = model

    let {subject, module} = model

    const {basic, general, specific} = competences

    let validated=true

    if(degree===null || degree===undefined || !Number.isInteger(degree)){
        validated=false
        res.status(400).json("degreeID")
    }else if(year===null || year===undefined || !Number.isInteger(year)){
        validated=false
        res.status(400).json("year")
    }else if(period===null || period===undefined || !Number.isInteger(period)){
        validated=false
        res.status(400).json("period")
    }else if(language===null || language===undefined || language===""){
        validated=false
        res.status(400).json("language")
    }else if(code===null || code===undefined || !Number.parseInt(code)){
        validated=false
        res.status(400).json("code")
    }else if(name===null || name===undefined || name===""){
        validated=false
        res.status(400).json("courseName")
    }else if(intlName===null || intlName===undefined || intlName===""){
        validated=false
        res.status(400).json("intlName")
    }else if(shorthand===null || shorthand===undefined || shorthand===""){
        validated=false
        res.status(400).json("shorthand")
    }else if(type===null || type===undefined || type===""){
        validated=false
        res.status(400).json("type")
    }else if(ECTS===null || ECTS===undefined || ECTS%0.5!==0){
        validated=false
        res.status(400).json("ECTS")
    }else if(subject===null || subject===undefined || subject===""){
        validated=false
        res.status(400).json("subject")
    }else if(module===null || module===undefined || module===""){
        validated=false
        res.status(400).json("module")
    }else if(department===null || department===undefined || !Number.isInteger(department)){
        validated=false
        res.status(400).json("department")
    }else if(coordinator===null || coordinator===undefined || !Number.isInteger(coordinator)){
        validated=false
        res.status(400).json("coordinator")
    }else if(minContents===null || minContents===undefined || !Array.isArray(minContents)){
        validated=false
        res.status(400).json("minContents")
    }else if(program===null || program===undefined || !Array.isArray(program)){
        validated=false
        res.status(400).json("program")
    }else if(results===null || results===undefined || !Array.isArray(results)){
        validated=false
        res.status(400).json("results")
    }else if(evaluation===null || evaluation===undefined || evaluation===""){
        validated=false
        res.status(400).json("evaluation")
    }else if(literature===null || literature===undefined || !Array.isArray(literature)){
        validated=false
        res.status(400).json("literature")
    }else if(basic===null || basic===undefined || !Array.isArray(basic)){
        validated=false
        res.status(400).json("basic")
    }else if(general===null || general===undefined || !Array.isArray(general)){
        validated=false
        res.status(400).json("general")
    }else if(specific===null || specific===undefined || !Array.isArray(specific)){
        validated=false
        res.status(400).json("specific")
    }else{

        db.select("degreeDuration").from("degrees").where("degreeID", "=", degree).then(async data => {
            //check degree existence, and year within its duration
            if (year <= data[0].degreeDuration && year > 0) {
                //check if period is 0, 1 or 2
                if (period >= 0 && period <= 2) {
                    //check if shorthand's length is <=5
                    if (shorthand.length <= 5) {
                        //check if type is correct
                        if (type === "Obligatoria" || type === "Formación Básica" || type === "Optativa" || type === "Trabajo de fin de grado") {
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
                                                        courseID: code,
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
                                                    }).into("courses").returning("courseID").then(done => {
                                                        res.json("OK");
                                                        return validated;
                                                    }).catch(error => {
                                                        console.log(error)
                                                        res.status(400).json("Code already in use");
                                                    })
                                                }
                                                if(model.action==="update"){
                                                    //get old module and subject in case they change
                                                    db.select(["moduleID", "subjectID"]).from("courses").where("courseID", model.code).andWhere("schoolID", user.schoolID)
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
                                                            }).where("courseID", model.code).andWhere("schoolID", user.schoolID)
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

    }

    return validated;
}