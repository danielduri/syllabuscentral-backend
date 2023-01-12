export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

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