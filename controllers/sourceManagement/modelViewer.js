import {verifyUserTypeAndSchool} from "../../functions/verifyUserTypeAndSchool.js";
import {
    getDepartmentIDFromName,
    getModuleIDFromName,
    getSubjectIDFromName,
    getUserIDFromName
} from "../../functions/idGetters.js";
import {uploadModel} from "./uploadModel.js";

export const modelViewer = (req, res, db) => {


    const {reqType} = req.body;
    const {userID} = req.user;

    if(!reqType || !userID){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserTypeAndSchool(userID, db).then(user => {
        if(user.userType>=0){
            if(reqType==="initial"){
                let resp = {}
                db.select('degreeDisplayName', 'degreeID').from('degrees').where({'schoolID': user.schoolID}).then(data => {
                    resp.degrees = data
                    if(user.userType>=1){
                        db.select('departmentName', 'departmentID').from('departments').where({'departmentSchoolID': user.schoolID}).then(data => {
                            resp.departments = data;
                            res.json(resp);
                        }).catch(error => console.log)
                    }else{
                        db.select('departmentName', 'departmentID').from('departments').where({'departmentID': user.departmentID}).then(data => {
                            resp.departments = data;
                            res.json(resp);
                        }).catch(error => console.log)
                    }

                }).catch(error => console.log)
            }else if(reqType==="degree"){
                let resp = {}
                let {degree} = req.body

                if(!degree){
                    res.status(400).json('incorrect form submission');
                    return;
                }

                db.select('degreeDuration').from('degrees').where({'degreeID': degree}).then(data => {
                    resp.duration = data[0].degreeDuration
                    db.select('subjectName', 'subjectID').from('subjects').where({'subjectDegree': degree}).then(data => {
                        resp.subjects = data
                        db.select('moduleName', 'moduleID').from('modules').where({'moduleDegree': degree}).then(data => {
                            resp.modules = data
                            res.json(resp);
                        }).catch(error => console.log)
                    }).catch(error => console.log)
                }).catch(error => console.log)
            }else if(reqType==="department"){
                let resp = {}
                const {department} = req.body

                if(!department){
                    res.status(400).json('incorrect form submission');
                    return;
                }

                if(user.userType>=1){
                    db.select('userName', 'userID').from('users').where({'departmentID': department}).then(data => {
                        resp.coordinators = data
                        res.json(resp)
                    }).catch(error => console.log)
                }else{
                    db.select('userName', 'userID').from('users').where({'userID': userID}).then(data => {
                        resp.coordinators = data
                        res.json(resp)
                    }).catch(error => console.log)
                }

            }else if(reqType==="model"){
                let resp = {}
                const {degree, department, module, subject, coordinator} = req.body
                let promises = []

                if(degree){
                    try {
                        let str = degree
                        if(degree.label){
                            str=degree.label
                        }
                        const rawName = str.toLowerCase()
                            .replaceAll(" ", "")
                            .replaceAll("á", "a")
                            .replaceAll("é", "e")
                            .replaceAll("í", "i")
                            .replaceAll("ó", "o")
                            .replaceAll("ú", "u")

                        const p1 = db.select('degreeDisplayName', 'degreeID', 'degreeDuration').from('degrees').where({'degreeRawName': rawName}).then(async data => {
                            resp.degree = data[0]
                            resp.duration = data[0].degreeDuration
                            await db.select('subjectName', 'subjectID').from('subjects').where({'subjectDegree': data[0].degreeID}).then( async data => {
                                resp.subjects = data

                                if (subject) {
                                    await getSubjectIDFromName(subject, resp.degree.degreeID, db).then(data => {
                                        resp.subject = data
                                    }).catch(error => console.log);
                                }
                            }).catch(error => console.log)

                            await db.select('moduleName', 'moduleID').from('modules').where({'moduleDegree': data[0].degreeID}).then( async data => {
                                resp.modules = data

                                if (module) {
                                    await getModuleIDFromName(module, resp.degree.degreeID, db).then(data => {
                                        resp.module = data
                                    }).catch(error => console.log);
                                }
                            }).catch(error => console.log)

                        }).catch(error => console.log)

                        promises.push(p1)
                    }catch (error){console.log("error", error)}
                }

                if(department){

                    const p2 = getDepartmentIDFromName(department, user.schoolID, db).then(async data => {
                        resp.department = data
                        await db.select('userName', 'userID').from('users').where({'departmentID': data.departmentID}).then(data => {
                            resp.coordinators = data
                        }).catch(error => console.log)

                    }).catch(error => console.log);
                    promises.push(p2)
                }

                if(coordinator){
                    const p5 = getUserIDFromName(coordinator, user.schoolID, db).then(data => {
                        resp.coordinator = data
                    }).catch(error => console.log);
                    promises.push(p5)
                }







                Promise.all(promises).then((data) => {
                    res.json(resp);
                }).catch(error => console.log)

            }else if(reqType==="upload"){
                const {model} = req.body

                if(!model){
                    res.status(400).json('incorrect form submission');
                    return;
                }else{
                    model.action = "create"
                }

                if (uploadModel(model, db, res, user)){
                    console.log("Uploaded new model", model)
                }

            }else{
                res.status(400).json("incorrect form submission")
            }
        }else{
            res.status(403).json("you don't have permission to perform this action")
        }
    })
}