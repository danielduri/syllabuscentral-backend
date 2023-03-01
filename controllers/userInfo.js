import {getSchoolNameFromID} from "../functions/dataGetters.js";

export const userInfo = (req, res, db) => {

    const {userID} = req.user;

    if(!userID){
        res.status(400).json('incorrect form submission');
        return;
    }

    db.select('email', 'userName', 'userType', 'departmentID', 'schoolID').from('users').where({
        'userID': userID
    }).then( async data => {
        if (data[0] !== undefined) {
            const userInfo = {
                email: data[0].email,
                userName: data[0].userName,
                userType: data[0].userType,
                departmentID: data[0].departmentID,
                schoolID: data[0].schoolID,
                schoolName: await getSchoolNameFromID(data[0].schoolID, db)
            }
            console.log(userInfo)
            res.json(userInfo);
        } else {
            res.status(400).json('wrong credentials');
        }
    }).catch(err => {
        console.log(err)
        res.status(400).json('unable to get user');
    })
}