import jwt from "jsonwebtoken";

export const verifyTokenOld = (req, res, next)=>{
    req.user = {userID:null, verified:false}
    const { privateKey } = process.env
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader!=='undefined') {
        const bearerToken = bearerHeader.split(' ')[1]
        try {
            const decode = jwt.verify(bearerToken, privateKey);
            if (decode.userID!==undefined) {
                req.user = {userID: decode.userID, verified: true};
                next();
            }else {
                return res.sendStatus(403).json("incorrect token")
            }
        } catch (error) {
            if(error instanceof jwt.TokenExpiredError){
                return res.status(403).json("Token Expired");
            }else{
                return res.sendStatus(403)
            }
        }

    } else {
        return res.sendStatus(403).json("incorrect token")
    }
}


//Returns req.user info if token is valid, otherwise responds string with error message
export const verifyToken = (req, res, next) =>{
    req.user = {userID:null, verified:false}
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader!=='undefined') {
        const bearerToken = bearerHeader.split(' ')[1]
        const user = getUserFromToken(bearerToken)
        if(typeof user === "string"){
            return res.status(403).json(user)
        }else{
            req.user = {userID: user, verified: true};
            next();
        }

    }
}

//Returns userID if token is valid, otherwise returns string with error message
export const getUserFromToken = (token) =>{
    const { privateKey } = process.env
    try {
        const decode = jwt.verify(token, privateKey);
        if (decode.userID!==undefined) {
            return decode.userID
        }else {
            return "incorrect token"
        }
    } catch (error) {
        if(error instanceof jwt.TokenExpiredError){
            return "Token Expired"
        }else{
            return "Error"
        }
    }
}

