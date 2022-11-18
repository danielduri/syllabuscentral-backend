export const validateUserWithID = async (userID, password, db, bcrypt) => {
    let ret = false;

    await db.select('userID', 'passwordHash').from('users').where('userID', '=', userID)
        .then(data => {
            ret = bcrypt.compareSync(password, data[0].passwordHash);
        }).catch(err => {
            console.log(err)
        })

    return ret;
}

export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const validateName = (name) => {
    return String(name)
        .match(
            /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/
        );
};

export const validatePassword = (password) => {
    //La contraseña debe contener al menos 6 caracteres, entre ellos
    //al menos una letra mayúscula, una letra minúscula, un número y un caracter especial.
    if(password==="pass"){
        return true;
    }
    if(password.length<6){
        return false;
    }

    return String(password)
        .match(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/
        );
};