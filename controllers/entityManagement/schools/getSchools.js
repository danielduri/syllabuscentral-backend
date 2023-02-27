import {verifyUserInfo} from "../../../functions/verifyUser.js";
import {
    getCourseCountBySchoolID,
    getDegreeCountBySchoolID,
    getDepartmentCountBySchoolID,
    getUserCountBySchoolID
} from "../../../functions/countGetters.js";

export const getSchools = (req, res, db) => {

    const {userID} = req.user;

    if(!userID){
        res.status(400).json('incorrect form submission');
        return;
    }

    verifyUserInfo(userID, db).then(user => {
        if(user.userType>=2){

            db.select("schoolID", "schoolName")
                .from("schools")
                .orderBy("schoolName")
                .then(async data => {
                    let response = []
                    for (const item of data) {
                        const degree = {
                            schoolName: item.schoolName,
                            schoolID: item.schoolID,
                            degreeCount: await getDegreeCountBySchoolID(item.schoolID, db),
                            courseCount: await getCourseCountBySchoolID(item.schoolID, db),
                            departmentCount: await getDepartmentCountBySchoolID(item.schoolID, db),
                            userCount: await getUserCountBySchoolID(item.schoolID, db)
                        }
                        response.push(degree)
                    }
                    res.json(response);
                })

        }else{
            res.status(403).json("you don't have permission to perform this action")
        }
    })
}