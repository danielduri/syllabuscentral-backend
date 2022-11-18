import {validateEmail, validateName, validatePassword, validateUserWithID} from "./commonFunctions.js";

export const changeEmail = async (req, res, db, bcrypt) => {
    const {userID, newEmail, password} = req.body;

    if (!userID || !newEmail || !password) {
        res.status(400).json("incorrect form submission");
        return;
    }

    if(!validateEmail(newEmail)){
        res.status(400).json("invalid email");
        return;
    }

    await validateUserWithID(userID, password, db, bcrypt).then(
        valid => {
            if (valid) {
                db.from('users').update({email: newEmail}).where({userID: userID}).returning(["userID", "email"])
                    .then(data => {
                        res.json(data[0])
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(400).json('email already in use')
                    })
            } else {
                res.status(400).json('wrong password')
            }
        }
    )
}

export const changeName = async (req, res, db, bcrypt) => {
    const {userID, newName, password} = req.body;

    if (!userID || !newName || !password) {
        res.status(400).json("incorrect form submission");
        return;
    }


    if(!validateName(newName)){
        res.status(400).json("invalid name");
        return;
    }


    await validateUserWithID(userID, password, db, bcrypt).then(
        valid => {
            if (valid) {

                db.from('users').update({userName: newName}).where({userID: userID}).returning(["userID", "userName"])
                    .then(data => {
                        res.json(data[0])
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(400).json('error updating name')
                    })
            } else {
                res.status(400).json('wrong password')
            }
        }
    )
}

export const changePassword = async (req, res, db, bcrypt) => {
    const {userID, newPassword, oldPassword} = req.body;

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
                        res.json(data[0])
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

export const createUser = async (req, res, db, bcrypt) => {
    const {email, password, userName, departmentID} = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    if (!email || !password || !userName || !departmentID) {
        return res.status(400).json("incorrect form submission");
    }

    db.insert({
        email: email,
        passwordHash: hash,
        userName: userName,
        departmentID: departmentID,
        userType: 0
    }).into('users').returning("userID")
        .then(data=>{return res.json(data[0])})
        .catch(err => {return res.status(400).json("Something went wrong creating user")})
}