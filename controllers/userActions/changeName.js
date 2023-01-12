export const validateName = (name) => {
    if(name.length<2){
        return false;
    }
    return String(name)
        .match(
            /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/
        );
};

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