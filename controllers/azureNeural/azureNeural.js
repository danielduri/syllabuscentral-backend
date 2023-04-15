/*
  This code sample shows Custom Model operations with the Azure Form Recognizer client library.

  To learn more, please visit the documentation - Quickstart: Form Recognizer Javascript client library SDKs
  https://docs.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/quickstarts/try-v3-javascript-sdk
*/

const extractContent = (values) => {
    let result = []
    for (const element of values) {

        result.push(Object.values(element.properties)[0].content)
    }
    return result
}

import {AzureKeyCredential, DocumentAnalysisClient} from "@azure/ai-form-recognizer";
import {Syllabus} from "../documentParsing/syllabus.js";

/*
* This sample shows how to analyze a document using a model with a given ID. The model ID may refer to any model,
* whether custom, prebuilt, composed, etc.
*
* @summary analyze a document using a model by ID
*/
export async function recognize(file, ws) {
    /*
      Remember to remove the key from your code when you're done, and never post it publicly. For production, use
      secure methods to store and access your credentials. For more information, see
      https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-security?tabs=command-line%2Ccsharp#environment-variables-and-application-configuration
    */
    const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT || "<endpoint>";
    const credential = new AzureKeyCredential(process.env.FORM_RECOGNIZER_API_KEY || "<api key>");
    const client = new DocumentAnalysisClient(endpoint, credential);

    const modelId = process.env.FORM_RECOGNIZER_CUSTOM_MODEL_ID || "<custom model ID>";

    const poller = await client.beginAnalyzeDocument(
        modelId,
        file
    );

    const {
        documents: [document],
    } = await poller.pollUntilDone();

    poller.onProgress(({ status }) => {
        ws.send(JSON.stringify({status: status}))
    })



    if (!document) {
        throw new Error("Expected at least one document in the result.");
    }

    console.log(
        "Extracted document:",
        document.docType,
        `(confidence: ${document.confidence || "<undefined>"})`
    );
    console.log("Fields:", JSON.stringify(document.fields));
    const fields = document.fields

    let model = new Syllabus(
        fields.degree.value ? fields.degree.value : "",
        fields.year.value ? Number.parseInt(fields.year.value.replaceAll("\\D+","")) : null,
        fields.period.value ? Number.parseInt(fields.period.value.replaceAll("\\D+","")) : null,
        fields.language.value ? fields.language.value : "",
        fields.code.value ? fields.code.value : "",
        fields.name.value ? fields.name.value : "",
        fields.intlName.value ? fields.intlName.value : "",
        fields.shorthand.value ? fields.shorthand.value : "",
        fields.type.value ? fields.type.value : "",
        fields.ECTS.value ? Number.parseInt(fields.ECTS.value.replaceAll("\\D+","")) : null,
        fields.subject.value ? fields.subject.value : "",
        fields.module.value ? fields.module.value : "",
        fields.department.value ? fields.department.value : "",
        fields.coordinator.value ? fields.coordinator.value : "",
        fields.minContents.values ? extractContent(fields.minContents.values) : [],
        fields.program.values ? extractContent(fields.program.values) : [],

        JSON.stringify({
            basic: fields.competencesBasic.values ? extractContent(fields.competencesBasic.values) : [],
            general: fields.competencesGeneral.values ? extractContent(fields.competencesGeneral.values) : [],
            specific: fields.competencesSpecific.values ? extractContent(fields.competencesSpecific.values) : []
        }),

        fields.results.values ? extractContent(fields.results.values) : [],
        //TODO extract content evaluation. Retrain model.
        fields.evaluation.value ? fields.evaluation.value : "",
        fields.literature.values ? extractContent(fields.literature.values) : []

    )

    return model;
}