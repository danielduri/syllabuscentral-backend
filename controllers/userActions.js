import {validateEmail, validateName, validatePassword, validateUserWithID} from "./commonFunctions.js";

export const changeEmail = async (req, res, db) => {
    const {newEmail} = req.body;
    const {userID} = req.user;

    if (!userID || !newEmail) {
        res.status(400).json("incorrect form submission");
        return;
    }

    if(!validateEmail(newEmail)){
        res.status(400).json("invalid email");
        return;
    }

    db.from('users').update({email: newEmail}).where({userID: userID}).returning(["email"])
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            console.log(err)
            res.status(400).json('email already in use')
        })
}

export const changeName = (req, res, db) => {
    const {newName} = req.body;
    const {userID} = req.user;

    if (!userID || !newName) {
        res.status(400).json("incorrect form submission");
        return;
    }


    if(!validateName(newName)){
        res.status(400).json("invalid name");
        return;
    }

    db.from('users').update({userName: newName}).where({userID: userID}).returning(["userName"])
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            console.log(err)
            res.status(400).json('error updating name')
        })
}

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

export const createUser = async (req, res, db, bcrypt) => {
    const {email, password, userName, departmentID} = req.body;
    //TODO only userTypes 1 and 2 can createUser. schoolID comes from JWTtoken.

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
    }).into('users').returning("email")
        .then(data=>{return res.json(data[0])})
        .catch(err => {return res.status(400).json("Something went wrong creating user")})
}