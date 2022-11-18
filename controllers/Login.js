const handleSignIn = (req, res, db, bcrypt) => {

    const {email, password} = req.body;

    if(!email || !password){
        res.status(400).json('incorrect form submission');
        return;
    }

    db.select('email', 'passwordHash').from('users').where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].passwordHash);
            if (isValid) {
                db.select('userID', 'userName', 'email', 'departmentID', 'userType')
                    .from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0]);
                    }).catch(err => {
                    res.status(400).json('unable to get user');
                })
            } else {
                res.status(400).json('wrong credentials');
            }
        }).catch(err => {
        res.status(400).json('wrong credentials')
    })
}

export default handleSignIn;