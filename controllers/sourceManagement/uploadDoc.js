import fs from "fs";
import {recognize} from "../azureNeural/azureNeural.js";

const parseDocument = (docName, docLocation, res) => {
    const file = fs.createReadStream(`${docLocation}/${docName}`)
    recognize(file).then(r => {
        fs.unlinkSync(`${docLocation}/${docName}`)
        console.log(r)
        res.json(r);
    }).catch((e) => {
            res.status(400).json("error")
            console.log("Azure ", e)
    })
    /*
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

     */

}

export const uploadDoc = (res, fileName, fileLocation) => {
    console.log("Uploaded ", fileName)
    parseDocument(fileName, fileLocation, res)
}

