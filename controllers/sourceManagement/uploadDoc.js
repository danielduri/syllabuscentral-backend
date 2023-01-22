import fs from "fs";
import PDFParser from "pdf2json";
import {getJSONs} from "../documentParsing/parser.js";

const parseDocument = (docName, docLocation, res) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", errData => {
        console.log("Parser error: ", errData);
        fs.unlinkSync(`${docLocation}/${docName}`)
        res.json("Invalid file")
    } );
    pdfParser.on("pdfParser_dataReady", pdfData => {
        fs.writeFile(`./staging/${docName}.json`,
            JSON.stringify(pdfData, null, " "),"utf-8", ()=>{
                res.json(getJSONs(docName))
                fs.unlinkSync(`./staging/${docName}.json`)
                fs.unlinkSync(`${docLocation}/${docName}`)
        });
    });

    pdfParser.loadPDF(`${docLocation}/${docName}`).then(() => null);

}

export const uploadDoc = (res, fileName, fileLocation) => {
    console.log("Uploaded ", fileName)
    parseDocument(fileName, fileLocation, res)
}

