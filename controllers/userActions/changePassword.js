const validateUserWithID = async (userID, password, db, bcrypt) => {
    let ret = false;

    await db.select('userID', 'passwordHash').from('users').where('userID', '=', userID)
        .then(data => {
            ret = bcrypt.compareSync(password, data[0].passwordHash);
        }).catch(err => {
            console.log(err)
        })

    return ret;
}

export const validatePassword = (password) => {
    //La contraseña debe contener al menos 6 caracteres, entre ellos
    //al menos una letra mayúscula, una letra minúscula, un número y un caracter especial.
    if(process.env.NODE_ENV !== 'production' && password==="pass"){
        return true;
    }
    if(password.length<6){
        return false;
    }

    return String(password)
        .match(
            /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{6,16}$/
        );
};

export const changePassword = async (req, res, db, bcrypt) => {
    const {newPassword, oldPassword} = req.body;
    const {userID} = req.user;

    if (!userID || !newPassword || !oldPassword) {
        res.status(400).json("incorrect form submission");
        return;
    }


    if(!validatePassword(newPassword)){
        res.status(400).json("invalid new password");
        return;
    }


    await validateUserWithID(userID, oldPassword, db, bcrypt).then(
        valid => {
            if (valid) {

                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(newPassword, salt);

                db.from('users').update({passwordHash: hash}).where({userID: userID}).returning(["userID"])
                    .then(data => {
                        res.json("OK")
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(400).json('error updating password')
                    })
            } else {
                res.status(400).json('wrong password')
            }
        }
    )
}