import {Configuration, OpenAIApi} from "openai";

export async function handleMsg(req, res) {
    console.log(req.body)

    const {field, title, degree, completion} = req.body
    if (!field || !title || !degree) {
        res.status(400).json('incorrect form submission');
        return
    }

    const formatModel = "array[String]"
    const example = `["item 1", "item 2", "item 3"]`

    let completionMessage = ""
    if (completion) {
        //completionMessage = `de manera que complemente los siguientes items (no repetir): ${completion},`
    }

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const GPT35TurboMessage = [
        {
            role: "system",
            content: `You are an AI model returning suggestions to help a Professor write a course guide. 
            Return all answers as a parseable ${formatModel} in the following format: ${example}. 
            Do not repeat items if given. Do not add trailing commas in the array. 
            Return the answer in the most raw format possible. Return all answers in Spanish.
            Do not add additional text to the answer. Do not explain or add leading text. Begin all answers with [ and end with ].
            Wrap each item in double quotes, and separate each item with commas.`
        },
        {
            role: "user",
            content: `Escribe sugerencias para el campo ${field} de una guía docente para la asignatura ${title} (${degree}), ${completionMessage} en formato ${formatModel} crudo.`
        }
    ];

    return  openai.createChatCompletion({
        model: process.env.OPENAI_MODEL,
        messages: GPT35TurboMessage,
    }).then((response) => {
        console.log("OpenAI response: ");
        console.log(response.data.choices[0].message.content);
        const cost = response.data.usage.total_tokens * process.env.COST_PER_1000_TOKENS / 1000;
        console.log("Cost: " + response.data.usage.total_tokens + " tokens, " + cost + " $");
        res.json({
            recommendations: response.data.choices[0].message.content,
            cost: cost
        });
    }).catch((err) => {
        console.log(err);
    })

}

export const returnDummyArray = (req, res) => {
    console.log('returning dummy array')
    res.json({
        recommendations: '["Conceptos básicos de lógica proposicional", "Cálculo proposicional", "Técnicas de demostración", "Lógica de predicados", "Álgebra de Boole", "Combinatoria", "Teoría de grafos", "Árboles", "Gráficos planares", "Automatas finitos", "The Moore y Mealy Machines", "Resolución de problemas en Matemática Discreta y Lógica", "Aplicaciones en Ingeniería de Computadores"]',
        cost: 0.025
    })
}