//Returns a promise that will yield 0 if USER, 1 if ADMIN, 2 if SUPERADMIN
export const verifyUserTypeAndSchool = async (userID, db) => {
    return await db.select('userType', 'schoolID', 'departmentID').from('users').where({
        'userID': userID
    }).then(data => {
        if (data[0] !== undefined) {
            return data[0]
        } else {
            return null;
        }
    }).catch(err => {
        console.log(err)
        return null;
    })
}