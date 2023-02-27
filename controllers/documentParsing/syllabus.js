export class Syllabus {
    /*
    degree: string
    year: number
    period: number
    language: string
    code: string
    name: string
    intlName: string
    shorthand: string
    type: string

    ECTS: number

    subject: string
    module: string
    department: string
    coordinator: string
    minContents: string[]
    program: string[]

    competences = {
        basic: [],
        general: [],
        specific: []
    }

    results: string[];
    evaluation: string;

    literature: string[];

     */

    constructor(
        degree,
        year,
        period,
        language,
        code,
        name,
        intlName,
        shorthand,
        type,
        ECTS,
        subject,
        module,
        department,
        coordinator,
        minContents,
        program,
        competences,
        results,
        evaluation,
        literature) {

        this.degree = degree;
        this.year = year;
        this.period = period;
        this.language = language;
        this.code = code;
        this.name = name;
        this.intlName = intlName;
        this.shorthand = shorthand;
        this.type = type;
        this.ECTS = ECTS;
        this.subject = subject;
        this.module = module;
        this.department = department;
        this.coordinator = coordinator;
        this.minContents = minContents;
        this.program = program;
        this.competences = competences;
        this.results = results;
        this.evaluation = evaluation;
        this.literature = literature;
    }
}