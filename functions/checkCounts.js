export function checkSubjectCount(subjectID, db){
    return db.select("subjectCount").from("subjects").where({"subjectID": subjectID}).then((count) => {
        if(count[0].subjectCount===0){
            console.log("it's 0")
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

