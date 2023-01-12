import jwt from "jsonwebtoken";

export const handleSignIn = (req, res, db, bcrypt) => {

    const {privateKey} = process.env
    const {email, password} = req.body;

    if(!email || !password){
        res.status(400).json('incorrect form submission');
        return;
    }

    db.select('email', 'passwordHash').from('users').where('email', '=', email)
        .then( data => {
            const isValid = bcrypt.compareSync(password, data[0].passwordHash);
            let token = null;
            if (isValid) {
                db.select('*')
                    .from('users')
                    .where('email', '=', email)
                    .then( user => {
                        token = jwt.sign({userID: user[0].userID}, privateKey, {expiresIn: '1h'})
                        res.json({token: token});
                    }).catch(err => {
                    res.status(400).json('unable to get user');
                })
            } else {
                res.status(400).json('wrong credentials');
            }
        }).catch(err => {
            console.log(err)
            res.status(400).json('wrong credentials')
        })
}