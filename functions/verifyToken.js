import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next)=>{
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