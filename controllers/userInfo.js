export const userInfo = (req, res, db) => {

    const {userID} = req.user;

    if(!userID){
        res.status(400).json('incorrect form submission');
        return;
    }

    db.select('email', 'userName', 'userType', 'departmentID', 'schoolID').from('users').where({
        'userID': userID
    }).then(data => {
        if(data[0]!==undefined){
            const userInfo = {
                userInfo: data[0]
            }
            res.json(userInfo);
        }else{
            res.status(400).json('wrong credentials');
        }
    }).catch(err => {
        console.log(err)
        res.status(400).json('unable to get user');
    })
}