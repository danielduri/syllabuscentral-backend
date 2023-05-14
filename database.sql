create database

create sequence "courses_courseID_seq"
    as integer;

create table schools
(
    "schoolID"   serial
        constraint "schoolID"
            primary key,
    "schoolName" varchar,
    "schoolAdm"  boolean default false not null
);

create table departments
(
    "departmentID"        serial
        constraint "departmentID"
            primary key,
    "departmentName"      varchar    not null,
    "departmentShorthand" varchar(5) not null,
    "departmentSchoolID"  integer    not null
        constraint "departments_schoolID"
            references schools
            on delete cascade,
    constraint deptname_unique
        unique ("departmentName", "departmentSchoolID"),
    constraint deptshorthand_unique
        unique ("departmentShorthand", "departmentSchoolID")
);

create table users
(
    "userID"       serial
        primary key,
    email          varchar(50)  not null
        unique,
    "userName"     varchar(100) not null,
    "passwordHash" varchar(100) not null,
    "departmentID" integer
        constraint users_departments_null_fk
            references departments
            on delete cascade,
    "userType"     integer,
    "schoolID"     integer default 1
        constraint users_schools_null_fk
            references schools
            on delete cascade,
    constraint "userNameUnique"
        unique ("userName", "schoolID")
);

create table degrees
(
    "degreeID"          serial
        constraint degrees_pk
            primary key,
    "degreeDisplayName" varchar,
    "degreeRawName"     varchar,
    "degreeDuration"    smallint,
    "coordinatorID"     integer
        constraint degree_users_null_fk
            references users,
    "schoolID"          integer
        constraint degree_schools_null_fk
            references schools
            on delete cascade,
    constraint name_unique
        unique ("degreeRawName", "schoolID")
);

create table subjects
(
    "subjectID"     serial
        constraint subjects_pk
            primary key,
    "subjectName"   varchar,
    "subjectDegree" integer
        constraint subjects_degrees_null_fk
            references degrees
            on delete cascade,
    "subjectCount"  integer default 0,
    "subjectSchool" integer not null
        constraint "subjects_schools_schoolID_fk"
            references schools
            on delete cascade,
    constraint subjectname_unique
        unique ("subjectName", "subjectDegree")
);

create table modules
(
    "moduleID"     serial
        constraint modules_pk
            primary key,
    "moduleName"   varchar,
    "moduleDegree" integer
        constraint modules_degrees_null_fk
            references degrees
            on delete cascade,
    "moduleCount"  integer default 0,
    "moduleSchool" integer not null
        constraint "modules_schools_schoolID_fk"
            references schools
            on delete cascade,
    constraint modulename_unique
        unique ("moduleName", "moduleDegree")
);

create table courses
(
    courseid            integer default nextval('"courses_courseID_seq"'::regclass) not null,
    "degreeID"          integer
        constraint courses_degrees_null_fk
            references degrees
            on delete cascade,
    year                integer,
    period              integer,
    language            varchar,
    name                varchar,
    "internationalName" varchar,
    shorthand           varchar(5),
    type                varchar,
    ects                numeric,
    "subjectID"         integer
        constraint courses_subjects_null_fk
            references subjects
            on delete cascade,
    "moduleID"          integer
        constraint courses_modules_null_fk
            references modules
            on delete cascade,
    "departmentID"      integer
        constraint courses_departments_null_fk
            references departments
            on delete cascade,
    "coordinatorID"     integer
        constraint courses_users_null_fk
            references users,
    "minContents"       character varying[],
    program             character varying[],
    competences         varchar,
    results             character varying[],
    evaluation          character varying[],
    literature          character varying[],
    "schoolID"          integer                                                     not null
        constraint "courses_schools_schoolID_fk"
            references schools
            on delete cascade,
    constraint courses_pk
        primary key (courseid, "schoolID")
);

alter sequence "courses_courseID_seq" owned by courses.courseid;

create function keepmoduleandsubjectcount() returns trigger
    language plpgsql
as
$$
BEGIN
   CASE TG_OP
   WHEN 'INSERT' THEN
      UPDATE modules AS m
      SET    "moduleCount" = m."moduleCount" + 1
      WHERE  m."moduleID" = NEW."moduleID";
      UPDATE subjects AS s
      SET    "subjectCount" = s."subjectCount" + 1
      WHERE  s."subjectID" = NEW."subjectID";
   WHEN 'DELETE' THEN

      UPDATE modules AS m
      SET    "moduleCount" = m."moduleCount" - 1
      WHERE  m."moduleID" = OLD."moduleID";

      UPDATE subjects AS s
      SET    "subjectCount" = s."subjectCount" - 1
      WHERE  s."subjectID" = OLD."subjectID";
   WHEN 'UPDATE' THEN
      UPDATE modules AS m
      SET    "moduleCount" = m."moduleCount" - 1
      WHERE  m."moduleID" = OLD."moduleID";
      UPDATE modules AS m
      SET    "moduleCount" = m."moduleCount" + 1
      WHERE  m."moduleID" = NEW."moduleID";

      UPDATE subjects AS s
      SET    "subjectCount" = s."subjectCount" - 1
      WHERE  s."subjectID" = OLD."subjectID";
      UPDATE subjects AS s
      SET    "subjectCount" = s."subjectCount" + 1
      WHERE  s."subjectID" = NEW."subjectID";
   ELSE
      RAISE EXCEPTION 'Unexpected TG_OP: "%". Should not occur!', TG_OP;
   END CASE;

   RETURN NULL;
END
$$;

create trigger updatemoduleandsubjectcount
    after insert or update or delete
    on courses
    for each row
execute procedure keepmoduleandsubjectcount();

