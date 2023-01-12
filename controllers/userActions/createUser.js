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
        .catch(err => {
            console.log(err);
            return res.status(400).json("Something went wrong creating user")
        })
}