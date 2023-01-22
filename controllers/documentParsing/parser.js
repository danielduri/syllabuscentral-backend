import fs from "fs";
import {Syllabus} from "./syllabus.js";

function strlen (str) {
    let sl = str.length
    let chars = sl
    let i;
    for (i = 0; i < sl; i++) if (str.codePointAt(i) > 65535) {
        chars--;
        i++;
    }
    return chars
}

export const getJSONs = (docName) => {
    const json = fs.readFileSync(`./staging/${docName}.json`)

    const content = JSON.parse(json);
    const pages = content.Pages;
    let str = [];
    let partialString = "";
    let line = 0;

    const documentMarkers = {
        degree: ["Grado", "Curso"],
        year: ["Curso", null],
        period: [null, ")Idioma"],
        language: [")Idioma", "Asignatura"],
        code: ["Asignatura", null],
        name: [null, "Asignatura en Inglés"],
        intlName: ["Asignatura en Inglés", "Abrev"],
        shorthand: ["Abrev", "Carácter"],
        type: ["Carácter", null],
        ECTStotal: [null, "Materia"],
        subject: ["Materia", null],
        module: ["Módulo", "Departamento"],
        department: ["Departamento", "Coordinador"],
        coordinator: ["Coordinador", "Descripción de c"],
        minContents: ["mínimos", "Programa detallado"],
        program: ["Programa detallado", "Programa detallado en inglés"],
        competences: {
            general: ["Generales", "Específicas"],
            specific: ["Específicas", "Básicas y"],
            basic: ["Transversales","Resultados de aprendizaje"]
        },
        results: ["Resultados de aprendizaje", "Evaluación"],
        evaluation: ["detallada", "Actividades docentes"],
        activities: [null, "Bibliografía"],
        literature: ["Bibliografía", "Ficha docente guardad"]
    }

    const findContentBetween = (markers, str, newLine) => {
        let ret="";
        if(markers[1]!==null){
            if(markers[0]!==null ){
                while(!str[line].includes(markers[0]) && line<str.length){
                    line++;
                }
                line++;
            }
            while(!str[line].includes(markers[1]) && line<str.length){

                if(str[line].includes("UNIVERSIDAD COMPLUTE")){
                    while (!str[line].includes("Firma del Director del Departamento") && line<str.length){
                        line++;
                    }
                }else{
                    ret+=str[line];
                }

                if(newLine){
                    ret+='\n';
                }else{
                    ret+=" ";
                }

                line++;
            }
        }else{
            if (markers[0]!==null) {
                while (!str[line].includes(markers[0]) && line < str.length) {
                    line++;
                }
                line++;
            }
            ret=str[line++];
        }
        if(newLine){
            return ret.trim().split("\n");
        }
        return ret.trim();
    }

    function parseString(str) {
        for (let i = 0; i < str.length; i++) {
            //console.log(i, ":", str[i]);
        }
        line=0;
        const degree = findContentBetween(documentMarkers.degree, str);
        let year = Number.parseInt(findContentBetween(documentMarkers.year, str).at(0));
        let period = null;
        if(isNaN(year)){
            const yearLine = findContentBetween([null, null], str);
            const periodLine = findContentBetween(documentMarkers.period, str).at(1);
            if(yearLine.includes("generales 3º y 4º")){
                year=0;
                period=Number.parseInt(periodLine);
            }else if(yearLine.includes("itinerario")){
                year=Number.parseInt(yearLine.charAt(11))
            }
        }else{
            period = Number.parseInt(findContentBetween(documentMarkers.period, str).at(1));
        }
        const language = findContentBetween(documentMarkers.language, str);
        const code = Number.parseInt(findContentBetween(documentMarkers.code, str));
        const name = findContentBetween(documentMarkers.name, str).substring(1);
        const intlName = findContentBetween(documentMarkers.intlName, str);
        const shorthand = findContentBetween(documentMarkers.shorthand, str);
        const type = findContentBetween(documentMarkers.type, str);

        let ECTSv = findContentBetween(documentMarkers.ECTStotal, str);
        ECTSv = ECTSv.replace(",", ".");
        const num = ECTSv.indexOf("ECTS");
        const ECTS = Number.parseFloat(ECTSv.substring(0, num));

        const subject = findContentBetween(documentMarkers.subject, str);
        const module = findContentBetween(documentMarkers.module, str);
        const department = findContentBetween(documentMarkers.department, str);
        const coordinator = findContentBetween(documentMarkers.coordinator, str);
        const minContents = findContentBetween(documentMarkers.minContents, str, true);
        const program = findContentBetween(documentMarkers.program, str, true);

        const general = findContentBetween(documentMarkers.competences.general, str, true);
        const specific = findContentBetween(documentMarkers.competences.specific, str, true);
        const basic = findContentBetween(documentMarkers.competences.basic, str, true);

        const competences = JSON.stringify({
            basic: basic,
            general: general,
            specific: specific
        })

        const results = findContentBetween(documentMarkers.results, str, true);
        const evaluation = findContentBetween(documentMarkers.evaluation, str);

        const literature = findContentBetween(documentMarkers.literature, str, true);

        /*
        if(isNaN(year)){
            console.log("YEAR", shorthand);
        }
        if(isNaN(period)){
            console.log("PERIOD", shorthand);
        }

         */

        let model = new Syllabus(
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
            literature
        )
        /*
        const dir = `models/${degree}`
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

         */
        //fs.writeFileSync(`${dir}/${shorthand}.json`, JSON.stringify(model, null, " "));
        return model;

    }

    //let response = []

    for (const page of pages) {
        const texts = page.Texts;
        for (const text of texts) {
            const item = decodeURIComponent(text.R[0].T).replace(':', "").trim();
            if(strlen(item)<= 1){
                partialString += item;
            }else{
                if(partialString.length > 0){
                    partialString += item
                    str.push(partialString);
                    partialString = "";
                }else{
                    str.push(item);
                }
            }

            if(item.includes("Ficha docente guarda")){
                //response.push(parseString(str));
                return parseString(str);
                //str=[];
            }
        }
    }

    return "Invalid document"
}

