export const getCourseCount = async (degreeID, db) => {
  return await db
    .count("courseid")
    .from("courses")
    .where("degreeID", "=", degreeID)
    .then((data) => {
      return data[0].count;
    })
    .catch((error) => console.log(error));
};

export const getSubjectCount = async (degreeID, db) => {
  return await db
    .count("subjectID")
    .from("subjects")
    .where("subjectDegree", "=", degreeID)
    .then((data) => {
      return data[0].count;
    })
    .catch((error) => console.log(error));
};

export const getModuleCount = async (degreeID, db) => {
  return await db
    .count("moduleID")
    .from("modules")
    .where("moduleDegree", "=", degreeID)
    .then((data) => {
      return data[0].count;
    })
    .catch((error) => console.log(error));
};

export const getECTSCount = async (degreeID, db) => {
  return await db
    .sum("ects")
    .from("courses")
    .where("degreeID", "=", degreeID)
    .then((data) => {
      return data[0].sum ? data[0].sum : 0;
    })
    .catch((error) => console.log(error));
};

export const getDepartmentHeadcount = async (departmentID, db) => {
  return await db
    .count("userID")
    .from("users")
    .where({ departmentID: departmentID })
    .then(async (data) => {
      return data[0].count;
    });
};

export const getDegreeCountBySchoolID = async (schoolID, db) => {
  return await db
    .count("degreeID")
    .from("degrees")
    .where({ schoolID: schoolID })
    .then(async (data) => {
      return data[0].count;
    });
};

export const getCourseCountBySchoolID = async (schoolID, db) => {
  return await db
    .count("courseid")
    .from("courses")
    .where({ schoolID: schoolID })
    .then(async (data) => {
      return data[0].count;
    });
};

export const getDepartmentCountBySchoolID = async (schoolID, db) => {
  return await db
    .count("departmentID")
    .from("departments")
    .where({ departmentSchoolID: schoolID })
    .then(async (data) => {
      return data[0].count;
    });
};

export const getUserCountBySchoolID = async (schoolID, db) => {
  return await db
    .count("userID")
    .from("users")
    .where({ schoolID: schoolID })
    .andWhere("userType", "<", 2)
    .then(async (data) => {
      return data[0].count;
    });
};

export const getDegreeCoordinatorCountByUser = async (userID, db) => {
  return await db
    .count("degreeID")
    .from("degrees")
    .where({ coordinatorID: userID })
    .then(async (data) => {
      return data[0].count;
    });
};

export const getCourseCoordinatorCountByUser = async (userID, db) => {
  return await db
    .count("courseid")
    .from("courses")
    .where({ coordinatorID: userID })
    .then(async (data) => {
      return data[0].count;
    });
};
