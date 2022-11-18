const userInfo = (req, res, db) => {

    const {userID} = req.body;

    if(!userID){
        res.status(400).json('incorrect form submission');
        return;
    }

    db.select('userID', 'email', 'userName', 'userType', 'departmentID').from('users').where({
        'userID': userID
    }).then(data => {
        if(data[0]!==undefined){
            res.json(data[0]);
        }else{
            res.status(400).json('wrong credentials');
        }
    }).catch(err => {
        console.log(err)
        res.status(400).json('unable to get user');
    })
}

export default userInfo;